const { response } = require("../utils/response");
const cloudinary = require("../configs/cloudinary");
const userModel = require("../models/user");
const createHttpError = require("http-errors");
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
    const email = req.decoded.email;

    const result = await userModel.findByEmail(email, { relation: "worker" });
    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const { user_id } = result.rows[0];
    console.log(user_id);
    const { rows: myPortofolios } = await selectDetail(user_id);
    console.log(myPortofolios);

    if (!myPortofolios.length) {
      return res.status(404).json({
        status: "error",
        message: "Portofolios not found",
      });
    }
    console.log(myPortofolios);
    res.json({
      status: "success",
      data: myPortofolios,
    });
  } catch (error) {
    next(error);
  }
};

const createPortofolio = async (req, res, next) => {
  try {
    const email = req.decoded.email;
    const {
      rows: [user],
    } = await userModel.findByEmail(email, { relation: "worker" });

    if (!user) {
      return next(createHttpError(404, "Worker not found"));
    }

    const { application_name, link_repository, application } = req.body;
    const image = req.file;

    if (!image) {
      return res
        .status(400)
        .json({ status: "fail", message: "Image is required" });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(image.path);

    const data = {
      user_id: user.user_id,
      application_name,
      link_repository,
      application,
      image: result.secure_url,
    };
    await create(data); // Pastikan user_id yang digunakan saat create sesuai dengan pengguna yang sedang login

    res.status(201).json({
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
    const { application_name, link_repository, application } = req.body;
    const image = req.file;

    let data = {
      application_name,
      link_repository,
      application,
    };

    if (image) {
      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(image.path);
      data.image = result.secure_url;
    }

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
