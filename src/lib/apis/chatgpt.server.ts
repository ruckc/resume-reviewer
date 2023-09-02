import OpenAI from "openai";
import {OPENAI_API_KEY} from "$env/static/private";

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

export async function answerQuestion(resume: string, description: string, question: string) {
    return openai.chat.completions.create({
        model: 'gpt-3.5-turbo-16k',
        messages: [
            {role: 'system', content: 'You are a human resources employee.  ' +
                    'Your task is to answer questions based on the provided job description and resume.  '+
                    'Your answers should be brief, grounded in the job description and resume.  If you don\'t know an answer, say, "I don\'t know."'},
            {role: 'user', content: 'The following is a job description: ' + description + '\n\nThe following is a resume: ' + resume + '\n\nThe following is a question: ' + question},
        ],
    }).then((response) => {
        return response.choices[0].message.content!;
    });
}