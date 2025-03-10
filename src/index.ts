import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { 
  createCategory, 
  deleteCategory, 
  getCategory, 
  getCategories,
  validateCategory, 
  categoryExists,
  updateCategory
  } from './categories.db.js'
import { 
    editQuestion,
    createQuestion, 
    deleteQuestion, 
    getQuestion, 
    getQuestions, 
    getQuestionsByCategory, 
    getAnswersByQuestionId,
    createAnswer,
    editAnswer,
    getAnswers,
    getAnswer,
    deleteAnswer,
    validateQuestion,
    validateAnswer
  } from './questions.db.js'
import { cors } from 'hono/cors'

const app = new Hono()

app.use(cors());

app.get('/', (c) => {
  const routes = app.routes.map((route) => {
    return {
      method: route.method,
      path: route.path,
    }
  });
  return c.json(routes)
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
app.post('/categories', async (c) => {
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
app.patch('/categories/:slug', async(c) => {
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
app.delete('/categories/:slug', async(c) => {
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

app.get('/questions/:id', async(c) => {
  let question;

  const id = parseInt(c.req.param('id'));

  try {
      question = await getQuestion(id);
      
  }
  catch (error) {
      console.error(error);
      return c.json({error: 'Error fetching question'}, 500);
  }

  return c.json(question);
  
})

app.delete('/questions/:id', async(c) => {
  const id = parseInt(c.req.param('id'));
  

  try {
      const question = await getQuestion(id);
      console.log("question", question);

      if (!question) {
          return c.json({error: 'Question not found'}, 404);
      }
      await deleteQuestion(id);
  }
  catch (error) {
      console.error(error);
      return c.json({error: 'Error deleting question'}, 500);
  }

  return c.body(null, 204);

})

app.post('/questions', async(c) => {
  let questionToCreate: unknown;

  try {
    questionToCreate = await c.req.json();

  } catch (e) {
    console.error(e);
    return c.json({error: 'invalid json', }, 400);
  }

  const validQuestion = validateQuestion(questionToCreate);

  if (!validQuestion.success) {
    return c.json({error: 'Invalid question', errors: validQuestion.error.flatten()}, 400);
  }
  
  const question = await createQuestion(validQuestion.data);

  return c.json({message: 'create new question:', question}, 201);

})

app.patch('/questions/:id', async(c) => {
  const id = parseInt(c.req.param('id'));

  const {question, categoryId} = await c.req.json();

  const questionToEdit = await getQuestion(id);

  if (!questionToEdit) {
    return c.json({error: 'Question not found'}, 404);
  }

  if (!question && !categoryId) {
    return c.json({error: 'Missing question and category'}, 400);
  }

  const editedQuestion = await editQuestion(id, {question, categoryId});

  return c.json({message: 'edit question with id: ' + editedQuestion.id}, 200);

})

// ANSWERS

app.post('/answers', async(c) => {

  let answerToCreate: unknown;

  try {
    answerToCreate = await c.req.json();

  } catch (error) {
    console.error(error);
    return c.json({error: 'invalid json'}, 400);
  }

  const validAnswer = validateAnswer(answerToCreate);

  if (!validAnswer.success) {
    return c.json({error: 'Invalid answer', errors: validAnswer.error.flatten()}, 400);

  }

  const answer = await createAnswer(validAnswer.data);

  return c.json({message: 'create new answer:', answer}, 201);

})

app.patch('/answers/:id', async(c) => {

  const id = parseInt(c.req.param('id'));

  const {questionId, answer, correct} = await c.req.json();

  const answerToEdit = await getAnswer(id);

  if (!answerToEdit) {
    return c.json({error: 'Answer not found'}, 404);
  }

  if (!questionId && !answer && !correct) {
    return c.json({error: 'Missing questionId, answer and correct'}, 400);
  }

  const editedAnswer = await editAnswer(id, {questionId, answer, correct});

  return c.json({message: 'edit answer with id: ' + editedAnswer.id}, 200);

})

app.get('/answers/question/:id', async(c) => {

  try {
    const questionId = parseInt(c.req.param('id'));
    
    const answers = await getAnswersByQuestionId(questionId);
    console.log("answers", answers);
    return c.json(answers);
  }
  catch (error) {
      console.error(error);
      return c.json({error: 'Error fetching answers'}, 500);
  }
  
})

app.get('/answers', async(c) => {

  try {
    const answers = await getAnswers();
    console.log("answers", answers);
    return c.json(answers);
  }
  catch (error) {
      console.error(error);
      return c.json({error: 'Error fetching answers'}, 500);

  }
  
})

app.get('/answers/:id', async(c) => {
  const id = parseInt(c.req.param('id'))

  try {
    const answer = await getAnswer(id);
    console.log("answer", answer);
    return c.json(answer);
  }
  catch (error) {
      console.error(error);
      return c.json({error: 'Error fetching answer'}, 500);
  }

})

app.delete('/answers/:id', async(c) => {
  const id = parseInt(c.req.param('id'));
  

  try {
      const answer = await getAnswer(id);
      console.log("answer", answer);

      if (!answer) {
          return c.json({error: 'Answer not found'}, 404);
      }
      await deleteAnswer(id);
  }
  catch (error) {
      console.error(error);
      return c.json({error: 'Error deleting answer'}, 500);
  }

  return c.body(null, 204);

})




// OTHER SHIT
app.notFound((c) => {
  return c.text('Error, not found', 404)
})

app.onError((err, c) => {
  console.error(`${err}`)
  return c.text('Error, internal', 500)
})



serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})


export default app;
