const express = require("express");
const {
  getAllWorker,
  getDetailWorker,
  getWorkerById,
  createWorker,
  updateProfile,
} = require("../controller/worker");
const { protect, checkRole } = require("../middleware/auth");
const upload = require("../middleware/upload");

const route = express.Router();

route
  .get("/", getAllWorker)
  .get("/profile", protect, checkRole("worker"), getDetailWorker)
  .get("/:id", getWorkerById)
  .post("/register", createWorker)
  .put(
    "/update-profile",
    protect,
    checkRole("worker"),
    upload.single("photo"),
    updateProfile
  );

module.exports = route;
