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

! ATH - Á eftir að skoða 500 kóðana í flestu 
- [x] `GET /categories` 200, 500
- [x] `Get /categories/:slug` 200, 404, 500
- [x] `POST /category ` 201, 400, 500
- [x] `PATCH /category/:slug` 200, 400, 404, 500
- [x] `DELETE /category/:slug` 204, 404, 500

Questions (questions and answers)

- [ ] `GET /questions` All questions
- [ ] `GET /questions/category/:slug` questions by category
--- 
ATH! Ekki viss með POST og PATCH, hafa eitt fyrir spurningu og svör eða sitthvort fyrir spurningu og sitthvot fyrir svör
- [ ] `POST /questions` Create question
- [ ] `PATCH /questions/:slug` edit question


- Skoðað spurningar.
- Skoða spurningar eftir flokk.
- Búa til spurningu.
- Breyta spurningu.


Annað 

- [ ] Setja upp automatic database með prisma Seeding
- [ ] Nota Zod fyrir staðfestingu gagan
- [ ] nota xss fyrir skráningu gagna
- [ ] Setja upp próf
- [ ] Github actions
- [ ] Setja upp vef á t.d render, tengt við postgres og github
- [ ] Kennurum í repo
----

- [ ] 40% — Vefþjónustur útfærðar með Hono.
- [ ] 30% — Unnið með gögn, þau staðfest, hugað að öryggi og vistuð í postgres grunni gegnum Prisma.
- [ ] 20% — TypeScript notað.
- [ ] 10% — Tæki, tól og test, verkefni sett upp í hýsingu.





