import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/connectDB.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect DataBase
connectDB();

// Cors Policy
app.use(cors());
app.use(morgan("dev"));

app.get("/", (req, res) =>
  res.send({ Message: "Welcome To Authentication Project" })
);
//
app.use("/", userRoutes);

app.listen(PORT, () => console.log(`App Listening on PORT ${PORT}`));
