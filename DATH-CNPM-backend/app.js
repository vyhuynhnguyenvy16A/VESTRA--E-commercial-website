import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

import router from "./src/routes/index.js";
app.use('/api', router);

const PORT = process.env.PORT || 3000; // Lấy PORT từ .env, nếu không có thì dùng 3000
app.listen(PORT, () => {
  console.log(` Server đang chạy thành công trên cổng ${PORT}`);
});
