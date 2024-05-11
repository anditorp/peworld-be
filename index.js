const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const errorHandler = require("./src/middleware/errorHandler");
const workerRoute = require("./src/routes/worker");
const recruiterRoute = require("./src/routes/recruiter");
const skillRoute = require("./src/routes/skill");
const experienceRoute = require("./src/routes/experience");
const portofolioRoute = require("./src/routes/portofolio");
const userRoute = require("./src/routes/user");

const PORT = process.env.PORT;
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(xss());

app.get("/", (req, res) => {
  res.send("Server ready to use");
});

app.use("/worker", workerRoute);
app.use("/recruiter", recruiterRoute);
app.use("/skill", skillRoute);
app.use("/experience", experienceRoute);
app.use("/portofolio", portofolioRoute);
app.use("/user", userRoute);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server running in port ${PORT}`);
});
