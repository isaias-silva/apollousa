import TelegramBot from "node-telegram-bot-api";
import checkComands from "./functions/checkComands";

export default class Bot {
  private _key: string | undefined;
  private _io: TelegramBot | undefined;
  constructor(key?: string) {
    this._key = key;
  }

  private async connect() {
    if (!this._key) {
      throw "invalid key";
    }
    this._io = new TelegramBot(this._key, { polling: true });
    if (this._io) {
      console.log("bot connected");
    }
  }
  private async interact() {
    if (!this._io) {
      throw "bot not conected";
    }
    this._io.on("message", (msg) => {
      if (msg.entities && msg?.entities[0]?.type == "bot_command") {
        checkComands(this, msg);
      }
    });
  }

  public async start() {
    await this.connect();
    this.interact();
  }
  public async sendMessage(id?: number, text?: string,replyId?:number) {
    if (!this._io) {
      throw "bot not conected";
    }
    if(!id || !text){
      return
    }
    await this._io.sendMessage(id, text,{reply_to_message_id:replyId});
  }
}
