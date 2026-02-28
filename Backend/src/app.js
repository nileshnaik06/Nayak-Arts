const express = require("express");
const cors = require("cors");
const user = require("./Routes/user.routes");
const images = require("./Routes/image.routes");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/", user);
app.use("/", images);

module.exports = app;
