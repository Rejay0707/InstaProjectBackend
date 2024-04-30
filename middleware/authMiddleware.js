import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

//Protect routes
// const protect = async (req, res, next) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     token = req.headers.authorization.split(" ")[1];
//   }
//   //   console.log(req);

//   // console.log(token)

//   if (token) {
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       // console.log(decoded);
//       req.user = await User.findById(decoded.userId).select("-password");

//       next();
//     } catch (error) {
//       console.log(error);
//       res.status(401).json({
//         message: "Authentication failed. Please sign in again.",
//       });
//     }
//   } else {
//     res.status(401).json({
//       message: "Authentication failed. No token provided.",
//     });
//   }
// };
const protect = async (req, res, next) => {
  let token;
//   console.log(req);

  token = req.headers.token;
    console.log(token);

  //   console.log(token);
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      console.log(error);
      res.status(401).json({
        message: "Authentication failed. Please sign in again.",
      });
    }
  } else {
    res.status(401).json({
      message: "Authentication failed. No token provided.",
    });
  }
};

// Get user Id
const userId = (req) => {
  const token = req.cookies.jwt;

  if (!token) {
    return null;
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    return decodedToken.userId;
  } catch (error) {
    console.log("Error verifying JWT:", error);
    return null;
  }
};

//check user
const checkUserDetails = (req, res, next) => {
  // console.log(req)
  const user_id = userId(req);
  const id = req.params.id;
  console.log(user_id, id);
  if (id === user_id) {
    next();
  } else {
    return res.status(404).json({
      message: "User ID Not Found",
    });
  }
};

export { protect, checkUserDetails };
