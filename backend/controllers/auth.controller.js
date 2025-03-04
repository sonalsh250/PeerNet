//singnup, login and logout

import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";

export const signup = async(req, res) => {
    try {
        const {name, username, email, password} = req.body;
        if(!name || !username || !email || !password)
        {
            return res.status(400).json({message: "All fields are required"});}
        const existingEmail = await User.findOne({email});
        if(existingEmail)
        {
            return res.status(400).json({message: "Email already exists"});
        }
        const existingUserName = await User.findOne({username});
        if(existingUserName)
        {
            return res.status(400).json({message: "Username already exists"});
        }
        if(password.length < 6)
        {
            return res.status(400).json({message: "Password must be at least 6 characters"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            username
        });
        await user.save(); //to save the user to the database

        const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET,{expiresIn:"3d"});

        res.cookie("jwt-peernet", token, {
            httpOnly: true, //prevents XSS attack
            secure: process.env.NODE_ENV === "production", //prevents man-in-the-middle attacks
            sameSite: "strict", //prevents CSRF attacks
            maxAge: 3*24*60*60*1000
        });
        res.status(201).json({message: "User created successfully"});

        const profileUrl = process.env.CLIENT_URL + "/profile/" + user.username;

        //send welcome email
        try {
            await sendWelcomeEmail(user.email, user.name, profileUrl);
        } catch (emailError) {
            console.log("Error sending welcome email", emailError);
        }

    } catch (error) {
        console.log("Error in signup: " , error.message);
        res.status(500).json({message: "Internal server error"});
    }
}
export const login = async(req, res) => {
    try {
        const {username, password} = req.body;

        //check if user exists
        const user = await User.findOne({username});console.log(user.username);
        if(!user)
        {
            return res.status(400).json({message: "Invalid credentials / User not found"});
        }

        //check password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch)
        {
            return res.status(400).json({message: "Invalid credentials / Password incorrect"});
        }

        //create and send token for cookie (token will expire in 3 days)
        const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET,{expiresIn:"3d"});
        await res.cookie("jwt-peernet", token, {
            httpOnly: true, //prevents XSS attack
            secure: process.env.NODE_ENV === "production", //prevents man-in-the-middle attacks
            sameSite: "strict", //prevents CSRF attacks
            maxAge: 3*24*60*60*1000
        });
        res.json({message: "User logged in successfully"});
    } catch (error) {
        console.error("Error in login controller", error);
        res.status(500).json({message: "Internal server error"});
    }
};
export const logout = (req, res) => {
    res.clearCookie("jwt-peernet");
    res.json({message: "User logged out successfully"});
}

export const getCurrentUser = async(req, res) => {
    try {
        res.json(user);
    } catch (error) {
        console.error("Error in getCurrentUser controller", error);
        res.status(500).json({message: "Internal server error"});
    }
}