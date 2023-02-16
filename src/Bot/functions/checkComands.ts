import fs from "fs";
import TelegramBot from "node-telegram-bot-api";
import path from "path";
import Bot from "../Bot";
export default (botInstance?: Bot, msg?: TelegramBot.Message) => {
  const params = msg?.text?.replace(/\//g, "").split(" ");
  if (!params) {
    return;
  }
  if (params.length > 2) {
    params[1] = params
      .splice(1, params.length - 1)
      .toString()
      .replace(/,/g, " ");

  }
  const pathTestOrBuild = process.env.MODE;
  if (!pathTestOrBuild) {
    return;
  }
  const comands = fs.readdirSync(
    path.resolve(pathTestOrBuild, "Bot", "comands")
  );

  let comandExists = false;
  let file: any;
  comands.forEach((value) => {
    if (value.split(".")[0] == params[0]) {
      comandExists = true;
      file = value;
    }
  });
  if (!comandExists) {
    botInstance?.sendMessage(msg?.chat.id, "comando não encontrado!",msg?.message_id);
  }
  if (!file) {
    return;
  }
  const comandFunction = require(`../comands/${file}`);
  
  try {
    let title = file.split(".")[0];
    comandFunction[title](botInstance, params, {id:msg?.chat.id, replyId:msg?.message_id});
  } catch (err) {
    console.log(err);
  }
};
