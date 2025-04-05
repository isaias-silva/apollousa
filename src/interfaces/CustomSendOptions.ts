import TelApi from "node-telegram-bot-api";

export interface CustomSendOptions extends TelApi.SendBasicOptions{
    caption?:string;
}