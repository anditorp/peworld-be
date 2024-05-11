const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.statusCode) {
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

module.exports = errorHandler;
