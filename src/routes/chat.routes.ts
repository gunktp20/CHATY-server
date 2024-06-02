import express from "express";
import {
  createChat,
  findUserChats,
  findChat,
  checkUnreadChat,
} from "../controllers/chat.controller";
const router = express.Router();

router.route("/find/:firstId/:secondId").get(findChat);
router.route("/").post(createChat);
router.route("/:userId").get(findUserChats);
router.route("/checkUnread/:userId").get(checkUnreadChat);

export default router;
