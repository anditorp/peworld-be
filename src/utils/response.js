const response = (res, result, status, message, pagination) => {
  const resultPrint = {};
  resultPrint.status = "Success";
  (resultPrint.statusCode = status), (resultPrint.data = result);
  resultPrint.message = message;
  if (pagination) {
    resultPrint.pagination = pagination;
  }
  res.status(status).json(resultPrint);
};

module.exports = {
  response,
};
