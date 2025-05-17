import {
    CommanderFunction,

} from "gear-roboto"
import flow from "../flow/talk.flow";

const talk: CommanderFunction = async (engine, chatId, args, message) => {
    let to = chatId;
    if (message?.isGroup) {
        to = message.author
    }
    engine.startFlowInEngine(to, flow);
};

export default talk;