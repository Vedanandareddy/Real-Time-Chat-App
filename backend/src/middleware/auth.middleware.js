import jwt from "jsonwebtoken"
import User from "../models/user.model.js"


export const protectroute=async(req,res,next)=>{

    try {
        const token=req.cookies.jwt // get jwt from cookies if it exists
        if(!token){
            return res.status(400).json({success:false,message:"Unauthenicated User: No token provided"})
        }

        const decode=jwt.verify(token,process.env.JWT_SECRET)  // jwt secret needed to decode 
        if(!decode){
            return res.status(400).json({success:false,message:"Unautorized User : Invalid token"})
        }

        const user=await User.findById(decode.userid).select("-password")  // deselect password from the existing fields
        if(!user){
            return res.status(400).json({success:false,message:" Unautorized User : Invalid User"})
        }
        req.user=user
        next()
        }
        catch (error) {
            console.log("Error checking authenication")
            res.status(500).json({success:false,message:"Internal server error"})
        
    }
}