# Session 2 demo: MongoDB Atlas + Mongoose, MVC structure

**Goal:** the same API, now saving to a real database, split into models / controllers / routes,
with one central error handler.

## Run it
```bash
cd server
cp .env.example .env     # paste your Atlas connection string into MONGODB_URI
npm install
npm run seed             # 3 departments + 4 employees
npm run dev              # MongoDB connected: ... then API running on http://localhost:5000
```
Requests: `server/requests.http`. Replace the ids in it with real `_id` values from your database
(copy them from `GET /api/employees`).

## Live demo, step by step
| # | Do this | You should see | Concept to explain |
|---|---------|----------------|--------------------|
| 1 | Atlas: create cluster, DB user, Network Access, copy the string | | Atlas setup; database name before `?` |
| 2 | `npm run dev` with a wrong password | `bad auth : authentication failed`, process exits | Connect first, then listen; `process.exit(1)` |
| 3 | `npm run seed`, open the collections in Atlas | `departments`, `employees` | Documents, `_id` (ObjectId), `__v`, timestamps |
| 4 | Walk the folders: `app.js -> routes -> controllers -> models` | | Separation of concerns (MVC) |
| 5 | `GET /api/employees` | `{ items, total, page, pages }` | Pagination, `Promise.all` |
| 6 | `GET /api/employees/:id` with and without `.populate()` | object vs plain id | Reference vs embed, `populate` ~ `.Include()` |
| 7 | `GET /api/employees/123` | 400 `Invalid _id: 123` | CastError |
| 8 | `GET` a valid but deleted id | 404 | null result vs error |
| 9 | `POST /api/employees {}` | 400 with 4 messages | Schema validation, ValidationError |
| 10 | `POST /api/departments { "name": "IT" }` | 409 already exists | Unique index (not a validator), code 11000 |
| 11 | `PUT` with `salary: 10` | 400 | `runValidators: true` (off by default!) |
| 12 | `DELETE` a department with staff | 409 | No foreign keys in MongoDB: we protect it ourselves |
| 13 | Restart the server, `GET` again | Data is still there | Persistence, the point of the day |

## Break it on purpose
- Remove `runValidators: true` -> `PUT` with `salary: 10` now succeeds. Put it back.
- Remove `pickEmployeeFields` and send `"_id"` or `"createdAt"` in the body -> mass assignment risk.
- Forget the database name in the connection string -> data lands in a database called `test`.

## Concepts covered in the code comments
SQL vs NoSQL, collections/documents, ObjectId, schema options (required, minlength, min, trim, unique,
default, timestamps), embed vs reference, populate, query operators (`$regex`), skip/limit pagination,
`Promise.all`, async/await on network calls, `.env` + dotenv, central error handling and status mapping.
