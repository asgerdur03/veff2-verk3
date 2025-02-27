import exp from "constants";
import {z} from 'zod';
import { PrismaClient } from "@prisma/client";
import { generateSlug } from "./slug.js";

// zod validation shit
const categorySchema = z.object({
    id: z.number(),
    slug: z.string(),
    title: z.string().min(3, 'title must be at least 3 letters').max(1024, 'title must be at most 1024 letters')
})

const categoryToCreateSchema = z.object({
    title: z.string().min(3, 'title must be at least 3 letters').max(1024, 'title must be at most 1024 letters')
})


type Category = z.infer<typeof categorySchema>;


const mockCategories: Array<Category> = [
    {
        id: 1,
        slug: 'html',
        title: 'Html'
    },
    {
        id: 2,
        slug: 'css',
        title: 'Css'
    },
    {
        id: 3,
        slug: 'js',
        title: 'JavaScript'
    }
]


// spurningarmenrki þýðir optional parameter
// = er default parameter
// gets all categories (with limit and offset, mabey)
export async function getCategories(limit=10, offset?: number):  
Promise<Array<Category>> {

    // select (limit) from categories where id > offset
    const prisma = new PrismaClient()

    // mock, eyða
    /*
    await prisma.categories.createMany({
        data: mockCategories
    })*/
    const categories =  await prisma.categories.findMany()


    return categories;
}

// gets one category
export async function getCategory(slug: string):Promise<Category|null> {

    const prisma = new PrismaClient()

    const category = await prisma.categories.findUnique({
        where: {
            slug: slug
        }
    })
    // select category where slug = slug;
    return category?? null;

}

export async function createCategory(title: string) {
    const prisma = new PrismaClient()

    const slug = generateSlug(title);

    const category = await prisma.categories.create({
        data: {
            title: title,
            slug: slug
        }
    })

    return category

}

export async function deleteCategory(slug: string) {
    const prisma = new PrismaClient()
    const category = await prisma.categories.delete({
        where: {
            slug: slug
        }
    })

    return category
}


export async function updateCategory(slug: string, title: string) {
    const prisma = new PrismaClient()

    // Á slug að breytast eða ekki?
    const category = await prisma.categories.update({
        where: {
            slug: slug
        },
        data: {
            title: title
        }
    })

    return category
}

// Validates category using zod
export function validateCategory(categoryToValidate: unknown) {
    const result = categoryToCreateSchema.safeParse(categoryToValidate);

    return result;
}


export async function categoryExists(title: string) {
    const slug = generateSlug(title);
    const category = await getCategory(slug);

    if (category) {
        return true;
    }
    return false;
}
