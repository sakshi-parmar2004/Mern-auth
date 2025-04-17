import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDb } from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const allowedOrigin = ["http://localhost:5173"]

app.use(cors({
  origin: allowedOrigin, // frontend address
  credentials: true
}));

app.use(express.json());       // ✅ Parse incoming JSON
app.use(cookieParser());       // ✅ Parse cookies

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("Server is running at", PORT);
});

await connectDb();
