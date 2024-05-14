import { Model, Document } from "mongoose";

export interface User {
  password: string;
  email: string;
  role: "user" | "admin";
  accountType: "google" | "email";
  token: string;
  verified: boolean;
  profileURL: string;
  itemsInCart: [];
}

export interface UserDocument extends User, Document {
  comparePassword: (candidatePassword: string) => Promise<Boolean>;
  verifyOTP: (OTP: string) => Promise<Boolean>;
  createAccessToken: () => Promise<string>;
  createRefreshToken: () => Promise<string>;
}

export interface UserModel extends Model<UserDocument> {}
