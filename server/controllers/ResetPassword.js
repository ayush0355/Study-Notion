const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models/User");
//const User2 = require("../models/User");

exports.resetPasswordToken = async (req,res)=>{
    try{
        const email = req.body.email;

        if(!email){
        return res.staus(400).json({
            success:false,
            message:"Enter the email",
        });
         }
        const user = await User.findOne({email});

        if(!user){
            return res.status(401).json({
            success:false,
            message:"User doesn't exist",
        });
        }

        const token = crypto.randomBytes(20).toString("hex");

        const updatedDetails = await User.findOneAndUpdate({email:email},
                                                    {
                                                        resetToken:token,
                                                        resetPasswordExpires: Date.now()+ 5*60*1000,
                                                    },{new:true});
        console.log("updatedDetails : ",updatedDetails)

        const url = `http://localhost:3000/update-password/${token}`;

        await mailSender(email,"Password reset link", `Password reset Link :${url}`);

        return res.json({
            success:true,
            message:"Email sent successfull, check email to change password",
            url,
        });


    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:err.message,
        });
    }

}


exports.resetPassword = async (req,res)=>{
    try{
        const {password, confirmPassword, token} = req.body;

        if(password !== confirmPassword){
            return res.json({
                success:false,
                message:"Password not matching",
            });
        }

        const userDetails = await User.findOne({resetToken : token});
        

        if(!userDetails){
            return res.json({
                success:false,
                message:"Token invalid",
            });
        }
        // console.log("userDetails.resetPasswordExpires :",userDetails.resetPasswordExpires);
        // console.log("current date",Date.now())
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.json({
                success:false,
                message:"Token is expired",
            });
        }

        const hashedPassword = await bcrypt.hash(password,10);

        await User.findOneAndUpdate({resetToken:token},{
            password:hashedPassword},
            {new:true});
        
            return res.status(200).json({
                success:true,
                message:"Password reset Successfull",
            });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while sending reset password ",
        });
    }
}