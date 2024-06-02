import mongoose from "mongoose";
import { Schema } from "mongoose";

export const ObjectId = Schema.Types.ObjectId;

const MessageSchema = new mongoose.Schema(
  {
    chatId: ObjectId,
    senderId: ObjectId,
    text: {
      type: String,
      require: true,
      trim: true,
    },
    seen: {
      type: Boolean,
      require:true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("messages", MessageSchema);
