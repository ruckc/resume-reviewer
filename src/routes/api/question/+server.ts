import {answerQuestion} from "$lib/apis/chatgpt.server";

export async function POST({request}) {

    const { resume, description, question } = await request.json();

    return answerQuestion(resume, description, question).then((response) => {
        return new Response(JSON.stringify({answer: response}));
    });
}