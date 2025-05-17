
import { DefaultCommander } from "gear-roboto";
import path from "path";


    const commander = new DefaultCommander(["/", "#", "."])
    const pathCommands = path.resolve(__dirname);

    commander.addCommandsByPath(pathCommands)
   
    export default commander;


