import {
    CommanderFunction,
    
} from "gear-roboto"
import flow from "../flow/talk.flow";

const talk: CommanderFunction = async (engine, author, args, message) => {

    engine.startFlowInEngine(author, flow);
};

export default talk;