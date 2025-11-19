import mongoose, { type ConnectOptions } from "mongoose";
import { CONFIGS } from "./index.js";
import logger from "./logger.js";

const options: ConnectOptions = {
  retryWrites: true,
  autoIndex: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

export const dbConnect = async (): Promise<void> => {
  try {
    const mongoUrl = CONFIGS.database_url;
    if (!mongoUrl) {
      throw new Error("<<< [MONGO_URL] is not provided! >>>");
    }

    await mongoose.connect(mongoUrl, options);
    logger.info("<<< ✅ [DB] Connected Successfully ... >>>");
  } catch (error) {
    logger.error("<<< ❌ [DB] Connected failed ... >>>", error);
    process.exit(1);
  }
};
