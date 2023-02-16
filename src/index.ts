import Bot from "./Bot/Bot";
import dotenv from 'dotenv'
dotenv.config()
const bot=new Bot(process.env.TELEGRAM_API_KEY)
bot.start()