import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import generateToken from "../utils/token.js";

const register = asyncHandler(async (req, res) => {
  const { name, number, password } = req.body;
  if (name.trim() === "" || number.trim() === "" || password.trim() === "") {
    res.status(400);
    throw new Error("All fields are required");
  }
  const exist = await User.findOne({ phoneNumber: number });
  if (exist) {
    res.status(400);
    throw new Error("Already registerd");
  }

  const user = await User.create({
    name,
    phoneNumber: number,
    password,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      name: user.name,
      phoneNumber: user.phoneNumber,
    });
  }
});

const login = asyncHandler(async (req, res) => {
  const { number, password } = req.body;

  if (number.trim() === "" || password.trim() === "") {
    res.status(400);
    throw new Error("All fields are required");
  }
  const user = await User.findOne({ phoneNumber: number });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(200).json({
      name: user.name,
      phoneNumber: user.phoneNumber,
    });
  } else {
    res.status(400);
    throw new Error("Invalid phone number / password");
  }
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({
    message: "Logout successfully",
  });
});

export { register, login, logout };
