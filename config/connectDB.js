import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const dbOptions = {
      dbName: process.env.DataBase_Name,
    };
    const connect = await mongoose.connect(process.env.DATABASE_URL, dbOptions);
    // console.log(`DataBase Connect Successfully...`);
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
