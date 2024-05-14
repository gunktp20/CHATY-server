import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import "express-async-errors";
import { BadRequestError, UnAuthenticatedError } from "../errors/index";
import jwt, { JwtPayload } from "jsonwebtoken";
import { FORM_VERIFY_EMAIL } from "../utils/emailVerification";
import User from "../models/User";
import schedule from "node-schedule";
import transporter from "../utils/transporter";

interface IJwtPayload extends JwtPayload {
  email: string;
}

const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide all value");
  }

  const user = await User.findOne({ email });

  if (user?.verified === true) {
    throw new BadRequestError("E-mail was already in use");
  }
  const date = new Date();
  const expriedIn = date.setMinutes(date.getMinutes() + 15);

  if (user?.verified === false) {
    const token = await jwt.sign(
      { email },
      process.env.JWT_EMAIL_VERIFIED as string,
      {
        expiresIn: "15m",
      }
    );
    const updatedUser = await User.findOneAndUpdate(
      {
        email,
      },
      { token }
    );
    await transporter.sendMail({
      from: "arrliver@gmail.com",
      to: updatedUser?.email,
      html: FORM_VERIFY_EMAIL(token),
    });
    const countDeleteUser = schedule.scheduleJob(expriedIn, async () => {
      const user = await User.findOne({ email });
      if (user?.verified === false) {
        await User.deleteOne({ email });
      }
      countDeleteUser.cancel();
    });
    return res
      .status(StatusCodes.OK)
      .json({ msg: "Resend your verification in your e-mail" });
  }

  const token = await jwt.sign(
    { email },
    process.env.JWT_EMAIL_VERIFIED as string,
    {
      expiresIn: "15m",
    }
  );

  const newUser = await User.create({
    email,
    password,
    token,
  });

  try {
    await transporter.sendMail({
      from: "arrliver@gmail.com",
      to: newUser?.email,
      html: FORM_VERIFY_EMAIL(token),
    });
    const countDeleteUser = schedule.scheduleJob(expriedIn, async () => {
      const user = await User.findOne({ email });
      if (user?.verified === false) {
        await User.deleteOne({ email });
      }
      countDeleteUser.cancel();
    });
    return res.status(StatusCodes.OK).json({
      msg: "Created your account , Please verify your email in 15 minutes",
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide all value");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new BadRequestError("Not found your account");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError("Password is incorrect");
  }
  const accessToken = await user.createAccessToken();
  res.status(StatusCodes.OK).json({ accessToken });
};

const verifyEmailWithToken = async (req: Request, res: Response) => {
  const { token } = req.params;
  if (!token) {
    throw new BadRequestError("Please provide a token");
  }
  try {
    const { email } = (await jwt.verify(
      token,
      process.env.JWT_EMAIL_VERIFIED as string
    )) as IJwtPayload;
    const user = await User.findOneAndUpdate({ email }, { verified: true });
    return res
      .status(StatusCodes.OK)
      .json({ msg: `your account with email : ${user?.email} was verified` });
  } catch (err) {
    throw new UnAuthenticatedError("Token is not valid");
  }
};

export { register, login, verifyEmailWithToken };
