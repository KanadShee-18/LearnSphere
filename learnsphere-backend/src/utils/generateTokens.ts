import jwt from "jsonwebtoken";
import crypto from "crypto";
import { RefreshToken } from "../models/refreshToken.model.js";
import "dotenv/config";
import type { PAYLOAD_TYPE } from "../types/payload-type.js";
import logger from "../configs/logger.js";

const ACCESS_SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export const signAccessToken = (payload: PAYLOAD_TYPE) => {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "25m" });
};

export const signRefreshToken = (payload: PAYLOAD_TYPE) => {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
};

const hashToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const storeRefreshToken = async (
  userId: string,
  tokenToHash: string,
  daysCnt: 7
) => {
  const hashedToken = hashToken(tokenToHash);
  const expiresAt = new Date(Date.now() + daysCnt * 24 * 60 * 60 * 1000);

  const createdToken = await RefreshToken.create({
    userId,
    token: hashedToken,
    expiresAt,
  });

  return createdToken;
};

export async function findRefreshToken(
  userId: string,
  rawIncomingToken: string
) {
  const tokenHash = hashToken(rawIncomingToken);
  console.log("Token to check: ", tokenHash);
  const data = await RefreshToken.findOne({ userId, token: tokenHash }).exec();
  console.log("Data: ", data);
  return data;
}

export async function revokeRefreshToken(
  userId: string,
  rawIncomingToken: string
) {
  console.log("Revoking refresh token...");
  const tokenHash = hashToken(rawIncomingToken);
  return await RefreshToken.findOneAndDelete({
    userId,
    token: tokenHash,
  }).exec();
}
