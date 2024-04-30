import User from "../models/userModel.js";
import fs from "fs";

//for register

const registerUser = async (name, email, password, isAdmin) => {
  const user = await User.create({
    name,
    email,
    password,
    isAdmin,
  });
  return user;
};

//check User
const checkUser = async (email) => {
  const user = await User.findOne({ email });

  if (user) {
    return user;
  }
};

//for login

const loginUser = async (email, password) => {
  console.log(email, password);
  const user = await User.findOne({ email });
  console.log("user", user);

  if (user && (await user.matchPassword(password))) {
    return user;
  } else {
    throw new Error("Invalid email or password");
  }
};

//for uploding picture

const updateUserPicture = async (userId, picturePath) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  user.picture = picturePath;
  await user.save();
  return user;
};

//for deleting picture

const deleteUserPicture = async (userId) => {
    console.log('hi')
  const user = await User.findById(userId);
  console.log(user)
  if (!user) {
    throw new Error("User not found");
  }
  const picturePath = user.picture;
  if (picturePath) {
    // Delete the picture file from the server
    // const fs = require('fs');
    fs.unlinkSync(picturePath);
    // Update the user's record to remove the picture path
    user.picture = "";
    await user.save();
  }
  return user;
};

export {
  registerUser,
  checkUser,
  loginUser,
  updateUserPicture,
  deleteUserPicture,
};
