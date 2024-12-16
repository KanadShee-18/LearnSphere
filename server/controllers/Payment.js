const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const { mailSender } = require("../utils/mailSender");
const crypto = require("crypto");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");
const {
  paymentSuccessEmail,
} = require("../mail/templates/paymentSuccessEmail");
const mongoose = require("mongoose");
const CourseProgress = require("../models/CourseProgress");
require("dotenv").config();

// Initiate the razorpay order
exports.capturePayment = async (req, res) => {
  console.log(req.body);

  const { courses } = req.body;
  const userId = req.user.id;

  if (courses.length === 0) {
    return res.json({
      success: false,
      message: "Please provide course Id!",
    });
  }
  let totalAmount = 0;
  for (const course_id of courses) {
    let course;
    try {
      course = await Course.findById(course_id);
      if (!course) {
        res.status(200).json({
          success: false,
          message: "Could not find the course.",
        });
      }
      const uid = new mongoose.Types.ObjectId(userId);
      if (course.studentsEnrolled.includes(uid)) {
        return res.status(200).json({
          success: false,
          message: "Student is already enrolled in this course.",
        });
      }
      totalAmount += course.price;
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  const options = {
    amount: totalAmount * 100,
    currency: "INR",
    receipt: Math.random(Date.now()).toString(),
  };
  try {
    const PaymentResponse = await instance.orders.create(options);
    PaymentResponse.key = process.env.RAZORPAY_KEY;
    console.log("Payment Response: ", PaymentResponse);
    console.log("Order has been successfully initiated.");

    res.json({
      success: true,
      message: PaymentResponse,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Could not initiate order.",
    });
  }
};

exports.verifyPayment = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;
  const courses = req.body?.courses;
  const userId = req.user.id;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(200).json({
      success: false,
      message: "Payment Failed.",
    });
  }
  let body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    // Enroll student
    await enrollStudents(courses, userId, res);

    return res.status(200).json({
      success: true,
      message: "Payment Verified!",
    });
  }
  return res.status(200).json({
    success: false,
    message: "Payment Failed!",
  });
};

const enrollStudents = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res.status(400).json({
      success: false,
      message: "Please provide data for Courses or UserId!",
    });
  }
  for (const courseId of courses) {
    try {
      // find course and enroll students
      const enrolledCourse = await Course.findByIdAndUpdate(
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
          message: "Course not found!",
        });
      }

      const courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      });

      // Also find student and add course id to their coruse list
      const enrolledStudent = await User.findByIdAndUpdate(
        { _id: userId },
        {
          $push: {
            courses: courseId,
            courseProgress: courseProgress._id,
          },
        },
        {
          new: true,
        }
      );
      if (!enrolledStudent) {
        return res.status(500).json({
          success: false,
          message: "User not found!",
        });
      }
      // Send mail to the student
      const mailResponse = await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          enrolledStudent.firstName,
          enrolledStudent.lastName
        )
      );
      console.log(
        "Course enrollment email has been sent successfully. The response is: ",
        mailResponse
      );
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
};

exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;
  const userId = req.user.id;

  if (!orderId || !paymentId || !amount || !userId) {
    return res.status(400).json({
      success: false,
      message: "Please provide all the fields!",
    });
  }
  try {
    // Find the student email
    const enrolledStudent = await User.findById(userId);
    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName}`,
        amount / 100,
        orderId,
        paymentId
      )
    );
  } catch (error) {
    console.log("Error occurred in sending payment success mail: ", error);
    return res.status(500).json({
      success: false,
      message: "Could not send payment success mail.",
      error: error.message,
    });
  }
};
