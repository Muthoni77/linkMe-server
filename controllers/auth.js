import User from "../models/user.js";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { config } from "dotenv";
import { sendWelcomeEmail } from "../utils/sendEmail.js";

config();

export const register = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "user already exists", data: null });
    }
    const hash_pass = await bcrypt.hash(password, 10);
    const new_user = await User.create({
      username,
      email,
      phone,
      password: hash_pass,
    });
    if (!new_user) {
      return res
        .status(400)
        .json({ success: false, message: "user not created", data: null });
    }

    //Generate access token
    const token = Jwt.sign({ data: new_user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    //Generate refresh token
    const refreshToken=Jwt.sign({data:new_user._id},process.env.REFRESH_TOKEN_SECRET,{expiresIn:"30d"});
    
    //send user welcome email
    const isEmailSent = await sendWelcomeEmail(email);
    if (!isEmailSent) {
      console.log("Failed to send welcome email");
    }
    return res.status(200).json({
      success: true,
      message: "User created",
      data: { user: new_user, token,refreshToken },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message, data: null });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validate
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "please provide email and password",
        data: null,
      });
    }
    //find if user exists
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist, please insert the correct email",
        data: null,
      });
    }

    const password_match = await bcrypt.compare(password, user.password);
    if (!password_match) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
        data: null,
      });
    }
    //Generate access token
    const token = Jwt.sign({ data:user._id }, process.env.JWT_SECRET, {
      expiresIn: "30s",
    });

    //Generate refresh token
    const refreshToken = Jwt.sign(
      { data: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "30d" }
    );
    
    return res.status(200).json({ user,token,refreshToken });
  } catch (error) {
    console.log(error.message);
  }
};
