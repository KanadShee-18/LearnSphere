import type { Request } from "express";
import type { IUser } from "../models/user.model.js";
import type { UploadedFile } from "express-fileupload";

export interface AuthRequest extends Request {
  auth?: {
    userId: string;
    authUser?: IUser;
  };
  images?: UploadedFile;
}
