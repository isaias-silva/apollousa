import {
    CommanderFunction,

} from "gear-roboto"
import flow from "../flow/talk.flow";

const talk: CommanderFunction = async (engine, author, args, message) => {
    let to = author;
    if (message?.isGroup) {
        const [group, member] = author.split("_")
        to = member
    }
    engine.startFlowInEngine(to, flow);
};

export default talk;