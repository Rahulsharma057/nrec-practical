function notFound(req, res) {
  res.status(404).json({ message: "Route nahi mila: " + req.originalUrl });
}

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  if (err && err.code === 11000) {
    return res.status(409).json({ message: "Yeh record pehle se maujood hai" });
  }
  console.error(err);
  res.status(status).json({ message: err.message || "Server error" });
}

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = { notFound, errorHandler, asyncHandler };
