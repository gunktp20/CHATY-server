import express from "express";
import {
  setPassword,
  uploadImage,
  getUserInfo,
} from "../controllers/user.controller";
import multer from "multer";
import path from "path";
import { BadRequestError } from "../errors";
import fs from "fs";
const router = express.Router();

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `src/uploads/images/profile/${req.user?.userId}`);
  },
  filename: function (req, file, cb) {
    cb(null, new Date().valueOf() + path.extname(file.originalname));
  },
});

import authJwtMiddleware from "../middlewares/auth";

const imageUpload = multer({
  storage: diskStorage,
  fileFilter: (req, file, cb) => {
    const pathToFileOrDir = `src/uploads/images/profile/${req.user?.userId}`;
    if (!fs.existsSync(pathToFileOrDir)) {
      fs.mkdirSync(pathToFileOrDir);
    }
    const acceptedExtensionsList = [".jpg", ".jpeg", ".png"];
    const extname = path.extname(file.originalname).toLowerCase();
    if (!acceptedExtensionsList.includes(extname)) {
      return cb(
        new BadRequestError(
          "Invalid file extension allow only .jpg .jpeg .png "
        )
      );
    }
    const fileSize = new Number(req?.headers["content-length"]);
    if (fileSize > ((1 * 1024 * 1024) as Number)) {
      return cb(
        new BadRequestError("File size must be equal 1 mb or more than")
      );
    }
    cb(null, true);
  },
});

router.route("/password").put(setPassword);
router.route("/info").get(authJwtMiddleware,getUserInfo);
router
  .route("/upload-profile-img")
  .post(authJwtMiddleware, imageUpload.single("profile"), uploadImage);

export default router;
