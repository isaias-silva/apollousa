import { readFileSync } from "fs"
import { CommanderFunction, IMessageSend } from "gear-roboto"
import path from "path"
import commander from "."

const menu: CommanderFunction = async (engine, author, args, message) => {
    const commands = commander.getAllCommands()
    const opts: IMessageSend["opts"] = []
    const prefixes = commander.getPrefixes()
    let text=`
    created by @zZackx
    `
    commands.forEach((c, k) => {

        const value = prefixes[0] + k
        opts.push({ text: k, value })
    })
    const media = readFileSync(path.join(__dirname, "..", '..', 'assets', "icon.png"))
    engine.send(author, {
        text, type: "image", media, reply: message?.messageId, opts
    })
}

export default menu