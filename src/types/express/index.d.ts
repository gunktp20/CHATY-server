export { Request };
import mongoose from "mongoose";

declare global {
  namespace Express {
    export interface Request {
      user?: {
        email?: string;
        userId?: mongoose.Types.ObjectId;
        role?: "user" | "admin";
      };
    }
  }
}
