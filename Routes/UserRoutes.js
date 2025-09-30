import express from "express";
import User from "../Models/User.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.post('/Register', async (req, res) => {
    try {
    const { username, password, email } = req.body;
    const  findUser = await User.findOne({email});
    if(findUser){
        return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, email });
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
        return res.status(200).json({ message: "Login successful"});
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
