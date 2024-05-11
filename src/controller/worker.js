const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const createHttpError = require("http-errors");

const { response } = require("../utils/response");

const {
  selectAllWorker,
  update,
  selectDetailWorker,
  countWorker,
} = require("../models/worker");

const userModel = require("../models/user");
const workerModel = require("../models/worker");

const createWorker = async (req, res, next) => {
  try {
    const { email, password, name, phone } = req.body;
    const {
      rows: [user],
    } = await userModel.findByemail(email);
    if (user) {
      return next(createHttpError(403, "User Sudah terdaftar"));
    }
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    const userId = uuidv4();
    const workerId = uuidv4();
    const dataUser = {
      id: userId,
      email,
      password: passwordHash,
      role: "worker",
    };
    const dataWorker = {
      id: workerId,
      name,
      phone,
      userId,
    };
    await userModel.create(dataUser);
    await workerModel.create(dataWorker);
    res.status(201);
    res.json({
      status: "success",
      message: "Data berhasil ditambahkan",
      data: { user: dataUser, worker: dataWorker },
    });
  } catch (error) {
    next(error);
  }
};

const getAllWorker = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 3);
    const sort = req.query.sort || "name";
    const sortBy = req.query.sortBy || "ASC";
    const search = req.query.search || "";
    const offset = (page - 1) * limit;

    const { rows } = await selectAllWorker({
      limit,
      offset,
      sort,
      sortBy,
      search,
    });
    const {
      rows: [count],
    } = await countWorker();
    const totalData = count.total;
    const totalPage = Math.ceil(totalData / limit);

    const pagination = {
      limit,
      page,
      totalData,
      totalPage,
    };
    response(res, rows, 200, "get data success", pagination);
  } catch (error) {
    next(error);
  }
};

const getDetailWorker = async (req, res, next) => {
  try {
    const id = req.params.id;
    const {
      rows: [worker],
    } = await selectDetailWorker(id);
    res.json({
      status: "success",
      data: worker,
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { name, job_desc, domicile, workplace, description } = req.body;

    const data = {
      name,
      job_desc,
      domicile,
      workplace,
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
  getAllWorker,
  getDetailWorker,
  createWorker,
  updateProfile,
};
