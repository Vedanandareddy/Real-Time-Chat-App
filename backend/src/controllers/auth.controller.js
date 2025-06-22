import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import {generateTokenAndSetCookie} from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.js"

export const signup=async (req,res)=>{
    const {email,fullname,password}=req.body;
    try {
        if(!fullname|| !password || !email){
            return res.status(400).json({message:"All fields are required"
            })
        }
        if(password.length<6){
            return res.status(400).json({message:"password should contain atleast six characters"
            })
        }
        //hash password 
        const user=await User.findOne({email})
        if(user){
            return res.status(400).json({message:"Email already exists "})
        }
        const hashedpassword=await bcryptjs.hash(password,10)

        const newUser= new User({
            email,
            fullname,
            password:hashedpassword
        })

        if(newUser){
            generateTokenAndSetCookie(newUser._id,res)
            await newUser.save()

            return res.status(201).json({
                _id:newUser._id,
                fullname:newUser.fullname,
                email:newUser.email,
                profilepic:newUser.profilepic
            })
        }
        else{
            res.status(400).json({message:"Invalid User Data"})
        }

    } catch (error) {
        console.log("Error in signup controller",error.message)
        res.status(500).json({message:"Internal Server error"})
    }

}


export const login=async(req,res)=>{
    const {email,password}=req.body
    //  console.log(email,password)
    try {
        if(!email|| !password){
            return res.status(400).json({success:false,message:"All fields are required"})
        }
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({success:false,message:"No User found for this email"})
        }
        const isValidPassword = await bcryptjs.compare(password, user.password)
        if(!isValidPassword){
            // console.log("Invalid Credentials")
            return res.status(400).json({success:false,message:"Invalid Credentials"})
        }

        generateTokenAndSetCookie(user._id,res)
            res.status(201).json({
                _id:user._id,
                fullname:user.fullname,
                email:user.email,
                profilepic:user.profilepic
            })

    } catch (error) {
        console.log("Error while logging in",error.message)
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
    
}


export const logout=(req,res)=>{
    try {
        res.clearCookie("jwt");
        // console.log("User Logged out")
        res.status(200).json({success:true,message:"Logged out"})
    } catch (error) {
        console.log("Error while logging out",error.message)
        res.status(500).json({success:false,message:"Internal Server Error"})
    }

    
}

export const updateprofile= async(req,res)=>{
    const {profilepic}=req.body;
    try {
        const userid=req.user._id;

        if(!profilepic){
            return res.status(400).json({success:false,message:"Upload a profile pic to set "}) // uploads the pic to their database and provides a secure link for us to access 
        }
        const uploadResponse=await cloudinary.uploader.upload(profilepic)
        const updatedUser=await User.findByIdAndUpdate(userid,{profilepic:uploadResponse.secure_url},{new:true}).select("-password")
        // by default the old user is sent as a response to get updated one we have to set new:true option
        return res.status(200).json({success:true,message:"Updated Profile pic succesfully",updatedUser})
    } catch (error) {
        console.log("Error updating profile pic",error)
        return res.status(500).json({success:false,message:`error updating the profile pic ${error.message} `}) 
    }
}




export const checkauth=(req,res)=>{
    try {
        res.status(200).json({user:req.user})
    } catch (error) {
        console.log("Error checking authenication")
        res.status(500).json({message:"Internal Server Error"})
    }
}