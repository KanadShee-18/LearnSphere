import type { NextFunction, Response } from "express";
import { contactUsEmail } from "../mail/templates/contactFormRes.js";
import type { AuthRequest } from "../types/extend-auth.js";
import { mailSender } from "../utils/mailSender.js";
import logger from "../configs/logger.js";
import { BadRequestError } from "../utils/error-handler.js";

export const contactUsHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
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
    return next(
      new BadRequestError("All fields are required in contact us form.")
    );
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
    return next(error);
  }
};
