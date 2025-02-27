import { z } from 'zod';
import { PrismaClient } from "@prisma/client";
import exp from 'constants';

let prisma = new PrismaClient();
// það er ekki hægt að starta of mörgum prisma clients, þá fer allt í rugl

const questionSchema = z.object({
    id: z.number(),
    categoryId: z.number(),
    question: z.string()
    // answers
});

const questionsToCreateSchema = z.object({
    categoryId: z.number(),
    question: z.string()
//answers
});

type Question = z.infer<typeof questionSchema>

const answersSchema = z.object({
    id: z.number(),
    questionId: z.number(),
    answer: z.string(),
    correct: z.boolean(),
});

const answersToCreateSchema = z.object({
    questionId: z.number(),
    answer: z.string(),
    correct: z.boolean(),
});

type Answer = z.infer<typeof answersSchema>;


export async function getQuestions(limit=10, offset?: number):
Promise<Array<Question>> {

    // veit ekki afh það er rautt, því það er að sækja allar spurningar
    const questions =  await prisma.questions.findMany()

    return questions
}

export async function getQuestionsByCategory(categoryId: number): Promise<Array<Question|null>> {
    const questions = await prisma.questions.findMany({
        where: {
            categoryId: categoryId
        }
    })

    return questions;
}


export async function getAnswersByQuestionId(questionId: number): Promise<Array<Answer|null>> {
    const answers = await prisma.answers.findMany({
        where: {
            questionId: questionId
        }
    })
    return answers ?? null;

}
