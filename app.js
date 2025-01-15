require("dotenv").config({ path: `${process.cwd()}/.env` });

const express = require("express");
const cors = require("cors");

const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const authRouter = require("./route/authRoute");
const userRouter = require("./route/userRoute");
const roleRouter = require("./route/roleRoute");
const acessRouter = require("./route/acessRoute");
const departmentRouter = require("./route/departmentRoute");
const facilityRouter = require("./route/facilityRoute");


const catchAsync = require("./utils/catchAsync");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/errorController");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
// all routes will be here
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/roles", roleRouter);
app.use("/api/v1/access", acessRouter);
app.use("/api/v1/departments", departmentRouter);
app.use("/api/v1/facilities",facilityRouter);

app.use(
  "*",
  catchAsync(async (req, res, next) => {
    throw new AppError(`Can't find ${req.originalUrl} on this server`, 404);
  })
);

app.use(globalErrorHandler);

const PORT = process.env.APP_PORT || 4000;

app.listen(PORT, () => {
  console.log("Server up and running", PORT);
});
