import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js"
import {io,getReceiverSocketId} from "../lib/socket.js"

export const getUsersForSideBar=async(req,res)=>{
    const  currentUserId=req.user._id;
    try {
        const filteredUsers=await User.find({_id:{$ne:currentUserId}}).select("-password") // all users except the current user and exclude the password

        res.status(200).json(filteredUsers)

    } catch (error) {
        console.log("Error while getting users for the sidebar",error)
        res.status(500).json({message:"Internal Server Error"})
    }
}


export const getMessages=async (req,res)=>{
    try {
        const{id:UserToChatId} =req.params;
        const currentUserId=req.user._id

        const messages=await Message.find({
            $or:[
                {senderId:currentUserId,receirverId: UserToChatId},
                {senderId: UserToChatId,receirverId: currentUserId}
            ]
        })

        res.status(200).json(messages)

    } catch (error) {
        console.log("Error while getting messages for the user",error)
        res.status(500).json({message:"Internal Server Error"})
    }
}


export const sendMessage=async (req,res)=>{
    try {
        const {text,image}=req.body;
        const {id:receirverId}=req.params;  // renaming from id to receirverId for convenience
        const senderId=req.user._id;

        let imageUrl;  // if no image is uploaded it stays undefine else url is set to it 
        if(image){
            const uploadResponse=await cloudinary.uploader.upload(image)
            imageUrl=uploadResponse.secure_url
        }

        const message=new Message({
            senderId,
            receirverId,
            text,
            image:imageUrl
        })
        const newMessage=await message.save()
        const recieverSocket=getReceiverSocketId(receirverId)

        if(recieverSocket){  // checks if receiver is online else no need for sending event
            io.to(recieverSocket).emit("newMessage",message)  
        }

        res.status(201).json(message)


    } catch (error) {
        console.log("Error while sending message",error)
        res.status(500).json({message:"Internal Server Error"})
    }
}
