const express = require("express");
const {
  create,
  selectByWorker,
  selectByRecruiters,
} = require("../controller/hire");
const { protect, checkRole } = require("../middleware/auth");

const route = express.Router();

route.post("/", protect, checkRole("recruiter"), create);
route.get("/worker", protect, checkRole("worker"), selectByWorker);
route.get("/recruiter", protect, checkRole("recruiter"), selectByRecruiters);

module.exports = route;
