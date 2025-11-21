import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../types/extend-auth.js";
import { Course, type ICourse } from "../models/course.model.js";
import { Types } from "mongoose";
import { razorpayInstance } from "../configs/razorpay.config.js";
import crypto from "crypto";
import { CourseProgress } from "../models/courseProgress.model.js";
import { User } from "../models/user.model.js";
import { mailSender } from "../utils/mailSender.js";
import { courseEnrollmentEmail } from "../mail/templates/courseEnrollmentEmail.js";
import { paymentSuccessEmail } from "../mail/templates/paymentSuccessEmail.js";
import logger from "../configs/logger.js";
import {
  BadRequestError,
  NotFoundError,
  ValidationError,
} from "../utils/error-handler.js";

// Initiate the razorpay order
export const capturePayment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // logger.info(req.body);

  const { courses } = req.body;
  const userId = req.auth?.authUser?.id;

  if (courses.length === 0) {
    return next(
      new BadRequestError("Courses are required to initiate payment.")
    );
  }
  let totalAmount = 0;
  for (const course_id of courses) {
    let course;
    try {
      course = await Course.findById(course_id);
      if (!course) {
        return next(new NotFoundError("Could not find the course."));
      }
      const uid = userId as Types.ObjectId;
      if (course.studentsEnrolled.includes(uid)) {
        return res.status(200).json({
          success: false,
          message: "Student is already enrolled in this course.",
        });
      }
      if (course.price) {
        totalAmount += course.price;
      }
    } catch (error) {
      // logger.info(error.message);
      logger.error("Error in course modification: ", error);
      return next(new NotFoundError("Could not find the course."));
    }
  }
  const options = {
    amount: totalAmount * 100,
    currency: "INR",
    receipt: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
  };
  try {
    const paymentRes = await razorpayInstance.orders.create(options);

    const PaymentResponse = {
      ...paymentRes,
      key: process.env.RAZORPAY_KEY,
    };

    // PaymentResponse.key = process.env.RAZORPAY_KEY as string;
    // logger.info("Payment Response: ", PaymentResponse);
    // logger.info("Order has been successfully initiated.");

    res.json({
      success: true,
      message: PaymentResponse,
    });
    return;
  } catch (error) {
    logger.error("Error in initiating order: ", error);
    return next(error);
  }
};

export const verifyPayment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body?.courses;
    const userId = req.auth?.userId;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !courses ||
      !userId
    ) {
      return next(
        new BadRequestError("All fields are required for payment verification.")
      );
    }
    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET as string)
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
    return next(new BadRequestError("Invalid signature sent!"));
  } catch (error) {
    // logger.error("Error in payment verification: ", error);
    return next(error);
  }
};

const enrollStudents = async (
  courses: ICourse[],
  userId: string,
  res: Response
) => {
  try {
    if (!courses || !userId) {
      throw new ValidationError(
        "Courses and User ID are required for enrollment."
      );
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
          throw new NotFoundError("Course not found!");
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
          throw new NotFoundError("Student not found!");
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
        // console.log(
        //   "Course enrollment email has been sent successfully. The response is: ",
        //   mailResponse
        // );
      } catch (error) {
        logger.error("Error in enroll students controller: ", error);
        throw error;
      }
    }
  } catch (error) {
    // logger.error("Error in enroll students controller: ", error);
    throw error;
  }
};

export const sendPaymentSuccessEmail = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { orderId, paymentId, amount } = req.body;
  const userId = req.auth?.userId;

  if (!orderId || !paymentId || !amount || !userId) {
    return next(
      new BadRequestError("All fields are required to send payment email.")
    );
  }
  try {
    // Find the student email
    const enrolledStudent = await User.findById(userId);
    if (!enrolledStudent) {
      return next(new NotFoundError("Student not found!"));
    }
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
    logger.error("Error occurred in sending payment success mail: ", error);
    return next(error);
  }
};
