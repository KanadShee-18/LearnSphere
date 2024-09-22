const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const { mailSender } = require("../utils/mailSender");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");
const mongoose = require("mongoose");
require("dotenv").config();

// Capture the payment and initialize the razorpay order:

exports.capturePayment = async (req, res) => {
  try {
    // get courseId and userId
    const { courseId } = req.body;
    const userId = req.user.id;
    // validation
    // valid courseId
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid course ID.",
      });
    }
    // valid courseDetail
    try {
      const findCourseDetail = await Course.findById(courseId);
      if (!findCourseDetail) {
        return res.status(404).json({
          success: false,
          message:
            "No course is available with this id. Please provide a valid course id.",
        });
      }
      // user already pay for the same course
      const uid = mongoose.Types.ObjectId(userId); // as we're getting the id as string so convert it to objectId
      if (Course.studentsEnrolled.includes(uid)) {
        return res.status(401).json({
          success: false,
          message: "Student is already enrolled in this course.",
        });
      }
    } catch (error) {
      res.status(404).json({
        success: false,
        message:
          "Some error occurred while getting the course data. Please try again.",
      });
    }

    // order create
    const amount = findCourseDetail.price;
    const currency = "INR";

    const options = {
      amount: amount * 100,
      currency: currency,
      receipt:
        Math.random().toString(36).substring(2) + Date.now().toString(36),
      notes: {
        courseId: courseId,
        userId: userId,
      },
    };

    try {
      // Initialize the payment with razorpay
      const paymentResponse = await instance.orders.create(options);
      console.log(paymentResponse);

      // success response
      res.status(200).json({
        success: true,
        courseName: findCourseDetail.courseName,
        courseDescription: findCourseDetail.courseDescription,
        thumbnail: findCourseDetail.thumbnail,
        orderId: paymentResponse.id,
        currency: paymentResponse.currency,
        amount: paymentResponse.amount,
      });
    } catch (error) {
      console.log(error);
      res.status(403).json({
        success: false,
        message: "Could not initiate payment order.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "Some error occurred while initiating payment. Please try again.",
    });
  }
};

// Verify Signature:

exports.veryfySignature = async (req, res) => {
  const webhooksecret = process.env.WEBHOOK_SECRET_KEY;

  const signature = req.headers["x-razorpay-signature"];

  const shaSum = crypto.createHmac("sha256", webhooksecret);
  shaSum.update(JSON.stringify(req.body));
  const digest = shaSum.digest("hex");

  if (signature === digest) {
    console.log("Payment is authorized.");

    // Get userId and courseid from notes we have sent in payment options
    const { userId, courseId } = req.body.payload.payment.entity.notes;

    try {
      // fulfil the action
      // find the course and enroll the student in it
      const enrolledCourse = await Course.findOne(
        { _id: courseId },
        {
          $push: {
            studentsEnrolled: userId,
          },
        },
        { new: true }
      );
      if (!enrolledCourse) {
        return res.status(500).json({
          success: false,
          message: "Course not found.",
        });
      }
      console.log(enrolledCourse);

      // find the student and update the courseId in enrolledcourses
      const enrolledStudent = await User.findOneAndUpdate(
        { _id: userId },
        {
          $push: {
            courses: courseId,
          },
        },
        { new: true }
      );
      console.log(enrolledStudent);

      // Send course enrollment email to user
      const emailResponse = await mailSender(
        enrolledStudent.email,
        "Congratulations from Learn Sphere",
        "Congratulations, you're onboarded to new learn sphere course."
      );

      console.log(emailResponse);

      return res.status(200).json({
        success: true,
        message: "Signature has been verified for your payment.",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          "Some error occurred while verifying the signature of payment.",
      });
    }
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid signature for the payment.",
    });
  }
};
