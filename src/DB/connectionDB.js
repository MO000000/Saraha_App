import mongoose from "mongoose";
import { DB_URI } from "../config/config.service.js";

const checkConnection = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Database connection failed", error);
  }
};

export default checkConnection;
