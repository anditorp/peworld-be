const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const createHttpError = require("http-errors");
const { response } = require("../utils/response");
const cloudinary = require("../configs/cloudinary");

const {
  selectAllWorker,
  update,
  selectDetailWorker,
  countWorker,
  selectWorkerById,
} = require("../models/worker");
const userModel = require("../models/user");
const workerModel = require("../models/worker");

const createWorker = async (req, res, next) => {
  try {
    const { email, password, name, phone } = req.body;
    const {
      rows: [user],
    } = await userModel.findByEmail(email);
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
    const email = req.decoded.email;
    const result = await userModel.findByEmail(email, { relation: "worker" });

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const {
      rows: [worker],
    } = result;

    if (!worker) {
      return res.status(404).json({
        status: "error",
        message: "Worker not found",
      });
    }

    const { rows: profile } = await selectDetailWorker(worker.user_id);
    console.log(profile);
    if (!profile.length) {
      return res.status(404).json({
        status: "error",
        message: "Worker profile not found",
      });
    }

    res.json({
      status: "success",
      data: profile[0],
    });
  } catch (error) {
    next(error);
  }
};

const getWorkerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await selectWorkerById(id);

    if (!rows.length) {
      return res.status(404).json({
        status: "error",
        message: "Worker not found",
      });
    }

    res.json({
      status: "success",
      data: rows[0],
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const email = req.decoded.email;
    const result = await userModel.findByEmail(email, { relation: "worker" });

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const {
      rows: [worker],
    } = result;

    if (!worker) {
      return res.status(404).json({
        status: "error",
        message: "Worker not found",
      });
    }

    const { name, job_desc, domicile, workplace, description } = req.body;
    let photoUrl = worker.photo;

    if (req.file) {
      const photo = await cloudinary.uploader.upload(req.file.path);
      photoUrl = photo.secure_url;
    }

    const data = {
      name,
      job_desc,
      domicile,
      workplace,
      description,
      photo: photoUrl,
    };
    await update(data, worker.user_id);

    res.json({
      status: "success",
      message: "Profile updated successfully",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllWorker,
  getDetailWorker,
  getWorkerById, // <-- Add this line
  createWorker,
  updateProfile,
};
