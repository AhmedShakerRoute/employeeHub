// =====================================================================
// Entry point (Session 2): load settings, connect to MongoDB, then start listening.
//
// HOW TO RUN THE DEMO
//   1. copy .env.example to .env and paste your Atlas connection string
//   2. npm install
//   3. npm run seed   -> fills the database with 3 departments and 4 employees
//   4. npm run dev
//
// CONCEPT: why connect FIRST and listen SECOND?
//   If the API accepted requests before the database was ready, every request would fail.
//   connectDB() returns a Promise; .then() runs only after the connection succeeded.
// =====================================================================

// CONCEPT: dotenv reads the .env file and copies every KEY=value into process.env.
// It must run before any code that reads process.env (so: the very first line).
require('dotenv').config();

const app = require('./src/app'); // the Express app (middleware + routes), no listen() inside
const connectDB = require('./src/config/db');

// process.env values are strings or undefined. `|| 5000` is the local fallback.
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
});
