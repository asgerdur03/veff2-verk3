import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { createCategory, deleteCategory, getCategory, 
        getCategories, validateCategory, categoryExists,
        updateCategory} from './categories.db.js'
import { getQuestions, getQuestionsByCategory, getAnswersByQuestionId } from './questions.db.js'

const app = new Hono()

app.get('/', (c) => {
  const data = {
    hello: 'hono'
  }
  return c.json(data)
})

// CATEGORIES

// Lists all categories
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

// Lists single category
app.get('/categories/:slug', async (c) => {
  const slug = c.req.param('slug');
  const categories =await getCategory(slug);

  if (!categories) {
    return c.json({error: 'Category not found'}, 404);
  }

  return c.json(categories)
})

// create new category
app.post('/category', async (c) => {
  let categoryToCreate: unknown;
  try {
    categoryToCreate = await c.req.json();
    console.log("categoryToCreate", categoryToCreate);
  }catch (error) {
    console.error(error);
    return c.json({error: 'Invalid Json'},400);	
  }

  const validCategory = validateCategory(categoryToCreate);

  if (!validCategory.success) {
    return c.json({error: 'Invalid data', errors: validCategory.error.flatten()}, 400);
  }

  const exists = await categoryExists(validCategory.data.title);
  console.log("exists", exists);

  console.log("title", validCategory.data.title);

  let cat;
  if (exists) {
    return c.json({error: 'Category already exists'}, 400);
  }else{
      cat =await createCategory(validCategory.data.title);

  }

  return c.json({message: 'create new category:', cat}, 201);
})

// update existing category
app.patch('/category/:slug', async(c) => {
  const slug = c.req.param('slug');

  const {title: newTitle} = await c.req.json();

  const catToEdit = await getCategory(slug);

  if (!catToEdit) {
    return c.json({error: 'Category not found'}, 404);
  }

  if (!newTitle) {
    return c.json({error: 'Missing title'}, 400);
  }

  const editedCategory = await updateCategory(slug, newTitle);
  
  return c.json({message: 'edit category with slug: ' + editedCategory.slug}, 200);
})

// delete category
app.delete('/category/:slug', async(c) => {
  const slug = c.req.param('slug');
  let catToDelete;

  try {
      catToDelete = await getCategory(slug);
      console.log("catToDelete", catToDelete);

      if (!catToDelete) {
          return c.json({error: 'Category not found'}, 404);
      }
      catToDelete = await deleteCategory(slug);
  }
  catch (error) {
      console.error(error);
      return c.json({error: "Error "}, 500);
  }
  //return c.json({message: 'delete category: ' + catToDelete.title	});
  return c.body(null, 204);
})


// QUESTIONS

// Lists all questions
app.get('/questions', async(c) => {

  let questions;

  try {
      questions = await getQuestions();
  }
  catch (error) {
      console.error(error);
      return c.json({error: 'Error fetching questions'}, 500);
  }

  return c.json(questions)
});

// Lists questions by category
app.get('/questions/category/:slug', async(c) => {

  const slug = c.req.param('slug');
  
  const category = await getCategory(slug);
  console.log("category", category);

  if (!category) {
    return c.json({error: 'Category not found'}, 404);
  }

  const catId = category.id;

  console.log("catId", catId);

  let questions;

  try {
      questions = await getQuestionsByCategory(catId);

      return c.json(questions);
  }
  catch (error) {
      console.error(error);
      return c.json({error: 'Error fetching questions'}, 500);
  }

});


// ANSWERS

// list  all answers belonging to a single question
// USE: loop, forEach question with id, get all answers with questionId
app.get('/answers/:questionId', async(c) => {

  try {
    const questionId = parseInt(c.req.param('questionId'));
    
    const answers = await getAnswersByQuestionId(questionId);
    console.log("answers", answers);
    return c.json(answers);
  }
  catch (error) {
      console.error(error);
      return c.json({error: 'Error fetching answers'}, 500);
  }
  
})



// OTHER SHIT
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
