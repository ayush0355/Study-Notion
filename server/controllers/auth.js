const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const Profile = require("../models/Profile");
const bcrypt = require("bcrypt");
const jwt =require("jsonwebtoken");
require("dotenv").config();
const mailSender = require("../utils/mailSender");
const {passwordUpdated} = require("../mail/templates/passwordUpdate");

exports.sendOTP = async (req,res)=>{

    try{
        const {email} =req.body;

        const checkUserPresent = await User.findOne({email});
        
        if(checkUserPresent){
        return res.status(401).json({
            success:false,
            message:"User already registered",
        });
        }

        let otp =  otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:flase,
            specialChars:false,
        });

        const result = await OTP.findOne({otp:otp});

        while(result){
            otp = otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                
            });
        }

        const otpPayload = {email,otp};

        const otpBody = await OTP.create(otpPayload);

        return res.status(200).json({
            success: true,
            message : "OTP send Successfully",
            otp, 
        });

    }
    catch(err){
        console.log(err);
        return res.status(400).json({
            success:false,
            message:"Error while sending OTP",
            otp,
        });
    }


}


exports.signUp = async (req,res)=>{
    try{
        const {email,
               password,
               confirmPassword, 
               accountType, 
               firstName, 
               lastName,
               contactNumber,
               otp,
                } = req.body;
                
        
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(400).json({
                success:false,
                message:"Please fill all the datails",
            });
        }

        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"password didn't match",
            });
        }

        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.stauts(400).json({
                success:false,
                message:"User already exist",
            });
        }

        const recentOTP = await OTP.find({email}).sort({createdAt: -1}).limit(1)
        /*console.log("recent otp", recentOTP);
        console.log("*******************recent OTP************** :",recentOTP[0]);
        console.log("OTP :",otp);*/
        if(recentOTP.length === 0 ){ 
            return res.status(400).json({
                success:false,
                message:"OTP didn't match",
            });
            
        }else if(otp !== recentOTP[0].otp){
            return res.status(400).json({
                success: false,
                message: "The OTP is not valid",
              })
        }
        console.log("OTP: ",otp);
        const hashedPassword = await bcrypt.hash(password,10);
        // let approved = ""
        // approved === "Instructor" ? (approved = false) : (approved = true)
        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,
        })

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashedPassword,
            accountType,
            additionalDetails:profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName}$ ${lastName}`,
        });

        return res.status(200).json({
            success:true,
            message:"User created successfully",
            user,
        });

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:err.message,
        });
    }
}

exports.login = async (req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.staus(500).json({
                success:false,
                message:"Pleasel all the details",
            });
        }

        const user = await User.findOne({email}).populate("additionalDetails");
        
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User doesn't exist",
            });
        }
        

        if(await bcrypt.compare(password, user.password)){
            const payload = {
                email : user.email,
                id: user._id,
                accountType:user.accountType,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET,{
                expiresIn:"24h",
            });
            user.token = token;
            user.password =undefined;
        
        const options ={
            expiresIn:new Date(Date.now()+ 3*24*60*60*1000),
            httpOnly:true,
        }
        res.cookie("token",token,options).status(200).json({
            success:true,
            token,
            user,
            message:"LoggedIn successfully",
        });

    }
    else{
        return res.status(401).json({
            success:false,
            message:"Password incorrect",
        });
    }

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:err.message,
        });
    }
}

exports.changePassword = async (req,res)=>{
    try{
        const userDetails = await User.findById(req.user.id);

        const { oldPassword, newPassword} = req.body;
        
        const isPasswordMatch = await bcrypt.compare(
            oldPassword,
            userDetails.password
          );

        if(!isPasswordMatch){
            return res.status(400).json({
                success:false,
                message:"New Password and Confirm New Password didn't match",
            });
        }
        let hashedPassword = await bcrypt.hash(newPassword , 10);
        const user = await User.findOne({email});

        
            const newUser = await User.findByIdAndUpdate(req.user.id, {
                password : hashedPassword,
            },{new:true});
            
            try{
                const mailResponse = await mailSender(newUser.email,"Password for your account has been updated", 
                passwordUpdate(
                    newUser.email,
                    `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}` `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
                ));
                newUser.password = undefined;
            }catch(err){
                console.error("Error occurred while sending email:", error)
                return res.status(500).json({
                  success: false,
                  message: "Error occurred while sending email",
                  error: error.message,
                })
            }
            return res.status(200).json({
                success:true,
                message:"Password Updated Successfully",
                newUser,
            });
        
        
    }
    catch(err){
        console.log(err);
        return res.status(400).json({
            success:false,
            message:"Error in changing password",
        });
    }
}

exports.sendotp = async (req, res) => {
    try {
      const { email } = req.body
  
      // Check if user is already present
      // Find user with provided email
      const checkUserPresent = await User.findOne({ email })
      // to be used in case of signup
  
      // If user found with provided email
      if (checkUserPresent) {
        // Return 401 Unauthorized status code with error message
        return res.status(401).json({
          success: false,
          message: `User is Already Registered`,
        })
      }
  
      var otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      })
      const result = await OTP.findOne({ otp: otp })
      console.log("Result is Generate OTP Func")
      console.log("OTP", otp)
      console.log("Result", result)
      while (result) {
        otp = otpGenerator.generate(6, {
          upperCaseAlphabets: false,
        })
      }
      const otpPayload = { email, otp }
      const otpBody = await OTP.create(otpPayload)
      console.log("OTP Body", otpBody)
      res.status(200).json({
        success: true,
        message: `OTP Sent Successfully`,
        otp,
      })
    } catch (error) {
      console.log(error.message)
      return res.status(500).json({ success: false, error: error.message })
    }
  }
