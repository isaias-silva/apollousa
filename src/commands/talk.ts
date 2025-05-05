import {
    CommanderFunction,
    DefaultFlow,
    KeyWordMessageFlow,
    DefaultMessageFlow
} from "gear-roboto"

const talk: CommanderFunction = async (engine, author, args, message) => {

    const flow = new DefaultFlow();

    flow.setFirstMessage({ type: "text", text: "olá!" });

 
    flow.setLastMessage({ type: "text", text: "foi um prazer falar com você!" });

  
    const question = new KeyWordMessageFlow(
        "questionario",
        [
            { type: "text", text: "gostaria de responder ao nosso questionário?" }
        ],
        ["sim", "claro", "ok", "certo"]
    );

   
    const notInterested = new DefaultMessageFlow("why",[
        { type: "text", text: "Tudo bem! Poderia nos dizer por que não quer responder?" }
    ]);

   
    const questions = [
        "Qual é o seu nome?",
        "Quantos anos você tem?",
        "Qual é a sua profissão?"
    ].map(q => new DefaultMessageFlow("q",[{ type: "text", text: q }]));

    
    question.setNextErrorId(notInterested.getId()); 
    question.setnextId(questions[0].getId());

    flow.addMessage(question);
    flow.addMessage(notInterested);
    
    for (let i = 0; i < questions.length; i++) {
        const current = questions[i];
        const next = questions[i + 1];
        if (next) current.setnextId(next.getId());
        flow.addMessage(current);
    }

    

  
    engine.startFlowInEngine(author, flow);
};

export default talk;