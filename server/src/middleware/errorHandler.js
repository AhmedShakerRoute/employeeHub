// One place that turns every error into a clean JSON response.
// Express 5 sends errors thrown inside async routes here automatically.
//
// CONCEPT: why one central error handler?
//   Controllers stay short: they just `await` and let errors fly.
//   Every error type gets ONE consistent JSON shape and the RIGHT status code:
//     CastError        -> 400  (bad id format, e.g. /api/employees/123)
//     ValidationError  -> 400  (schema rules failed)
//     code 11000       -> 409  (duplicate value in a unique field)
//     err.statusCode   -> that code (errors we create on purpose)
//     anything else    -> 500  (a real bug: log it, hide the details from the client)
//
// DEMO: GET /api/employees/123 -> 400 "Invalid _id: 123"
// DEMO: POST /api/employees {} -> 400 with all 4 messages
// DEMO: POST /api/departments { "name": "IT" } twice -> 409 'name "IT" already exists'
module.exports = function errorHandler(err, req, res, next) {
  // A bad ObjectId like /api/employees/123
  // (an ObjectId is 24 hex characters, so "123" cannot be cast to one)
  if (err.name === 'CastError') {
    return res.status(400).json({ message: `Invalid ${err.path}: ${err.value}` });
  }

  // Mongoose schema rules failed (required, min, ...)
  // err.errors is an object with one entry per broken field; we keep only the messages.
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  // Unique index violated, e.g. two departments called "IT"
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ message: `${field} "${err.keyValue[field]}" already exists` });
  }

  // Invalid JSON body
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON body' });
  }

  // Errors we created on purpose with a status
  if (err.statusCode) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  console.error(err);
  res.status(500).json({ message: 'Something went wrong' });
};
