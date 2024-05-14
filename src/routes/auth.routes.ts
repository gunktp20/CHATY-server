import express from "express";
import {
  login,
  register,
  verifyEmailWithToken,
} from "../controllers/auth.controller";
import authJwtMiddelware from "../middlewares/auth";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/verify-email/:token").get(verifyEmailWithToken);

export default router;
