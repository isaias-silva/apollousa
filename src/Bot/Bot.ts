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
      console.log("[!] bot connected");
    }
  }
  private async interact() {
    if (!this._io) {
      throw "bot not conected";
    }
    console.log("[!] bot interact");

    this._io.on("message", async (msg) => {
      if (msg.entities && msg?.entities[0]?.type == "bot_command") {
        if (msg.chat.id && msg?.from?.id) {
          const dataUser= await this._io?.getChatMember(
            msg.chat.id,
            msg?.from?.id.toString()
          );
          console.log(`[!] ${dataUser?.user.first_name} -> ${msg.text}`);
        }
       
        checkComands(this, msg);
      }
    });
  }

  public async start() {
    await this.connect();
    this.interact();
  }
  public async sendMessage(id?: number, text?: string, replyId?: number) {
    if (!this._io) {
      throw "bot not conected";
    }
    if (!id || !text) {
      return;
    }
    let object = {};
    if (replyId) {
      object = { reply_to_message_id: replyId };
    }
    await this._io.sendMessage(id, text, object);
  }
}
