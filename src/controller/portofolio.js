const pool = require("../configs/db");
const { response } = require("../utils/response");

const {
  selectAll,
  selectDetail,
  create,
  drop,
  update,
} = require("../models/portofolio");

const getAllPortofolio = async (req, res, next) => {
  try {
    const { rows } = await selectAll();
    response(res, rows, 200, "get data success");
  } catch (error) {
    next(error);
  }
};

const getDetailPortofolio = async (req, res, next) => {
  try {
    const id = req.params.id;
    const {
      rows: [portofolio],
    } = await selectDetail(id);
    res.json({
      status: "success",
      data: portofolio,
    });
  } catch (error) {
    next(error);
  }
};

const createPortofolio = async (req, res, next) => {
  try {
    const { application_name, link_repository, application, image } = req.body;

    const data = {
      application_name,
      link_repository,
      application,
      image,
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

const dropPortofolio = async (req, res, next) => {
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

const updatePortofolio = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { application_name, link_repository, application, image } = req.body;

    const data = {
      application_name,
      link_repository,
      application,
      image,
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
  getAllPortofolio,
  getDetailPortofolio,
  createPortofolio,
  dropPortofolio,
  updatePortofolio,
};
