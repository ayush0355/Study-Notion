const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

exports.auth =async (req,res,next)=>{
    try{
        console.log("middleware is start");
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ","");
        
        if(!token){
            return res.status(401).json({
                succeess:false,
                message:"Token is missing",
            });
        }
        
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            req.user = decode;

        }
        catch(err){
            return res.status(401).json({
                success:false,
                message:"Token is invalid",
            });
        }
        console.log("middleware is end");

        next();
    }
    catch(err){
        return res.status(401).json({
            success:false,
            message:"Something went wrong while validating the token",
        });
    }
}


exports.isStudent = async (req,res,next)=>{
    try{
        if(req.user.accountType !== "Student"){
            return res.status(402).json({
                success:false,
                message:"This is a protected route for Students",
            });
        }
        next(); 
    }
    catch(err){
        res.status(500).json({
            sucess:false,
            message:"User role can't be verified",
        })
    }
}

exports.isInstructor = async (req,res,next)=>{
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(402).json({
                success:false,
                message:"This is a protected route for Instructor",
            });
        }
        next(); 
    }
    catch(err){
        res.status(500).json({
            sucess:false,
            message:"User role can't be verified",
        })
    }
}

exports.isAdmin = async (req,res,next)=>{
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(402).json({
                success:false,
                message:"This is a protected route for Admin",
            });
        }
        next(); 
    }
    catch(err){
        res.status(500).json({
            sucess:false,
            message:"User role can't be verified",
        })
    }
}