const express = require("express");
const {
  getAllWorker,
  getDetailWorker,
  createWorker,
  updateProfile,
} = require("../controller/worker");
const { protect, checkRole } = require("../middleware/auth");

const route = express.Router();

route
  .get("/", getAllWorker)
  .get("/profile", protect, checkRole("worker"), getDetailWorker)
  .post("/register", createWorker)
  .put("/update-profile", protect, checkRole("worker"), updateProfile);

module.exports = route;
