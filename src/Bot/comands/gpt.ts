import axios from "axios";
import TelegramBot from "node-telegram-bot-api";
import { Configuration, OpenAIApi } from "openai";
import Bot from "../Bot";

export async function gpt(
  botInstance?: Bot,
  params?: string[],
  ids?: { id: number; replyId: number }
) {
  if (!params || !ids) {
    return;
  }
  const token = process.env.GPT_API_KEY;
  const config = new Configuration({ apiKey: token });
  const openIa = new OpenAIApi(config);

  const { data } = await openIa.createCompletion({
    model: "text-davinci-003",
    prompt: params[1],
    temperature: 0,
    max_tokens: 1000,
  });
  const response = data.choices[0].text;

  await botInstance?.sendMessage(ids?.id, response, ids.replyId);
}
