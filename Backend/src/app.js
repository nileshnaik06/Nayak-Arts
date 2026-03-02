const express = require("express");
const cors = require("cors");
const user = require("./Routes/user.routes");
const images = require("./Routes/image.routes");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(cookieParser());

app.use("/api/user", user);
app.use("/api/images", images);

module.exports = app;
