import dotenv from "dotenv";
dotenv.config();

export const CONFIGS = {
  port_no: process.env.PORT,
  database_url: process.env.MONGO_URL,
  mail_host: process.env.MAIL_HOST,
  mail_user: process.env.MAIL_USER,
  mail_pass: process.env.MAIL_PASS,
  jwt_secret: process.env.JWT_SECRET,
  cloudinary_folder: process.env.CLOUDINARY_FOLDER_NAME,
  cloudinary_cloud: process.env.CLOUD_NAME,
  cloudinary_api_key: process.env.API_KEY,
  cloudinary_api_secret: process.env.API_SECRET,
  razorpay_key: process.env.RAZORPAY_KEY,
  razorpay_secret: process.env.RAZORPAY_SECRET,
  google_api_scope: process.env.SCOPE,
  google_api_client_mail: process.env.CLIENT_MAIL,
  google_api_private_key: process.env.PRIVATE_KEY,
  google_drive_folder_identifier: process.env.GOOGLE_DRIVE_FOLDER,
  client_side_url: process.env.BASE_URL,
  node_environment: process.env.NODE_ENV,
  server_url: process.env.SERVER_URL,
};
