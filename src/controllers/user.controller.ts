import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import "express-async-errors";
import { BadRequestError } from "../errors";
import User from "../models/User";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";

interface IJwtPayload extends JwtPayload {
  email: string;
}

const getUserInfo = async (req: Request, res: Response) => {
  const userInfo = await User.findById(req.user?.userId);
  res.status(StatusCodes.OK).json(userInfo);
};

const uploadImage = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const { filename, mimetype, size } = req?.file;
  const filepath = req?.file?.path;
  console.log("filepath", filepath);
  const result = await User.findOneAndUpdate(
    { _id: req.user?.userId },
    {
      profileURL: `${API_DOMAIN}/profile/${req.user?.userId}/${filename}`,
    }
  );
  res.status(200).json({
    msg: "File uploaded successfull",
    filename,
    mimetype,
    size,
    filepath,
  });
};
const setPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body;
  if (!password) {
    throw new BadRequestError("Please provide all value");
  }

  const { email } = (await jwt.verify(
    token,
    process.env.JWT_EMAIL_VERIFIED as string
  )) as IJwtPayload;
  const user = await User.findOne({ email });
  if (!user) {
    throw new BadRequestError("Not found your account");
  }

  if (user.password) {
    throw new BadRequestError(
      "Can't set your password , You're alraeady define password"
    );
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  user.password = hashedPassword;
  user?.save();
  const accessToken = await user.createAccessToken();
  const refreshToken = await user.createRefreshToken();
  res.status(StatusCodes.OK).json({ user, accessToken, refreshToken });
};

export { setPassword, uploadImage, getUserInfo };
