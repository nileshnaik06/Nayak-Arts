const express = require("express");
const sendMail = require("../Controller/contact.Controller");
const router = express.Router();

router.post("/contact", sendMail);

module.exports = router;
