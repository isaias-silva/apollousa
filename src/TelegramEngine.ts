import TelApi from "node-telegram-bot-api";

import { CustomSendOptions } from "./interfaces/CustomSendOptions";
import {
    DefaultCommander,
    DefaultEngine,
    IMessageReceived,
    IMessageSend
} from "gear-roboto";
import { createWriteStream } from "fs";
import path from "path";
import { pipeline } from "stream/promises";


export class TelegramEngine extends DefaultEngine {
    private telApi?: TelApi;

    constructor(private apiKey: string, cm?: DefaultCommander) {
        super(true, cm);
    }
    async connect(args: string[]): Promise<void> {

        try {
            if (!this.telApi) {
                this.telApi = new TelApi(this.apiKey)
                await this.telApi.startPolling({ polling: true })

                const adInfo = new Map<String, String>()
                adInfo.set("id", (await this.telApi.getMe()).id.toString())

                this.getEmitter().emit('g.conn', {
                    status: "connected",
                    adInfo
                })

                this.monitoring()

                if (this.commander) {
                    this.updateCommands()
                }

            }
        } catch (err) {
            this.logger.error(err)
            this.disconnect(args)
        }


    }
    async disconnect(args: string[]): Promise<void> {
        if (this.telApi) {
            if (this.enableLogs) this.logger.warn("end connection")

            await this.telApi.stopPolling();
            this.telApi = undefined
        }
    }

    async send(to: string, message: IMessageSend): Promise<void> {
        const { type, text, media, reply, opts } = message
        const params: CustomSendOptions = {}
        if (reply) {
            params["reply_to_message_id"] = parseInt(reply)
        }
        if (type != "text") {
            params['caption'] = text
        }
        if (opts) {

            const inline_keyboard: { text: string, callback_data: string }[][] = [[]]

            opts.forEach(opt => {
                inline_keyboard[0].push({
                    text: opt.text,
                    callback_data: opt.value
                })
            })
            params["reply_markup"] = { inline_keyboard }
        }
        await this.delay(1.5)
        switch (type) {
            case "text":
                if (text)
                    this.telApi?.sendMessage(to, text, params)
                break;
            case "image":
                if (media)
                    this.telApi?.sendPhoto(to, media, params)
                break;
            case "document":
            case "file":
                if (media)
                    this.telApi?.sendDocument(to, media, params)
                break;
            case "video":
                if (media)
                    this.telApi?.sendVideo(to, media, params)
                break;
            case "audio":
                if (media)
                    this.telApi?.sendVoice(to, media, params)

                break

            case "sticker":
                if (media)
                    this.telApi?.sendSticker(to, media, params)
                break

        }
    }

    protected async monitoring(): Promise<void> {
        if (!this.telApi) return;

        this.telApi.on("message", async (msg) => {
            try {
                const message = await this.generateMessageReceivedObject(msg);

                if (this.commander && message.text) {
                    const isCommand = this.commander.isCommand(message.text);
                    if (isCommand) {
                        await this.treatCommands(message);
                        return;
                    }
                }
                this.getEmitter().emit("g.msg", message);

            } catch (err) {
                this.logger.error(err);
            }
        });

        this.telApi.on("callback_query", async (msg) => {
            const { data, message } = msg;
            await this.telApi?.answerCallbackQuery(msg.id)
            if (data && message) {
                const { chat, message_id, from } = message

                const messageRes: IMessageReceived = {
                    text: data,
                    author: (from?.id || chat.id).toString(),
                    chatId: chat.id.toString(),
                    type: "text",
                    isGroup: chat.title ? true : false,
                    messageId: message_id.toString(),
                    isMe: false

                }
                if (this.commander) {

                    const isCommand = this.commander.isCommand(data);
                    if (isCommand) {
                        await this.treatCommands(messageRes);
                        return;
                    }
                }
                this.getEmitter().emit("g.msg", messageRes);

            }


        })
    }

    private async generateMessageReceivedObject(msg: TelApi.Message) {
        const { text, caption, chat, message_id, photo, video, audio, voice, document, sticker, from, reply_to_message } = msg

        let replyMessage: IMessageReceived | undefined;
       
        if (reply_to_message) {
            replyMessage = await this.generateMessageReceivedObject(reply_to_message)
        }
        const message: IMessageReceived = {
            text: text || caption,
            author: (from?.id || chat.id).toString(),
            chatId: chat.id.toString(),
            type: photo ? "image" : video ? "video" : audio || voice ? "audio" : document ? "document" : sticker ? "sticker" : "text",
            isGroup: chat.title ? true : false,
            messageId: message_id.toString(),
            isMe: false,
            replyMessage


        }

        if (message.type != "text") {
            message.media = await this.getMessageBuffer(msg)
        }

        return message
    }
    private async getMessageBuffer(msg: TelApi.Message) {
        const { photo, video, audio, voice, document, sticker } = msg
        let image;
        if (photo) {
            image = photo[photo.length - 1]
        }
        let file = (image || video || audio || voice || document || sticker);

        const fileId = file?.file_id

        if (!fileId) {
            return
        }
        const stream = this.telApi?.getFileStream(fileId);

        if (!stream) {

            throw new Error('Stream is not available');

        }
        const filePath = path.join(__dirname, '..', 'assets', "temp", `${fileId}.bin`);

        const writeStream = createWriteStream(filePath);

        await pipeline(stream, writeStream);
        return filePath

    }
    private treatCommands = async (msg: IMessageReceived) => {
        if (!msg.text) {
            return
        }

        if (this.commander) {
            const realCommand = msg.text.replace("@", " ")
            const data = this.commander.extractCommandAndArgs(realCommand)
            const commandFn = this.commander.searchCommand(data.command)
            if (commandFn) {
                commandFn(this, msg.chatId, data.args, msg)
            } else {
                this.send(msg.chatId, { type: "text", reply: msg.messageId, text: "comando não encontrado" })
            }
        }

    }

    private async delay(seconds: number) {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }
    private updateCommands = async () => {

        const commandsInCommander = this.commander?.getAllCommands()
        if (!commandsInCommander) {
            return
        }
        const onlineCommands = await this.telApi?.getMyCommands()
        const commandsKeys = [...commandsInCommander.keys()]

        let update: boolean = false;

        if (commandsInCommander && this.enableLogs)
            this.logger.table(commandsInCommander)


        if (onlineCommands) {
            for (let commandKeys of commandsKeys) {
                if (!onlineCommands.find(c => c.command.includes(commandKeys))) {

                    update = true
                }
            }

        } else {
            update = true;
        }
        if (commandsInCommander && update) {
            if (this.enableLogs) this.logger.info("update commands")

            const commands: TelApi.BotCommand[] = commandsKeys.map(c => {
                let command: TelApi.BotCommand = {
                    command: c,
                    description: c
                }
                return command
            })

            this.telApi?.setMyCommands(commands)
        } else {
            if (this.enableLogs) this.logger.warn("commands not updated")
        }

    }
}