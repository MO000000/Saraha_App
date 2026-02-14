import mongoose from "mongoose";

const checkConnection = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/saraha");
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Database connection failed", error);
  }
};

export default checkConnection;
