import { readFileSync } from "fs"
import { CommanderFunction } from "gear-roboto"

const sticker: CommanderFunction = async (engine, author, args, message) => {

    if (!message?.media) {
        return engine.send(author, { text: "imagem não encontrada por favor envie um arquivo válido!", type: "text", reply: message?.messageId })
    }

    engine.send(author, { text: "conversão em andamento...", type: "text", reply: message?.messageId })

    const file = readFileSync(message?.media)

    engine.send(author, {
        media: file,
        type: "sticker",
        reply: message.messageId
    })

}

export default sticker