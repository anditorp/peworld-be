const { response } = require("../utils/response");
const userModel = require("../models/user");
const createHttpError = require("http-errors");

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
    // console.log(worker);

    const { user_id } = worker;
    const { rows: experience } = await selectDetail(user_id);
    // console.log(experience);

    if (!experience.length) {
      return res.status(404).json({
        status: "error",
        message: "Experience not found",
      });
    }

    res.json({
      status: "success",
      data: experience,
    });
  } catch (error) {
    next(error);
  }
};

//   try {
//     const id = req.params.id;
//     const {
//       rows: [experience],
//     } = await selectDetail(id);
//     res.json({
//       status: "success",
//       data: experience,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const createExperience = async (req, res, next) => {
  try {
    const email = req.decoded.email;
    const {
      rows: [worker],
    } = await userModel.findByEmail(email, { relation: "worker" });

    if (!worker) {
      return next(createHttpError(404, "Worker not found"));
    }

    const { position, company, work_month, work_year, description } = req.body;

    const data = {
      user_id: worker.user_id,
      position,
      company,
      work_month,
      work_year,
      description,
    };

    await create(data);

    res.status(201).json({
      status: "success",
      message: "experience added successfully",
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
