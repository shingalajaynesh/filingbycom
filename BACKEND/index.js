import dns from "node:dns";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { clerkMiddleware } from "@clerk/express";
import connectDB from "./config/db.config.js";
import router from "./routes/route.js";

// Use Google DNS to resolve MongoDB Atlas SRV records reliably
dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(clerkMiddleware());
app.use(router);

connectDB();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
