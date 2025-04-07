import md5 from "md5";
import User from "../Models/userModel.js";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
export const signup = async (req, res) => {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || password.length < 8) {
        return res.status(400).json({ message: 'Failed' })
    }
    try {
        const hashedPassword = md5(password)
        const newUser = new User({ name, email, phone, password: hashedPassword })
        await newUser.save()
        res.status(201).json({ message: 'signup Successfully', data: newUser });
    } catch (error) {
        console.log(error);
    }
}

export const login = async (req, res) => {
    try {
      const { emailOrPhone, password } = req.body;
  
      if (!emailOrPhone || !password) {
        return res.status(400).json({ message: "Email/Phone and password are required" });
      }
  
      const user = await User.findOne({
        $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
      });
  
      if (!user) return res.status(404).json({ message: "User not found" });
  
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  
      return res.status(200).json({ message: "Login successful", data: { ...user._doc, token } });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ message: "Internal Server Error" });
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

