import { readFileSync } from "fs"
import { CommanderFunction } from "gear-roboto"
import path from "path"

const start: CommanderFunction = async (engine, author, args, message) => {

    const text = `Olá tudo bem?
    Apollousa_bot é uma base para criação de chatbots otimizados! 
    se puder dar uma estrela lá no github, brigadão! 😀
    

    https://github.com/isaias-silva/apollousa

    `
    const media = readFileSync(path.resolve(__dirname, "..", "..", "assets", "icon.png"))

    engine.send(author, { text, media, type: "image", reply: message?.messageId })
}

export default start