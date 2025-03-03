# Vefforritun 2 verkefni 3

RESTful CRUD vefþjónusta með Hono, prisma og typescript


### Run using hono
```
npm install
npm run dev
```

```
open http://localhost:3000
```

## TODO

Category (gefið í lýsingu)

- [x] `GET /categories` 200, 500
- [x] `Get /categories/:slug` 200, 404, 500
- [x] `POST /category ` 201, 400, 500
- [x] `PATCH /category/:slug` 200, 400, 404, 500
- [x] `DELETE /category/:slug` 204, 404, 500

---
Questions
- [x] `GET /questions` All questions
- [x] `GET /questions/category/:slug` questions by category
- [x] `DELETE /questions/:id` deltete question (and answers)
- [x] `POST /questions` Create question
- [x] `PATCH /questions/:id` edit question 
- [x] `GET /questions/:id` singular question 


--- 

Answers (seperate or )
- [x] `GET /answers/question/:id` All answers to a single question
- [x] `GET /answers` All answers
- [x] `GET /answers/:id` single answers
- [x] `POST /answers` create new answer
- [x] `PATCH /answers/:id` edit single answer with id = ...
- [x] `DELETE /answers/:id` delete single answer with id = ...
---


Annað 

- [ ] Setja upp automatic database með prisma Seeding
- [x] Nota Zod fyrir staðfestingu gagan (bæta við kröfum í questions)
- [x] nota xss fyrir skráningu gagna
- [ ] Setja upp próf
- [x] Github actions (laga fyrir skil)
- [ ] Setja upp vef á t.d render, tengt við postgres og github
- [ ] Bæta kennurum í repo
----

- [x] 40% — Vefþjónustur útfærðar með Hono.
- [x] 30% — Unnið með gögn, þau staðfest, hugað að öryggi og vistuð í postgres grunni gegnum Prisma.
- [x] 20% — TypeScript notað.
- [ ] 10% — Tæki, tól og test, verkefni sett upp í hýsingu.





