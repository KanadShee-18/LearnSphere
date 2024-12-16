const { contactUsEmail } = require("../mail/templates/contactFormRes");
const { mailSender } = require("../utils/mailSender");

exports.contactUsHandler = async (req, res) => {
  const { email, firstname, lastname, message, phoneno, countrycode } =
    req.body;

  // console.log(req.body);

  try {
    const mailRes = await mailSender(
      email,
      "We have received your data successfully.",
      contactUsEmail(email, firstname, lastname, message, phoneno, countrycode)
    );
    // console.log("Email res of contact: ", mailRes);

    return res.json({
      success: true,
      message: "Email send successfully.",
    });
  } catch (error) {
    // console.log("Contact form error: ", error);
    // console.log("Error Message: ", error.message);
    return res.json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};
