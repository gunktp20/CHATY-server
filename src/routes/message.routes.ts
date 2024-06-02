import express from "express";
import { createMessage, getMessage } from "../controllers/message.controller";
const router = express.Router();
import authJwtMiddleware from "../middlewares/auth";

router.route("/").post(authJwtMiddleware,createMessage)
router.route("/:chatId").get(getMessage)

export default router;
