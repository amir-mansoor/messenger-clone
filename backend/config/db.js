import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(conn.connection.host);
  } catch (e) {
    console.log("There was an error while connecting to db.");
  }
};

export default connectDB;
