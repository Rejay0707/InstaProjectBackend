import User from "../models/userModel.js";
import {
  registerUser,
  checkUser,
  loginUser,
  updateUserPicture,
} from "../service/userService.js";
import generateToken from "../utils/generateToken.js";
import { deleteUserPicture } from "../service/userService.js";

const generateTokenResponse = (res, user) => {
  generateToken(res, user._id);
};

//for register

const createUser = async (req, res) => {
  const { name, email, password, isAdmin } = req.body;

  try {
    const userExists = await checkUser(email);

    if (userExists) {
      return await res.status(403).json({
        message: "User already Exists",
      });
    }
    const user = await registerUser(name, email, password, isAdmin);

    let token = generateToken(res, user._id);
    console.log(token);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: token,
    });
  } catch (error) {
    res.status(401).json({
      message: "registration failed please try again later",
    });
  }
};

//for login
const authenticateUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    const user = await loginUser(email, password);
    // console.log(user);
    if (user) {
      // Generate token and send user data with token
      let token = generateToken(res, user._id);

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: token,
      });
    } else {
      // User not found or password incorrect
      res.status(401).json({
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

//get user
const getUser = async (req) => {
  const user = await User.findById(req.params.id);
  if (user) {
    return user;
  } else {
    throw new Error("User not found");
  }
};

// @desc Get User by ID
// @route GET /api/users/:id
// @access Private/Admin
const getUserByID = async (req, res) => {
  const user = await getUser(req);
  res.status(200).json(user);
};

//for uploading picture

const updateUserPictureController = async (req, res) => {
  try {
    const userId = req.user._id;
    const picturePath = req.file.path; // Path to the uploaded picture
    await updateUserPicture(userId, picturePath); // Call the service function to update the user's picture
    res
      .status(200)
      .json({ message: "Picture updated successfully", file: req.file });
  } catch (error) {
    console.error("Error updating user picture:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//for deleting picture

const deleteUserPictureController = async (req, res) => {
    console.log('hi')
  try {
    const userId = req.user._id; // Assuming you have user ID in req.user after authentication
    console.log(userId)
    await deleteUserPicture(userId);
    res.status(200).json({ message: "Picture deleted successfully" });
  } catch (error) {
    console.error("Error deleting user picture:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export {
  generateTokenResponse,
  createUser,
  authenticateUser,
  getUserByID,
  updateUserPictureController,
  deleteUserPictureController,
};


