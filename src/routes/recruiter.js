const express = require("express");

const {
  createRecruiter,
  getRecruiter,
  updateProfile,
} = require("../controller/recruiter");
const pool = require("../configs/db");
const route = express.Router();

route
  .get("/", getRecruiter)
  .post("/", createRecruiter)
  .put("/:id", updateProfile);

module.exports = route;
