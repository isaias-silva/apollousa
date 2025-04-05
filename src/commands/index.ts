
import { DefaultCommander } from "gear-roboto";
import hello from "./hello";


const commander = new DefaultCommander("/")

commander.addCommand(hello.name, hello)

export default commander;