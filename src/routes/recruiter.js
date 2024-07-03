const express = require("express");
const {
  createRecruiter,
  getAllRecruiter,
  getDetailRecruiter,
  updateProfile,
} = require("../controller/recruiter");
const { protect, checkRole } = require("../middleware/auth");
const upload = require("../middleware/upload");

const route = express.Router();

route
  .get("/", getAllRecruiter)
  .get("/profile", protect, checkRole("recruiter"), getDetailRecruiter)
  .post("/register", createRecruiter)
  .put(
    "/update-profile",
    protect,
    checkRole("recruiter"),
    upload.single("photo"),
    updateProfile
  );

module.exports = route;
