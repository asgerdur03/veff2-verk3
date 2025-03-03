import { z } from 'zod';
//import { PrismaClient } from "@prisma/client";
import { generateSlug } from "./slug.js";
import xss from 'xss';
//let prisma = new PrismaClient();
import prisma from './client.js';
// zod validation shit
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const categorySchema = z.object({
    id: z.number(),
    slug: z.string(),
    title: z.string().min(3, 'title must be at least 3 letters').max(1024, 'title must be at most 1024 letters')
});
const categoryToCreateSchema = z.object({
    title: z.string().min(3, 'title must be at least 3 letters').max(1024, 'title must be at most 1024 letters')
});
// spurningarmenrki þýðir optional parameter
// = er default parameter
// gets all categories (with limit and offset, mabey)
export async function getCategories(limit = 10, offset) {
    // select (limit) from categories where id > offset
    //const prisma = new PrismaClient()
    // mock, eyða
    /*
    await prisma.categories.createMany({
        data: mockCategories
    })*/
    const categories = await prisma.categories.findMany({
        take: limit,
        skip: offset
    });
    return categories ?? null;
}
// gets one category
export async function getCategory(slug) {
    //const prisma = new PrismaClient()
    const category = await prisma.categories.findUnique({
        where: {
            slug: slug
        }
    });
    // select category where slug = slug;
    return category ?? null;
}
export async function createCategory(title) {
    //const prisma = new PrismaClient()
    const safeTitle = xss(title);
    const slug = generateSlug(safeTitle);
    const category = await prisma.categories.create({
        data: {
            title: safeTitle,
            slug: slug
        }
    });
    return category ?? null;
}
export async function deleteCategory(slug) {
    //const prisma = new PrismaClient()
    const category = await prisma.categories.delete({
        where: {
            slug: slug
        }
    });
    return category;
}
export async function updateCategory(slug, title) {
    //const prisma = new PrismaClient()
    const safeTitle = xss(title);
    const safeSlug = generateSlug(safeTitle);
    // Á slug að breytast eða ekki?
    const category = await prisma.categories.update({
        where: {
            slug: safeSlug
        },
        data: {
            title: safeTitle
        }
    });
    return category;
}
// Validates category using zod
export function validateCategory(categoryToValidate) {
    const result = categoryToCreateSchema.safeParse(categoryToValidate);
    return result;
}
export async function categoryExists(title) {
    const slug = generateSlug(title);
    const category = await getCategory(slug);
    if (category) {
        return true;
    }
    return false;
}
