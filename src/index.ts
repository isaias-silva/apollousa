
import dotenv from 'dotenv'
import { DefaultChatBot, DefaultTransporter } from 'gear-roboto'
import { TelegramEngine } from './TelegramEngine'

dotenv.config()
const apiKey = process.env.API_KEY || ""

async function main() {

    console.log('start bot')
    const chatbot = new DefaultChatBot(new TelegramEngine(apiKey), new DefaultTransporter())
    await chatbot.init()
}
main()
