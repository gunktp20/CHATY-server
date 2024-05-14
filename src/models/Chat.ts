import { model, Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import { UserDocument } from "./types/user.model";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { Chat, ObjectId } from "./types/chat.model";

const ChatSchema = new Schema({
  members: {
    type: Array<typeof ObjectId>,
    require: true,
    trim: true,
  },
});

export default model<UserDocument>("chats", ChatSchema);
