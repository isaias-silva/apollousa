
import dotenv from 'dotenv'
import { TelegramEngine } from './TelegramEngine'

import { DefaultChatBot } from 'gear-roboto'
import { Transporter } from './Transporter'
import commander from './commands/commander'

dotenv.config()
async function main() {

    const apiKey = process.env.API_KEY

    if (apiKey) {
     
        await new DefaultChatBot(new TelegramEngine(apiKey, commander), new Transporter(true)).init()
    

    } else {
        throw new Error("please define API_KEY in enviroment variables.")
    }
}


main()