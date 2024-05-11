const pool = require("../configs/db");
const { response } = require("../utils/response");

const {
  selectAll,
  selectDetail,
  create,
  drop,
  update,
} = require("../models/experience");

const getAllExperience = async (req, res, next) => {
  try {
    const { rows } = await selectAll();
    response(res, rows, 200, "get data success");
  } catch (error) {
    next(error);
  }
};

const getDetailExperience = async (req, res, next) => {
  try {
    const id = req.params.id;
    const {
      rows: [experience],
    } = await selectDetail(id);
    res.json({
      status: "success",
      data: experience,
    });
  } catch (error) {
    next(error);
  }
};

const createExperience = async (req, res, next) => {
  try {
    const { position, company, work_month, work_year, description } = req.body;

    const data = {
      position,
      company,
      work_month,
      work_year,
      description,
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

const dropExperience = async (req, res, next) => {
  try {
    const id = req.params.id;
    await drop(id);

    res.json({
      status: "success",
      message: "experience berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
};

const updateExperience = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { position, company, work_month, work_year, description } = req.body;

    const data = {
      position,
      company,
      work_month,
      work_year,
      description,
    };
    await update(data, id);

    res.json({
      status: "success",
      message: "data berhasil ditambahkan",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllExperience,
  getDetailExperience,
  createExperience,
  dropExperience,
  updateExperience,
};
