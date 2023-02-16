
import { Configuration, OpenAIApi } from "openai";
import Bot from "../Bot";

export async function gpt(
  botInstance?: Bot,
  params?: string[],
  ids?: { id: number; replyId: number }
) {
  if (!params || !ids) {
    return;
  }
  if(!params[1]){
    await botInstance?.sendMessage(ids?.id, 'escreva sua pergunta depois do comando\n ex: /gpt no céu tem pão?', ids.replyId);
return
  }
  await botInstance?.sendMessage(ids?.id, 'um minuto...', ids.replyId);

  const token = process.env.GPT_API_KEY;
  const config = new Configuration({ apiKey: token });
  const openIa = new OpenAIApi(config);
  let response
  try{

  const { data } = await openIa.createCompletion({
    model: "text-davinci-003",
    prompt: params[1],
    temperature: 0,
    max_tokens: 1000,

  });
   response = data.choices[0].text;
}catch(err){
  response='ocorreu algum erro ao tentar trazer sua resposta :('
console.log(err)
}finally{


  await botInstance?.sendMessage(ids?.id, response, ids.replyId);
}
 
}
