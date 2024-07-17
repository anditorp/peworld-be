const express = require("express");
const usersController = require("../controller/user");
const route = express.Router();

route
  .post("/login", usersController.login)
  .post("/refresh-token", usersController.refreshToken)
  .post("/logout", usersController.logout)
  .get("/check-role", usersController.checkRole);
module.exports = route;
