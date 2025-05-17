
import { DefaultFlow, KeyWordMessageFlow, StoreMessageFlow } from "gear-roboto";

const flow = new DefaultFlow("talk-me", {
    enableLogs: true,
    waitingTimeForResponseMs: 120000,
    timeoutMessage: {
        type: "text",
        text: "devido a inatividade estamos encerrando essa conversa"
    }
});

flow.setFirstMessage({ type: "text", text: "olá!" });


flow.setLastMessage({ type: "text", text: "foi um prazer falar com você!" });


const questionOne = new KeyWordMessageFlow(
    "questionario",
    [
        { type: "text", text: "gostaria de responder ao nosso questionário?" }
    ],
    ["sim", "claro", "ok", "certo"]
);


const notInterested = new StoreMessageFlow("why", [
    { type: "text", text: "Tudo bem! Poderia nos dizer por que não?" }
]);


const questions = [
    { name: "name", question: "Qual é o seu nome?" },
    { name: "idade", question: "Quantos anos você tem?" },
    { name: "profissao", question: "Qual sua profissão?" },


].map(q => new StoreMessageFlow(q.name, [{ type: "text", text: q.question }]));


questionOne.setNextErrorId(notInterested.getId());
questionOne.setNextId(questions[0].getId());

const dados = new StoreMessageFlow("data", [{ type: "text", text: "preciso que você responda seus: \n telefone para contato\nemail\nsalário\npaís onde mora:" }])
dados.setResponseCount(3);
questions[questions.length - 1].setNextId(dados.getId())

flow.addMessages(questionOne, notInterested,dados);


for (let i = 0; i < questions.length; i++) {
    const current = questions[i];
    const next = questions[i + 1];
    if (next) current.setNextId(next.getId());
    flow.addMessage(current);
}

export default flow;