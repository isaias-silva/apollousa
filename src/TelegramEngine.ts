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
        super(cm);

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
            }
        } catch (err) {
            this.logger.error(err)
            this.disconnect(args)
        }


    }
    async disconnect(args: string[]): Promise<void> {
        if (this.telApi) {
            await this.telApi.stopPolling();
            this.telApi = undefined
        }
    }

    async send(to: string, message: IMessageSend): Promise<void> {
        const { type, text, media, reply } = message
        const params: CustomSendOptions = {}
        if (reply) {
            params["reply_to_message_id"] = parseInt(reply)
        }
        if (type != "text") {
            params['caption'] = text
        }
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

        if (!this.telApi) {
            return
        }
        this.telApi.on("message", async (msg) => {

            const message = await this.generateMessageReceivedObject(msg)
            if (this.commander) {
                this.treatCommands(message);
            }


            this.getEmitter().emit("g.msg", message)
        })
    }
    private async generateMessageReceivedObject(msg: TelApi.Message) {
        const { text, caption, chat, message_id, photo, video, audio, voice, document, sticker } = msg
        const message: IMessageReceived = {
            text: text || caption,
            author: chat.id.toString(),
            type: photo ? "image" : video ? "video" : audio || voice ? "audio" : document ? "document" : sticker ? "sticker" : "text",
            isGroup: chat.title ? true : false,
            messageId: message_id.toString(),


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
        if (this.commander?.isCommand(msg.text)) {
            const data = this.commander.extractCommandAndArgs(msg.text)
            const commandFn = this.commander.searchCommand(data.command)
            if (commandFn) {
                commandFn(this, msg.author, data.args, msg)
            } else {
                this.send(msg.author, { type: "text", reply: msg.messageId, text: "comando não encontrado" })
            }
        }
    }
}