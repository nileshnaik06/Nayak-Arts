const express = require("express");
const cors = require("cors");
const user = require("./Routes/user.routes");
const images = require("./Routes/image.routes");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "https://nayak-arts.vercel.app/",
    credentials: true,
  }),
);

app.use("/", user);
app.use("/", images);

module.exports = app;
