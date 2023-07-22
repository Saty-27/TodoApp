import { NewUser } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
//import { sendCookie } from "../utils/feature.js";
import { sendCookie } from "../utils/feature.js";
import ErrorHandler from "../middlewares/error.js";

export const getAllUsers = async (req,res)=>{
    
}

export const register=async (req,res)=>{
   try{
    const {name,email,password}=req.body;

   let user = await NewUser.findOne({email});
   if(user) return next(new ErrorHandler("User Already Exist",404));
  
    const hashedPassword = await bcrypt.hash(password,10);
  user = await NewUser.create({name,email,password:hashedPassword});
   
sendCookie(user,res,"Registered Successfully",201)
   }catch(error){
    next(error)
   }
  

};

export const login=async (req,res,next)=>{
    try{const {email,password}=req.body;
    const user = await NewUser.findOne({email}).select("+password");
    if(!user) return next(new ErrorHandler("Invalid Email or Password",404));
    
    const isMatch = await bcrypt.compare(password, user.password);

    
    if(!isMatch) return next(new ErrorHandler("Invalid Email or Password",404));;

    sendCookie(user,res,`Welcome back, ${user.name}`,200);
}
catch(error){
    next(error)
}
}
export const getMyProfile = (req,res)=>{
    
res.status(200).json({
    success:true,
    user:req.user,
 });   
};

export const logout =(req,res)=>{
    res.status(200).cookie("token","",{
        expires:new Date(Date.now()),
        sameSite:process.env.NODE_ENV === "Development"?"lax" :"none",
        secure:process.env.NODE_ENV === "Development"? false:true,})
    .json({
        success:true,
        user:req.user,
     });   
    };

