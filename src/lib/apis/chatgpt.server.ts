import OpenAI from "openai";
import {json} from "@sveltejs/kit";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function answerQuestion(resume: string, description: string, question: string) {
    return openai.chat.completions.create({
        model: 'gpt-3.5-turbo-16k',
        messages: [
            {role: 'system', content: 'You are a human resources employee.  Your task is to answer questions based on the provided job description and resume.  Your answers should be grounded in the job description and resume.'},
            {role: 'user', content: 'The following is a job description: ' + description + '\n\nThe following is a resume: ' + resume + '\n\nThe following is a question: ' + question},
        ],
    }).then((response) => {
        return response.choices[0].message.content!;
    });
}