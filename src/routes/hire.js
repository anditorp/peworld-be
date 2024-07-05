const express = require("express");

const { create } = require("../controller/hire");
const { protect, checkRole } = require("../middleware/auth");
const route = express.Router();

route.post("/", protect, checkRole("recruiter"), create);

module.exports = route;
