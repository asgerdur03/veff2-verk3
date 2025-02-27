import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { getCategories, getCategory, validateCategory} from './categories.db.js'
import { z } from 'zod'

const app = new Hono()

app.get('/', (c) => {
  const data = {
    hello: 'hono'
  }
  return c.json(data)
})

app.get('/categories', async(c) => {
  // skilar öllum flokkum
  let categories;
  try {
      categories = await getCategories();
  }
  catch (error) {
      console.error(error);
      // check þegar ég geri test cases
      return c.json({error: 'Error fetching categories'}, 500);
  }
  return c.json(categories)
})

app.get('/categories/:slug', async (c) => {
  const slug = c.req.param('slug');
  const categories =await getCategory(slug);

  if (!categories) {
    return c.json({error: 'Category not found'}, 404);
  }

  return c.json(categories)
})

// 201 created, úr fyrirlestri
app.post('/category', async (c) => {
  let categoryToCreate: unknown;
  try {
    categoryToCreate = await c.req.json();
    console.log(categoryToCreate);
  }catch (error) {
    console.error(error);
    return c.json({error: 'Invalid Json'},400);	
  }

  const validCategory = validateCategory(categoryToCreate);

  if (!validCategory.success) {
    return c.json({error: 'Invalid data', errors: validCategory.error.flatten()}, 400);
  }

  return c.json({message: 'create new category:'}, 201);
})

app.patch('/category/:slug', (c) => {
  const slug = c.req.param('slug');

  return c.json({message: 'edit category with slug: ' + slug});
})

app.delete('/category/:slug', (c) => {
  const slug = c.req.param('slug');

  return c.json({message: 'delete category with slug: ' + slug});
})


app.notFound((c) => {
  return c.text('Custom 404 Message', 404)
})

app.onError((err, c) => {
  console.error(`${err}`)
  return c.text('Custom Error Message', 500)
})



serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
