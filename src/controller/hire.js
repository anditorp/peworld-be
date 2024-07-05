const { v4: uuidv4 } = require("uuid");
const createHttpError = require("http-errors");
const users = require("../models/user");
const hire = require("../../src/models/hire");
const OneSignal = require("onesignal-node");
require("dotenv").config();

console.log("OneSignal App ID:", process.env.ONE_SIGNAL_APP_ID);
console.log("OneSignal API Key:", process.env.ONE_SIGNAL_API_KEY);
// Initialize OneSignal client
const oneSignalClient = new OneSignal.Client({
  userAuthKey: process.env.ONE_SIGNAL_API_KEY,
  app: {
    appAuthKey: process.env.ONE_SIGNAL_API_KEY,
    appId: process.env.ONE_SIGNAL_APP_ID,
  },
});

const create = async (req, res, next) => {
  try {
    const email = req.decoded.email;
    const {
      rows: [recruiter],
    } = await users.findByEmail(email, { relation: "recruiter" });

    if (!recruiter) {
      return next(createHttpError(404, "recruiter not found"));
    }

    const {
      message_purpose,
      worker_id,
      recruiter_id,
      name,
      phone,
      description,
      company,
    } = req.body;

    const data = {
      id: uuidv4(),
      user_id: recruiter.user_id,
      message_purpose,
      worker_id,
      recruiter_id,
      name,
      phone,
      description,
      company,
    };

    await hire.create(data);

    const notification = {
      contents: {
        en: `You have been hired by ${company}`,
      },
      include_external_user_ids: [worker_id],
    };

    await oneSignalClient.createNotification(notification);

    res.status(201).json({
      status: "success",
      message: "Hire successfully",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

// const selectByWorker = async (req, res, next) => {
//   try {
//     const email = req.decoded.email;
//     const {
//       rows: [user],
//     } = await users.findByEmail(email, { relation: "workers" });
//     const { rows } = await hire.selectAll({
//       filterBy: "worker_id",
//       filterValue: user.id,
//     });
//     response(res, rows, 200, "get hire with workers success");
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// };
// const selectByRecruiters = async (req, res, next) => {
//   try {
//     const email = req.decoded.email;
//     const {
//       rows: [user],
//     } = await users.findByEmail(email, { relation: "recruiters" });
//     const { rows } = await hire.selectAll({
//       filterBy: "recruiter_id",
//       filterValue: user.id,
//     });
//     response(res, rows, 200, "get hire with workers success");
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// };
module.exports = {
  create,
  //   selectByWorker,
  //   selectByRecruiters,
};
