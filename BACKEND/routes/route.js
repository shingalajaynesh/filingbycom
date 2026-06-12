import express from "express";
import registerUser from "../controller/registerUser.controller.js";
import checkUser from "../controller/checkUser.controller.js";
import { authenticateToken } from "../lib/verifyToken.js";
import { getAllServices } from "../controller/service.controller.js";

const router = express.Router();

router.post("/register", authenticateToken, registerUser);
router.get("/check-user", authenticateToken, checkUser);

// Public routes
router.get("/services", getAllServices);

export default router;
