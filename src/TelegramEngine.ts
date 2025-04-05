import { DefaultCommander, DefaultEngine, IMessageReceived, IMessageSend } from "gear-roboto";

import TelApi from "node-telegram-bot-api";

export class TelegramEngine extends DefaultEngine {
    private telApi?: TelApi;

    constructor(private apiKey: string, cm?: DefaultCommander) {
        super(cm);

    }

    async connect(args: string[]): Promise<void> {

        try {
            if (!this.telApi) {
                this.telApi = new TelApi(this.apiKey)

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

        const params: TelApi.SendMediaGroupOptions = {}
        const paramsFile: { caption?: string, reply_to_message_id?: number } = {};
        if (reply) {
            params["reply_to_message_id"] = parseInt(reply)
            paramsFile["reply_to_message_id"] = parseInt(reply)
        }
        if (type != 'text') {
            paramsFile["caption"] = text
        }
        switch (type) {
            case "text":
                if (text)
                    this.telApi?.sendMessage(to, text, params)
                break;
            case "image":
                if (media)
                    this.telApi?.sendPhoto(to, media, paramsFile)
                break;
            case "document":
            case "file":
                if (media)
                    this.telApi?.sendDocument(to, media, paramsFile)
                break;
            case "video":
                if (media)
                    this.telApi?.sendVideo(to, media, paramsFile)

                break;

        }
    }
    protected async monitoring(): Promise<void> {

        await this.telApi?.startPolling()

        this.telApi?.on("message", (msg) => {
            const { text, chat, message_id, video, audio, photo, document } = msg
            const messageObj: IMessageReceived = {
                text,
                type: photo ? "image" : video ? "video" : "text",
                author: chat.id.toString(),
                isGroup: false,
                messageId: message_id.toString()
            }
            this.logger.info(text)
        })

    }
}