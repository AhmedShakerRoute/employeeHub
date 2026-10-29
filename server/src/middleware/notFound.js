// Registered after every router in app.js: if we got here, no route matched the request.
module.exports = function notFound(req, res) {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
};
