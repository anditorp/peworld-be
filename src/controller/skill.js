const pool = require("../configs/db");
const { response } = require("../utils/response");

const { selectAll, selectDetail, create, drop } = require("../models/skill");

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
    const id = req.params.id;
    const {
      rows: [skill],
    } = await selectDetail(id);
    res.json({
      status: "success",
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};

const createSkill = async (req, res, next) => {
  try {
    const { skill_name } = req.body;

    const data = {
      skill_name,
    };
    await create(data);
    res.status(201);
    res.json({
      status: "success",
      message: "data berhasil ditambahkan",
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
