const nodemailer = require("nodemailer");
require("dotenv").config();

exports.mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: `"Learn Sphere - by Kanad" <${process.env.MAIL_USER}>`,
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });
    console.log(info);

    return info;
  } catch (error) {
    res.status("500").json({
      error: error.message,
      msg: "Failed to send mail.",
    });
  }
};
