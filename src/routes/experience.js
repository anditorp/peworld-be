const express = require("express");

const {
  getAllExperience,
  getDetailExperience,
  createExperience,
  dropExperience,
  updateExperience,
} = require("../controller/experience");
const pool = require("../configs/db");
const route = express.Router();

route
  .get("/", getAllExperience)
  .get("/:id", getDetailExperience)
  .post("/", createExperience)
  .put("/:id", updateExperience)
  .delete("/:id", dropExperience);

module.exports = route;
