import { Request, Response } from "express";
import Message from "../models/Message";
import Chat from "../models/Chat";
import { StatusCodes } from "http-status-codes";

const createMessage = async (req: Request, res: Response) => {
  const { chatId, senderId, text } = req.body;

  const message = new Message({
    chatId,
    senderId,
    text,
  });

  await Chat.findOneAndUpdate(
    { _id: chatId, "members.user": req.user?.userId },
    {
      $set: { "members.$.isUptoDate": true },
      lastestMessage: {
        message: text,
        senderId,
      },
    }
  );

  try {
    const response = await message.save();
    res.status(StatusCodes.OK).json(response);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
};

const getMessage = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  try {
    const messages = await Message.find({ chatId });
    res.status(StatusCodes.OK).json(messages);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
};

export { createMessage, getMessage };
