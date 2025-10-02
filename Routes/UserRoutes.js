import express from "express";
import User from "../Models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "5m" });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.REFRESH_SECRET, { expiresIn: "7d" });
};

router.post('/Register', async (req, res) => {
    try {
    const { username, password, email, role } = req.body;
    const  findUser = await User.findOne({email});
    if(findUser){
        return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, email, role });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully"});
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.post('/Login', async (req, res) => {
    try{
        const { email, password } = req.body;
        const  findUser = await User.findOne({email});
        if(!findUser){
            return res.status(400).json({ message: "User does not exist" });
        }
        const matchedUser = await bcrypt.compare(password, findUser.password);
        if(!matchedUser){
            return res.status(400).json({ message: "Invalid credentials" });
        }
        // Create JWT
        const token = generateAccessToken(findUser);
        const refreshToken = generateRefreshToken(findUser);
        findUser.refreshToken = refreshToken;
        await findUser.save();

    res.status(200).json({ token , refreshToken});
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//Refresh Token
router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: "Refresh token required" });

  try {
    const user = await User.findOne({ refreshToken });
    if (!user) return res.status(403).json({ message: "Invalid refresh token" });

    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, payload) => {
      if (err) return res.status(403).json({ message: "Invalid refresh token" });

      const accessToken = generateAccessToken(user);
      res.json({ accessToken });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Logout
router.post("/logout", async (req, res) => {
  const refreshToken = req.body;
  try {
    const user = await User.findOne({ refreshToken });
    if (!user) return res.status(403).json({ message: "Invalid refresh token" });

    user.refreshToken = null; // clear stored refresh token
    await user.save();

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
