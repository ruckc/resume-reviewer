import {answerQuestion} from "$lib/apis/chatgpt.server";

export async function POST({request, env}) {
    console.log(env);
    const { resume, description, question } = await request.json();

    return answerQuestion(env.OPENAI_API_KEY, resume, description, question).then((response) => {
        return new Response(JSON.stringify({answer: response}));
    });
}