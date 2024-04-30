import express from "express";
import {
  createUser,
  authenticateUser,
  getUserByID,
  updateUserPictureController,
  deleteUserPictureController,
} from "../controllers/userController.js";
import { protect, checkUserDetails } from "../middleware/authMiddleware.js";
import upload from "../config/multerConfig.js";

const router = express.Router();
router.post("/register", createUser);
// router.post("/login",authenticateUser);
router.post("/login", (req, res, next) => {
  console.log("hi");
  authenticateUser(req, res, next);
});

router.get("/id:", protect, checkUserDetails, getUserByID);
router.post(
  "/picture",
  protect,
  upload.single("picture"),
  updateUserPictureController
);
router.delete("/deletePicture", protect, deleteUserPictureController);

export default router;
