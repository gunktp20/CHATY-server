import { Model, Document, Schema } from "mongoose";

export const ObjectId = Schema.Types.ObjectId;

export interface Message {
  members: {
    chatId: string;
    senderId: string;
    text: string;
  };
}

export interface MessageDocument extends Message, Document {}

export interface MessageModel extends Model<MessageDocument> {}
