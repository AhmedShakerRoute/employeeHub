// =====================================================================
// The Express app: middleware + routes. No listen() here, so it is easy to test and reuse.
//
// CONCEPT: separation of concerns (MVC-style structure)
//   app.js        -> wiring: which middleware, which router on which path
//   routes/       -> URL + method  ->  which controller function
//   controllers/  -> the logic of one request (read input, call the model, send the response)
//   models/       -> the shape and rules of the data (Mongoose schemas)
//   middleware/   -> code that runs around the routes (logging, 404, errors)
//
// The request path through the files:
//   request -> app.js -> employeeRoutes.js -> employeeController.js -> Employee model -> MongoDB
// =====================================================================
const express = require('express');
const cors = require('cors');
const logger = require('./middleware/logger');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const departmentRoutes = require('./routes/departmentRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());
 
app.use(cors({ origin: allowedOrigins }));


app.use(express.json());
app.use(logger);

// A tiny endpoint to check the API is alive (hosting platforms use this in Session 5).
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// CONCEPT: mounting a router. Every path inside employeeRoutes is relative to /api/employees,
// so router '/:id' becomes '/api/employees/:id'.
app.use('/api/departments', departmentRoutes);
app.use('/api/employees', employeeRoutes);

// Always last: unknown routes, then errors
app.use(notFound);
app.use(errorHandler);

// CommonJS export: server.js and tests can require('./src/app').
module.exports = app;
