const express = require("express");

const {
  getAllPortofolio,
  getDetailPortofolio,
  createPortofolio,
  dropPortofolio,
  updatePortofolio,
} = require("../controller/portofolio");
const pool = require("../configs/db");
const route = express.Router();

route
  .get("/", getAllPortofolio)
  .get("/:id", getDetailPortofolio)
  .post("/", createPortofolio)
  .put("/:id", updatePortofolio)
  .delete("/:id", dropPortofolio);

module.exports = route;
