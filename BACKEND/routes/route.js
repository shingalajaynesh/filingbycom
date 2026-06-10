import express from "express";
import registerUser from "../controller/registerUser.controller.js";
import checkUser from "../controller/checkUser.controller.js";
import { authenticateToken } from "../lib/verifyToken.js";

const router = express.Router();

router.post("/register", authenticateToken, registerUser);
router.get("/check-user", authenticateToken, checkUser);

export default router;
