const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const createHttpError = require("http-errors");
const { response } = require("../utils/response");
const cloudinary = require("../configs/cloudinary");

const {
  selectAllRecruiter,
  update,
  selectDetailRecruiter,
  countRecruiter,
  create,
} = require("../models/recruiter");
const userModel = require("../models/user");

const createRecruiter = async (req, res, next) => {
  try {
    const { email, password, name, company, position, phone } = req.body;
    const {
      rows: [user],
    } = await userModel.findByEmail(email);
    if (user) {
      return next(createHttpError(403, "User already registered"));
    }
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    const userId = uuidv4();
    const recruiterId = uuidv4();
    const dataUser = {
      id: userId,
      email,
      password: passwordHash,
      role: "recruiter",
    };
    const dataRecruiter = {
      id: recruiterId,
      name,
      company,
      position,
      phone,
      userId,
    };
    await userModel.create(dataUser);
    await create(dataRecruiter);
    res.status(201);
    res.json({
      status: "success",
      message: "Data successfully added",
      data: { user: dataUser, recruiter: dataRecruiter },
    });
  } catch (error) {
    next(error);
  }
};

const getAllRecruiter = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 3);
    const sort = req.query.sort || "name";
    const sortBy = req.query.sortBy || "ASC";
    const search = req.query.search || "";
    const offset = (page - 1) * limit;

    const { rows } = await selectAllRecruiter({
      limit,
      offset,
      sort,
      sortBy,
      search,
    });
    const {
      rows: [count],
    } = await countRecruiter();
    const totalData = count.total;
    const totalPage = Math.ceil(totalData / limit);

    const pagination = {
      limit,
      page,
      totalData,
      totalPage,
    };
    response(res, rows, 200, "Get data success", pagination);
  } catch (error) {
    next(error);
  }
};

const getDetailRecruiter = async (req, res, next) => {
  try {
    const email = req.decoded.email;
    // console.log(email);
    const result = await userModel.findByEmail(email, {
      relation: "recruiter",
    });
    // console.log(result);
    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const {
      rows: [recruiter],
    } = result;

    if (!recruiter) {
      return res.status(404).json({
        status: "error",
        message: "Recruiter not found",
      });
    }

    const { rows: profile } = await selectDetailRecruiter(recruiter.user_id);
    if (!profile.length) {
      return res.status(404).json({
        status: "error",
        message: "Recruiter profile not found",
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

const updateProfile = async (req, res, next) => {
  try {
    const email = req.decoded.email;
    const result = await userModel.findByEmail(email, {
      relation: "recruiter",
    });

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const {
      rows: [recruiter],
    } = result;

    if (!recruiter) {
      return res.status(404).json({
        status: "error",
        message: "Recruiter not found",
      });
    }

    const {
      name,
      company,
      position,
      city,
      description,
      phone,
      instagram,
      linkedin,
    } = req.body;
    let photoUrl = recruiter.photo;

    if (req.file) {
      const photo = await cloudinary.uploader.upload(req.file.path);
      photoUrl = photo.secure_url;
    }

    const data = {
      name,
      company,
      position,
      city,
      description,
      phone,
      instagram,
      linkedin,
      photo: photoUrl,
    };
    await update(data, recruiter.user_id);

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
  getAllRecruiter,
  getDetailRecruiter,
  createRecruiter,
  updateProfile,
};
