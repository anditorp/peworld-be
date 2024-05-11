const express = require("express");

const {
  getAllSkill,
  getDetailSkill,
  createSkill,
  dropSkill,
} = require("../controller/skill");
const pool = require("../configs/db");
const route = express.Router();

route
  .get("/", getAllSkill)
  .get("/:id", getDetailSkill)
  .post("/", createSkill)
  .delete("/:id", dropSkill);

module.exports = route;
