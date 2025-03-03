import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import app from "../src/index.js";
import { generateSlug } from "../src/slug.js";
import { PrismaClient } from "@prisma/client";
import { getCategories, getCategory, createCategory, deleteCategory } from "../src/categories.db.js";
import request from "supertest";
import { beforeEach } from "node:test";
import exp from "constants";
describe("Basic Vitest Check", () => {
    it("should check if Vitest is working", () => {
        expect(true).toBe(true);
    });
    it("should add two numbers correctly", () => {
        const sum = 2 + 3;
        expect(sum).toBe(5);
    });
});
describe("Generate Slug Test", () => {
    it("Title to slug", () => {
        const slug = generateSlug("Hello World");
        expect(slug).toBe("hello-world");
    });
    it("remove special characters", () => {
        const slug = generateSlug("Hello! World!");
        expect(slug).toBe("hello-world");
    });
    it("remove extra spaces", () => {
        const slug = generateSlug("  Hello  World  ");
        expect(slug).toBe("hello-world");
    });
});
vi.mock('../src/client.js', () => ({
    default: {
        categories: {
            findMany: vi.fn().mockResolvedValue([
                { id: 1, title: 'Hello World', slug: 'hello-world' },
                { id: 2, title: 'HTML', slug: 'html' },
                { id: 3, title: 'Css', slug: 'css' },
                { id: 4, title: 'JavaScript', slug: 'js' }
            ]),
            findUnique: vi.fn((query) => {
                if (query.where.slug === 'hello-world') {
                    return { id: 1, title: 'Hello World', slug: 'hello-world' };
                }
                else if (query.where.slug === 'html') {
                    return { id: 2, title: 'HTML', slug: 'html' };
                }
                else if (query.where.slug === 'css') {
                    return { id: 3, title: 'Css', slug: 'css' };
                }
                else if (query.where.slug === 'js') {
                    return { id: 4, title: 'JavaScript', slug: 'js' };
                }
                else {
                    return null;
                }
            }),
            create: vi.fn((query) => {
                if (query.data.title === 'Hello World') {
                    return { id: 1, title: 'Hello World', slug: 'hello-world' };
                }
                else if (query.data.title === 'HTML') {
                    return { id: 2, title: 'HTML', slug: 'html' };
                }
                else if (query.data.title === 'Css') {
                    return { id: 3, title: 'Css', slug: 'css' };
                }
                else if (query.data.title === 'JavaScript') {
                    return { id: 4, title: 'JavaScript', slug: 'js' };
                }
                else {
                    return null;
                }
            }),
            delete: vi.fn((query) => {
                if (query.where.slug === 'hello-world') {
                    return { id: 1, title: 'Hello World', slug: 'hello-world' };
                }
                else if (query.where.slug === 'html') {
                    return { id: 2, title: 'HTML', slug: 'html' };
                }
                else if (query.where.slug === 'css') {
                    return { id: 3, title: 'Css', slug: 'css' };
                }
                else if (query.where.slug === 'js') {
                    return { id: 4, title: 'JavaScript', slug: 'js' };
                }
                else {
                    return null;
                }
            })
        }
    }
}));
describe("Mocked getCategories", () => {
    it("should return mock categories", async () => {
        const categories = await getCategories();
        expect(categories.length).toBe(4);
        expect(categories[0].title).toBe("Hello World");
    });
    it("should return mock category by slug", async () => {
        const category = await getCategory("hello-world");
        expect(category).toBeDefined();
        expect(category?.title).toBe("Hello World");
    });
    it("should create mock category", async () => {
        const category = await createCategory("Hello World");
        expect(category).toBeDefined();
        expect(category?.title).toBe("Hello World");
    });
    it("should delete mock category", async () => {
        const category = await deleteCategory("hello-world");
        expect(category).toBeDefined();
        expect(category?.title).toBe("Hello World");
    });
});
