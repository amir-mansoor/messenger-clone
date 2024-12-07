const notFound = (req, res, next) => {
  const error = new Error(`not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let msg = err.message;
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: msg,
    stack: err.stack,
  });
};

export { notFound, errorHandler };
