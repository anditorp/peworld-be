const express = require("express");
const {
  getAllPortofolio,
  getDetailPortofolio,
  createPortofolio,
  dropPortofolio,
  updatePortofolio,
} = require("../controller/portofolio");
const { protect, checkRole } = require("../middleware/auth");
const upload = require("../configs/multer");

const route = express.Router();

route
  .get("/", getAllPortofolio)
  .get("/my-portofolio", protect, checkRole("worker"), getDetailPortofolio)
  .post(
    "/",
    protect,
    checkRole("worker"),
    upload.single("image"),
    createPortofolio
  )
  .put(
    "/:id",
    protect,
    checkRole("worker"),
    upload.single("image"),
    updatePortofolio
  )
  .delete("/:id", protect, checkRole("worker"), dropPortofolio);

module.exports = route;
