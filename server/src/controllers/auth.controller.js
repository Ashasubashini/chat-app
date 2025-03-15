import express from "express";
import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => { 
    const {fullname, email, password} = req.body;
    try {

        if (!fullname || !email || !password) {
            return res.status(400).json({message: "All fields are required"});
        }
        //hash password
        if (password.length < 6) {
            return res.status(400).json({message: "Password must be at least 8 characters long"});
        }
        const user = await User.findOne({email})
        if (user) 
            return res.status(400).json({message: "User already exists"});
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullname,
            email,
            password: hashedPassword
        });

        if (newUser) {
            //generate the token
            generateToken(newUser._id, res);
            await newUser.save();

            return res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                profilePic: newUser.profilePic,
            }
            );

        }else {
            return res.status(400).json({message: "User not created"});
        }
        
    } catch (error) {
       console.log("Error in signup: ", error.message); 
       res.status(500).json({message: "Something went wrong"});
    }
}

export const login = async (req, res) => { 
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});

        if (!user) {
            return res.status(404).json({message: "Invalid credentials"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({message: "Invalid credentials"});
        }

        const token = generateToken(user._id, res); 

        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            profilePic: user.profilePic,
            token: token, 
        });
        
    } catch (error) {
        console.log("Error in login: ", error.message); 
        res.status(500).json({message: "internal server error"});
    }
}


export const logout = (req, res) => { 
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
        console.log("Error in logout: ", error.message); 
        res.status(500).json({message: "internal server error"});
    }
}

export const updateProfile = async (req, res) => {
    try {
        const {profilePic} = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({message: "Profile picture is required"});
        }       
        const uploadedResponse = await cloudinary.uploader.upload(profilePic); 
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadedResponse.secure_url}, {new: true});

        res.status(200).json(updatedUser);

    } catch (error) {
        console.log("Error in updateProfile: ", error.message);
        res.status(500).json({message: "internal server error"});
    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth: ", error.message);
        res.status(500).json({message: "internal server error"});
    }
}