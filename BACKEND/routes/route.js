import express from "express";
import registerUser from "../controller/registerUser.controller.js";
import { authenticateToken } from "../lib/verifyToken.js";

const router = express.Router();

router.post("/register", authenticateToken, registerUser);

export default router;
