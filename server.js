import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { fileURLToPath } from 'url';
import {dirname} from "path";
import path from "path";

dotenv.config();

connectDB(); //Connect to MongoDB
const port = process.env.PORT || 8000;

const app = express();
app.use(cors());
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({extended : false}))
app.use((req, res, next) => {
  console.log("Request Cookies:", req.cookies);
  next();
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/users", userRoutes);

app.listen(port, () => {
  console.log("Server running on " + port);
});
