import {DefaultTransporter, IFlowResponse } from "gear-roboto";

export class Transporter extends DefaultTransporter {

    protected treatInfoFlow(msg: IFlowResponse): void {
        const { messages } = msg

        let content: any={};
        for (const message of messages) {
            const [key, messageFlow] = message

            content[messageFlow.getName()] = messageFlow.getResponse()?.text
        }

        console.table(content)
    }
}