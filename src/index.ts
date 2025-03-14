
import dotenv from 'dotenv'
import { TelegramEngine } from './TelegramEngine'
import commander from './commands'
import {DefaultChatBot, DefaultTransporter} from 'gear-roboto'

dotenv.config()
const apiKey = process.env.API_KEY

if (apiKey) {

    new DefaultChatBot(new TelegramEngine(apiKey, commander), new DefaultTransporter(true)).init()

} else {
    throw new Error("please define API_KEY in enviroment variables.")
}
