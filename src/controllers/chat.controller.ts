import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import Chat from "../models/Chat";

const createChat = async (req: Request, res: Response) => {
  const { firstId, secondId } = req.body;

  try {
    const chat = await Chat.findOne({
      "members.user": { $all: [firstId, secondId] },
    });

    if (chat) {
      console.log(chat);
      return res.status(StatusCodes.OK).json(chat);
    }
    const newChat = await Chat.create({
      members: [{ user: firstId }, { user: secondId }],
    });
    console.log(chat);
    res.status(StatusCodes.OK).json(newChat);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
};

const findUserChats = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  try {
    const chats = await Chat.find({
      "members.user": { $in: [userId] },
    }).populate("members.user");

    res.status(StatusCodes.OK).json(chats);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
};

const findChat = async (req: Request, res: Response) => {
  const { firstId, secondId } = req.params;
  try {
    const chats = await Chat.find({
      "members.user": { $all: [firstId, secondId] },
    }).populate("members.user");
    res.status(StatusCodes.OK).json(chats);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
};

const checkUnreadChat = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const unreadChats = await Chat.find({
      "members.user": userId,
      "members.isUptoDate": false,
      'lastestMessage.message': { $ne: "", $exists: true }
    }).populate("members.user");
    const filteredUnreadChats = await unreadChats.filter((chat) => {
      if (chat?.lastestMessage?.message !== "" || chat?.lastestMessage?.message !== null) {
        return chat;
      }
    });
    res.status(StatusCodes.OK).json(filteredUnreadChats);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
};

export { createChat, findUserChats, findChat, checkUnreadChat };
