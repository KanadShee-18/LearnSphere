import nodemailer, { type Transporter, type SentMessageInfo } from "nodemailer";
import { CONFIGS } from "../configs/index.js";

export const mailSender = async (
  email: string,
  title: string,
  body: string
): Promise<SentMessageInfo | undefined> => {
  try {
    let transporter: Transporter = nodemailer.createTransport({
      host: CONFIGS.mail_host,
      port: 587,
      auth: {
        user: CONFIGS.mail_user,
        pass: CONFIGS.mail_pass,
      },
    });

    let info = await transporter.sendMail({
      from: `"Learn Sphere - by Kanad" <${CONFIGS.mail_user}>`,
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });
    console.log(info);

    return info;
  } catch (error) {
    console.log("Error in sending mail: ", error);
  }
};
