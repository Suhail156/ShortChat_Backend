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
    const { emailOrPhone, password } = req.body
    console.log(req.body)

    const hashedPassword = md5(password)

    try {
        const user = await User.findOne({
            $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
            password: hashedPassword
        })

        if (!user) return res.status(400).json({ message: 'User not found' })

        const token = jwt.sign(
            { email: user.email, id: user._id }, 
            process.env.USER_SECRET_TOKEN,       
            { expiresIn: '7d' }                  
        )

        // ✅ Send token in response
        res.status(200).json({
            message: 'Login successful',
            token,
            data: user
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' })
    }
}


// controllers/userController.js
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("_id name");
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

