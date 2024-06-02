import { model, Schema } from "mongoose";
import { UserDocument } from "./types/user.model";
import dotenv from "dotenv";
dotenv.config();
import { ChatDocument, ObjectId } from "./types/chat.model";

const ChatSchema = new Schema({
  members: [
    {
      user: {
        type: ObjectId,
        ref: "users",
      },
      isUptoDate: {
        type: Boolean,
        default: false,
      },
    },
  ],
  lastestMessage: {
    message: String,
    senderId: ObjectId,
  },
});

export default model<ChatDocument>("chats", ChatSchema);
