const pool = require("../configs/db");
const { selectAll, create, update } = require("../models/recruiter");

const createRecruiter = async (req, res, next) => {
  const { email, password, name, company, position, phone } = req.body;

  const data = {
    email,
    password,
    name,
    company,
    position,
    phone,
  };
  await create(data);
  res.status(201);
  res.json({
    status: "success",
    message: "data berhasil ditambahkan",
    data: data,
  });
};

const getRecruiter = async (req, res, next) => {
  const { rows } = await selectAll();
  res.json({
    status: "success",
    data: rows,
  });
};

const updateProfile = async (req, res, next) => {
  const id = req.params.id;
  const {
    company,
    position,
    city,
    description,
    phone,
    instagram,
    linkedin,
    photo,
  } = req.body;

  const data = {
    company,
    position,
    city,
    description,
    phone,
    instagram,
    linkedin,
    photo,
  };
  await update(data, id);

  res.json({
    status: "success",
    message: "data berhasil ditambahkan",
    data: data,
  });
};

module.exports = {
  getRecruiter,
  createRecruiter,
  updateProfile,
};
