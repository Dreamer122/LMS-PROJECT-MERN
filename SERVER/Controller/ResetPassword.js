 const User=require("../Models/User")
 const {mailSender}=require("../Utils/mailSender")
const bcrypt=require("bcrypt");
const crypto = require("crypto");

//  resetpasswordToken
exports.resetPasswordToken=async (req,res)=>{
    try{
        // get email from re body
        const email=req.body.email;
        // check user for this email
        const user=await User.findOne({email:email});

        if(!user){
            return res.status(404).json({
                message:"User not found"});
        }
        // generate token
        const token =crypto.randomUUID()

        // update user by adding token and expirationtime

        const updateDetails=await User.findOneAndUpdate({email:email},{
            token:token,
            ressetPasswordExpires:Date.now()*5*60*1000
        },{new:true})

        // create url
        const url = `http://localhost:5173/update-password/${token}`

        // send mail containing the link
        await mailSender(email,
            "password reset link",
           `password Reset Link:${url}`
        )

        // return response
        return res.json({
            message:"password reset link sent to your email",
            success:true
        })
    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"something went wrong in sending reset password link"
        })
    }
}
// resetPassowrd
exports.resetPassword=async (req,res)=>{
    try{
        // get token from url, password,cpassword
       const {password,confirmPassword,token}=req.body
        // validation
        if(password !== confirmPassword){
        return res.status(401).json({
            message:"password and confirm password do not match",
            success:false
        })
        }
        // get userdetails using token from db
        const userDetails=await User.findOne({token:token});
        // if no entry -invalid entry
        if(!userDetails){
            return res.status(401).json({
                message:"invalid token",
                success:false
                })
                }
        // token time check
        if(Date.now()>userDetails.ressetPasswordExpires){
            return res.status(401).json({
                message:"token expired, please regenerate your token",
                success:false
            })
        }
        // hashsing password
        const hashedPassword=await bcrypt.hash(password,10)

        // update password
        await User.findOneAndUpdate({token:token},{password:hashedPassword},{new:true});
        // return response
        return res.status(200).json({
            message:"password reset successfully",
            success:true

        })
    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"something went wrong in sending reset password link"
        })
    }
}