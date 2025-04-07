
import User from "../Models/userModel.js";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
dotenv.config()


export const signup = async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password || password.length < 8) {
    return res.status(400).json({ message: "All fields are required and password must be at least 8 characters" });
  }

  try {
    // Check if email or phone already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(409).json({ message: "Email or phone number already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
      console.log(hashedPassword);
      
    const newUser = new User({ name, email, phone, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Signup successful", data: newUser });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
    try {
      const { emailOrPhone, password } = req.body;
  
      if (!emailOrPhone || !password) {
        return res.status(400).json({ message: "Email/Phone and password are required" });
      }
  
      const user = await User.findOne({
        $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
      });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      const token = jwt.sign({ id: user._id }, process.env.USER_SECRET_TOKEN, { expiresIn: "7d" });
  
      return res.status(200).json({
        message: "Login successful",
        data: {
          ...user._doc,
          token,
        },
      });
    } catch (err) {
      console.error("Login error:", err.message, err.stack); // 👈 Better logging
      return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
  };
  
  


// controllers/userController.js
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("_id name");
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

