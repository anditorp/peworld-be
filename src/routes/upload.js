const express = require("express");
const router = express.Router();
const uploadController = require("../controller/upload");
const upload = require("../middleware/upload");

router.post("/", upload.single("file"), uploadController.uploadSingle);

router.delete("/:filename", uploadController.deleteFile);

module.exports = router;
