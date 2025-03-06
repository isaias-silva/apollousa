
import dotenv from 'dotenv'
import { DefaultChatBot, DefaultTransporter } from 'gear-roboto'
import { TelegramEngine } from './TelegramEngine'

dotenv.config()
const apiKey = process.env.API_KEY || ""

new DefaultChatBot(new TelegramEngine(apiKey), new DefaultTransporter()).init()
