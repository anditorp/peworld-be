const express = require("express");

const {
  getAllWorker,
  getDetailWorker,
  createWorker,
  updateProfile,
} = require("../controller/worker");

const route = express.Router();
const { protect, checkRole } = require("../middleware/auth");

route
  .get("/", getAllWorker)
  .get("/:id", protect, checkRole("worker"), getDetailWorker)
  .post("/register", createWorker)
  .put("/:id", updateProfile);

module.exports = route;
