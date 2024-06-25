const express = require("express");

const {
  getAllExperience,
  getDetailExperience,
  createExperience,
  dropExperience,
  updateExperience,
} = require("../controller/experience");
const { protect, checkRole } = require("../middleware/auth");
const route = express.Router();

route
  .get("/", getAllExperience)
  .get("/my-experience", protect, checkRole("worker"), getDetailExperience)
  .post("/", protect, checkRole("worker"), createExperience)
  .put("/:id", updateExperience)
  .delete("/:id", dropExperience);

module.exports = route;
