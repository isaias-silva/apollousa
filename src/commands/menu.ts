import { readFileSync } from "fs"
import { CommanderFunction } from "gear-roboto"
import path from "path"

const menu: CommanderFunction = async (engine, author, args, message) => {
    const media = readFileSync(path.join(__dirname, "..", '..', 'assets', "icon.png"))
    engine.send(author, { text: "menu", type: "image", media, reply: message?.messageId,opts:[
        {value:"/hello", text:"hello"}
    ]})
}

export default menu