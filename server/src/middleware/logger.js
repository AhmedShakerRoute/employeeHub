// Logs: METHOD URL -> STATUS (time)
// Same middleware as Session 1, now in its own file and exported as a function.
module.exports = function logger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${Date.now() - start} ms)`);
  });
  next(); // without next() the request would never reach the routes
};
