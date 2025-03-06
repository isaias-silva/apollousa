import { DefaultCommander, DefaultEngine } from "gear-roboto";
import { IMessageSend } from "gear-roboto/build/interfaces/IMessageSend";
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
            }
        } catch (err) {
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
        const params:TelApi.SendMediaGroupOptions={}
        if(reply){
            params["reply_to_message_id"]=parseInt(reply)
        }
        switch (type) {
            case "text":
                if (text)
                    this.telApi?.sendMessage(to, text,params)
                break;
            case "image":
              
                break;
            case "document":
                break;
            case "video":
                break;
            case "file":
                break;
        }
    }
    protected async monitoring(): Promise<void> {

    }
}