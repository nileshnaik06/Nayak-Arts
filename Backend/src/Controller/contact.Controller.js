const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendMail(req, res) {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await resend.emails.send({
      from: "onboarding@resend.dev", // default testing sender
      to: process.env.EMAIL_USER, // your Gmail
      reply_to: email, // so you can reply directly
      subject: subject || `New message from ${name}`,
      html: `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Resend Error:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
}

module.exports = sendMail;
