import type { Response } from "express";
import { contactUsEmail } from "../mail/templates/contactFormRes.js";
import type { AuthRequest } from "../types/extend-auth.js";
import { mailSender } from "../utils/mailSender.js";
import logger from "../configs/logger.js";

export const contactUsHandler = async (req: AuthRequest, res: Response) => {
  const { email, firstname, lastname, message, phoneno, countrycode } =
    req.body;

  if (
    !email ||
    !firstname ||
    !lastname ||
    !message ||
    !phoneno ||
    !countrycode
  ) {
    res.status(403).json({
      success: false,
      message: "All fields are required!",
    });
    return;
  }

  // logger.info("Contact form data received: ", req.body);

  try {
    const mailRes = await mailSender(
      email,
      "We have received your data successfully.",
      contactUsEmail(email, firstname, lastname, message, phoneno, countrycode)
    );
    logger.info("Email res of contact: ", mailRes);

    res.json({
      success: true,
      message: "Email send successfully.",
    });
    return;
  } catch (error) {
    // logger.error("Contact form error: ", error);
    // logger.error("Error Message: ", error.message);
    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "An unknown error occurred.",
      });
    }
    return;
  }
};
