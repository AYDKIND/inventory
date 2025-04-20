import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";

export const signup = async (req, res) => {
  try {
    console.log(req.body);
    const { fullName, email, password, confirmPassword } = req.body;
    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        message: "all fields required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(401).json({
        message: "passwords not matching",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "password length should be at least 8",
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "user already exists,login exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    const newUser = new User({
        email,
        fullName,
        password: hashedPassword,
      });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
    } else {
      return res.status(400).json({ message: "invalid user details" });
    }

    res.status(200).json(newUser);
  } catch (error) {
    console.log("error in signup controller", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({ message: "all fields required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Invalid Credentials" });
    }

    const hashedPassword = user.password;

    const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    generateToken(user._id, res);

    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};


export const checkAuth=async (req,res)=>{
    try {
      res.status(200).json(req.user);
    } catch (error) {
      res.status(500).json({ message: "internal server error" });
    }
  };