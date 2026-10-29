// Vercel entry: one serverless function that runs the whole Express app.
require('dotenv').config();
const mongoose = require('mongoose');
const app = require('../src/app');

let connection; // reused while the function stays warm

module.exports = async (req, res) => {
  connection = connection || mongoose.connect(process.env.MONGODB_URI);
  await connection;
  return app(req, res);
};