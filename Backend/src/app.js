const express = require("express");
const cors = require("cors");
const user = require("./Routes/user.routes");
const images = require("./Routes/image.routes");
const cookieParser = require("cookie-parser");
const contactRoutes = require("./Routes/contact.routes");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://nayak-arts.vercel.app"],
    credentials: true,
  }),
);
app.use(cookieParser());

app.use("/api/user", user);
app.use("/api/images", images);
app.use("/api", contactRoutes);
module.exports = app;
