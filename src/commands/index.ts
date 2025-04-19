
import { DefaultCommander } from "gear-roboto";
import path from "path";


const commander = new DefaultCommander(["/","#","."])

commander.addCommandsByPath(path.resolve("src","commands"))

export default commander;