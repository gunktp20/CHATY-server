import { connect } from "mongoose";

const connectDB = async (url: string) => {
  try {
    await connect(url);
    console.log("connected to database success");
  } catch (err) {
    console.log("connect to database failed !");
    console.log(err);
  }
};

export default connectDB;
