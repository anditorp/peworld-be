const { response } = require("../utils/response");
const fs = require("fs");

const uploadSingle = (req, res) => {
  const data = {
    file: `http://localhost:5000/file/` + req.file.filename,
  };

  response(res, data, 201, "upload file success");
};

const deleteFile = (req, res) => {
  const filePath = "./assets/" + req.params.filename;
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file", err);
      return response(res, null, 500, "failed to delete file");
    }
    return response(res, null, 200, "file deleted successfully");
  });
};

module.exports = {
  uploadSingle,
  deleteFile,
};
