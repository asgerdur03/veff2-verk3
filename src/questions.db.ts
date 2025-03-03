import { z } from 'zod';
//import { PrismaClient } from "@prisma/client";
import xss from 'xss';

import prisma from './client.js';

//let prisma = new PrismaClient();
// það er ekki hægt að starta of mörgum prisma clients, þá fer allt í rugl

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const answersSchema = z.object({
    id: z.number(),
    questionId: z.number(),
    answer: z.string().max(5000, 'answer must be at most 5000 letters'),
    correct: z.boolean(),
});

const answerToCreateSchema = z.object({
    questionId: z.number(),
    answer: z.string().max(5000, 'answer must be at most 5000 letters'),
    correct: z.boolean()
});

type Answer = z.infer<typeof answersSchema>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const questionSchema = z.object({
    id: z.number(),
    categoryId: z.number(),
    question: z.string().max(5000, 'question must be at most 5000 letters'),
    // answers
});

const questionsToCreateSchema = z.object({
    categoryId: z.number(),
    question: z.string().max(5000, 'question must be at most 5000 letters'),
//answers
});

type Question = z.infer<typeof questionSchema>



// Questions

export async function getQuestions(limit=10, offset?: number): Promise<Array<Question>> {

    // veit ekki afh það er rautt, því það er að sækja allar spurningar
    const questions =  await prisma.questions.findMany(
        {
            take: limit,
            skip: offset
        }
    )

    return questions
}

export async function getQuestion(id: number): Promise<Question|null> {
    const question = await prisma.questions.findUnique({
        where: {
            id: id
        }
    })

    return question
}


export async function getQuestionsByCategory(categoryId: number): Promise<Array<Question|null>> {
    const questions = await prisma.questions.findMany({
        where: {
            categoryId: categoryId
        }
    })

    return questions;
}

// ætti að eyða líka samsvarandi svörum
export async function deleteQuestion(questionId: number) {
    const question = await prisma.questions.delete({
        where: {
            id: questionId
        }
    })
    return question
}

export async function createQuestion(question: z.infer<typeof questionsToCreateSchema>) {
    const safeQuestion = xss(question.question);
    const newQuestion = await prisma.questions.create({
        data: {
            categoryId: question.categoryId,
            question: safeQuestion,
            // answers
        }
    })
    return newQuestion ?? null
    
}

export async function editQuestion(questionId: number, question: z.infer<typeof questionsToCreateSchema>) {
    const safeQuestion = xss(question.question);
    const editedQuestion = await prisma.questions.update({
        where: {
            id: questionId
        },
        data: {
            categoryId: question.categoryId,
            question: safeQuestion,
            // answers
        }
    })
    return editedQuestion ?? null

}

// answers

export async function createAnswer(answer: z.infer<typeof answerToCreateSchema>) {
    const safeAnswer = xss(answer.answer);
    const newAnswer = await prisma.answers.create({

        data: {
            questionId: answer.questionId,
            answer: safeAnswer,
            correct: answer.correct
        }
    })    
    return newAnswer ?? null    
}

export async function editAnswer(answerId: number, answer: z.infer<typeof answerToCreateSchema>) {
    const safeAnswer = xss(answer.answer);


    const editedAnswer = await prisma.answers.update({
        where: {
            id: answerId
        },
        data: {
            questionId: answer.questionId,
            answer: safeAnswer,
            correct: answer.correct
        }
    })

    return editedAnswer ?? null;
    
}

export async function getAnswersByQuestionId(questionId: number): Promise<Array<Answer|null>> {
    const answers = await prisma.answers.findMany({
        where: {
            questionId: questionId, // questionId
        }
    })
    return answers ?? null;

}

export async function getAnswers(): Promise<Array<Answer|null>> {
    const answers = await prisma.answers.findMany()
    return answers ?? null;
}

export async function getAnswer(answerId: number): Promise<Answer|null> {
    const answer = await prisma.answers.findUnique({
        where: {
            id: answerId
        }
    })
    return answer ?? null;
}

export async function deleteAnswer(answerId: number) {
    const answer = await prisma.answers.delete({
        where: {
            id: answerId
        }
    })
    return answer
}

export function validateAnswer(answerToValidate: unknown) {
    const result = answerToCreateSchema.safeParse(answerToValidate);
    return result;

}


export function validateQuestion(questionToValidate: unknown) {
    const result = questionsToCreateSchema.safeParse(questionToValidate);
    return result;
}



