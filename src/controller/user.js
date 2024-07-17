const createHttpError = require("http-errors");
const usersModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { response } = require("../utils/response");
const { generateToken, generateRefreshToken } = require("../utils/auth");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const {
      rows: [user],
    } = await usersModel.findByEmail(email);
    if (!user) {
      return next(createHttpError(403, "email atau password salah"));
    }
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return next(createHttpError(403, "email atau password salah"));
    }
    delete user.password;
    const payload = {
      email: user.email,
      role: user.role,
    };
    const token = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);
    response(res, { ...user, token, refreshToken }, 200, "anda berhasil login");
  } catch (error) {
    console.log(error);
    next(new createHttpError.InternalServerError());
  }
};

const refreshToken = (req, res) => {
  const refreshToken = req.body.refreshToken;
  const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY_JWT);

  const payload = {
    email: decoded.email,
    role: decoded.role,
  };

  const data = {
    token: generateToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
  response(res, data, 200, "Refresh Token Success");
};

const checkRole = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Assuming Bearer token format

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);

    // Extract role from decoded token
    const role = decoded.role;

    // Respond with the role
    response(res, { role }, 200, "Role fetched successfully");
  } catch (error) {
    console.log(error);
    next(createHttpError(401, "Unauthorized"));
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout Success" });
  } catch (error) {
    console.log(error);
    next(createHttpError(500, "Internal Server Error"));
  }
};

module.exports = {
  login,
  refreshToken,
  checkRole,
  logout,
};
