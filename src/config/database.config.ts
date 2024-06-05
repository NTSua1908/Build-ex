import mongoose from "mongoose";
import User from "../models/User";
import bcrypt from "bcrypt";

require("dotenv").config();
const databaseUrl = process.env.DATABASE_URL;

const connectDatabase = async () => {
  if (databaseUrl)
    return mongoose
      .connect(databaseUrl)
      .then(async () => {
        await seedData();
      })
      .catch(() => {
        console.log("Can not connect to database");
      });
  else console.log("Can not find connection string");
};

export default connectDatabase;

const seedData = async () => {
  const existedUsers = await User.find();
  if (existedUsers.length == 0) {
    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;
    const secondPassword = process.env.SECOND_PASSWORD;
    const thirdPassword = process.env.THIRD_PASSWORD;

    if (email && password && secondPassword && thirdPassword) {
      await User.create({
        email: email,
        password: bcrypt.hashSync(password, 10),
        secondPassword: bcrypt.hashSync(secondPassword, 10),
        thirdPassword: bcrypt.hashSync(thirdPassword, 10),
      });
    } else {
      console.log("Can not seed data");
    }
  }
};
