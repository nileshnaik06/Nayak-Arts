const express = require("express");
const controller  = require('../Controller/user.controller')

const route = express.Router();

route.post("/register",controller.createUser);
route.post("/login",controller.loginUser);

module.exports = route;
