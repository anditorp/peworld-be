const { response } = require("../utils/response");
const userModel = require("../models/user");
const { selectAll, selectDetail, create, drop } = require("../models/skill");
const createHttpError = require("http-errors");

const getAllSkill = async (req, res, next) => {
  try {
    const { rows } = await selectAll();
    response(res, rows, 200, "get data success");
  } catch (error) {
    next(error);
  }
};

const getDetailSkill = async (req, res, next) => {
  try {
    const email = req.decoded.email;

    const result = await userModel.findByEmail(email);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const { user_id } = result.rows[0];
    const { rows: mySkills } = await selectDetail(user_id);

    if (!mySkills.length) {
      return res.status(404).json({
        status: "error",
        message: "Skills not found",
      });
    }

    res.json({
      status: "success",
      data: mySkills,
    });
  } catch (error) {
    next(error);
  }
};

const createSkill = async (req, res, next) => {
  try {
    const email = req.decoded.email;
    const {
      rows: [skill],
    } = await userModel.findByEmail(email, { relation: "worker" });

    if (!skill) {
      return next(createHttpError(404, "Worker not found"));
    }

    const { skill_name } = req.body;

    const data = {
      user_id: skill.user_id,
      skill_name,
    };

    await create(data);

    res.status(201).json({
      status: "success",
      message: "Skill added successfully",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

const dropSkill = async (req, res, next) => {
  try {
    const id = req.params.id;
    await drop(id);

    res.json({
      status: "success",
      message: "skill berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSkill,
  getDetailSkill,
  createSkill,
  dropSkill,
};
