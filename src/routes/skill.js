const express = require("express");

const {
  getAllSkill,
  getDetailSkill,
  createSkill,
  dropSkill,
} = require("../controller/skill");
const { protect, checkRole } = require("../middleware/auth");
const route = express.Router();

route
  .get("/", getAllSkill)
  .get("/my-skill", protect, checkRole("worker"), getDetailSkill)
  .post("/", protect, checkRole("worker"), createSkill)
  .delete("/:id", protect, checkRole("worker"), dropSkill);

module.exports = route;
