import { DefaultTransporter, IFlowResponse } from "gear-roboto";

export class Transporter extends DefaultTransporter {

    protected treatInfoFlow(msg: IFlowResponse): void {
        const { messages } = msg



        console.table(messages.map(m => {
            const question = m.getMessages().map(v => v.text).join(" ")
            const response = m.getResponse()?.text

            return { question, response }
        }))
    }
}