import { Model, Document, Schema } from "mongoose";

export const ObjectId = Schema.Types.ObjectId;

export interface Chat {
  chatId: typeof ObjectId;
}

export interface ChatDocument extends Chat, Document {}

export interface ChatModel extends Model<ChatDocument> {}
