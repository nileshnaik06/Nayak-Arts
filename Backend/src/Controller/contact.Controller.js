const transporter = require("../config/mailer");

exports.sendMail = async (req, res) => {
  try {
    console.log("Body:", req.body);

    const { name, email, message } = req.body;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Test",
      text: message,
    });

    res.status(200).json({ message: "Sent" });
  } catch (error) {
    console.error("Mail Error:", error);
    res.status(500).json({ message: error.message });
  }
};