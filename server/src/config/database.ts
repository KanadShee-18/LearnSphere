import mongoose, { type ConnectOptions } from "mongoose";
import { CONFIGS } from "./index.js";

const options: ConnectOptions = {
  retryWrites: true,
  autoIndex: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

export const connect = async (): Promise<void> => {
  try {
    const mongoUrl = CONFIGS.database_url;
    if (!mongoUrl) {
      throw new Error("<<< [MONGO_URL] is not provided! >>>");
    }

    await mongoose.connect(mongoUrl, options);
    console.log("<<< ✅ [DB] Connected Successfully ... >>>");
  } catch (error) {
    console.log("<<< ❌ [DB] Connected failed ... >>>", error);
    process.exit(1);
  }
};
