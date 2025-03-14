import { CommanderFunction } from "gear-roboto"

const hello: CommanderFunction = async (engine, author, args, message) => {
    console.log(message)
    engine.send(author, { text: "world", type:"text", reply: message?.messageId })
}

export default hello