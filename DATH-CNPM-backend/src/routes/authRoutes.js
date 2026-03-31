import express from "express";
import { register, login } from "../controllers/authController.js";

const authRoutes = express.Router();

// 3. TRỎ các đường dẫn vào hàm controller tương ứng
authRoutes.post("/register", register);
authRoutes.post("/login", login);

export default authRoutes;