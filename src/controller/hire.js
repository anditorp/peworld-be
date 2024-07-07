const { v4: uuidv4 } = require("uuid");
const createHttpError = require("http-errors");
const users = require("../models/user");
const hire = require("../models/hire");

const create = async (req, res, next) => {
  try {
    const email = req.decoded.email;
    const {
      rows: [recruiter],
    } = await users.findByEmail(email, { relation: "recruiter" });

    if (!recruiter) {
      return next(createHttpError(404, "Recruiter not found"));
    }

    const { message_purpose, worker_id } = req.body;

    const hireData = {
      id: uuidv4(),
      user_id: recruiter.user_id,
      message_purpose,
      worker_id,
      recruiter_id: recruiter.id,
      name: recruiter.name,
      phone: recruiter.phone,
      description: recruiter.description,
      company: recruiter.company,
    };

    await hire.create(hireData);

    res.status(201).json({
      status: "success",
      message: "Hire created successfully",
      data: hireData,
    });
  } catch (error) {
    next(error);
  }
};

const selectByRecruiters = async (req, res, next) => {
  try {
    const email = req.decoded.email;
    const {
      rows: [user],
    } = await users.findByEmail(email, { relation: "recruiter" });

    if (!user) {
      return next(createHttpError(404, "Recruiter not found"));
    }
    // console.log(user.user_id);
    const { rows } = await hire.selectAllFromHireByRecruiter(user.user_id);
    // console.log(rows);

    res.status(200).json({
      status: "success",
      message: "Get hire data by recruiter success",
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};
const selectByWorker = async (req, res, next) => {
  try {
    const email = req.decoded.email;
    const {
      rows: [user],
    } = await users.findByEmail(email, { relation: "worker" });

    if (!user) {
      return next(createHttpError(404, "Worker not found"));
    }
    // console.log(user.id);
    const { rows } = await hire.selectAllFromHireByWorker(user.id);
    // console.log(rows);

    res.status(200).json({
      status: "success",
      message: "Get hire data by recruiter success",
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  selectByWorker,
  selectByRecruiters,
};
