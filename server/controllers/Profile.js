const Profile = require("../models/Profile");
const CourseProgress = require("../models/CourseProgress")

const Course = require("../models/Course")
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader")
const mongoose = require("mongoose")

exports.updateProfile = async (req,res) =>{
    try{
        const {
            firstName="",
            lastName="",
            dateOfBirth = "",
            about = "",
            contactNumber = "",
            gender ="",
          } = req.body
          
          const id = req.user.id

        const userDetails = await User.findById(id);
        const profileDetails = await Profile.findById(userDetails.additionalDetails);

        // const user = await User.findByIdAndUpdate(id, {
        //     firstName,
        //     lastName,
        //   })
        //   await user.save()
        userDetails.firstName=firstName;
        userDetails.lastName=lastName;
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;

        await profileDetails.save();
        await userDetails.save();

        const updatedUserDetails = await User.findById(id)
        .populate("additionalDetails")
        .exec()
        // const updatedProfileDetails = updatedUserDetails;
        return res.status(200).json({
            success:true,
            message:"Profile details updated successfully",
            updatedUserDetails,
        });


    }catch(err){
        console.log(err);
        return res.status(400).json({
            success:false,
            error:err.message,
        });
    }
}


exports.deleteAccount = async (req,res)=>{
    try{

        const id = req.user.id;
        const userDetails = await User.findById(id);

        if(!userDetails){
            return res.status(404).json({
                sucess:false,
                message:"User not found",
            });
        }

        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
        //HW: unenroll user from all enrolled courses

        await User.findByIdAndDelete({_id:id});

        return res.status(200).json({
            success:true,
            message:"User deleted successfully",
        });


    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            error:err.message,
        });
    }
}


exports.getAllUserDetails = async (req,res)=>{
    try{

        const id = req.user.id;
        console.log(Profile);
        const userDetails = await User.findById(id).populate("additionalDetails").exec();

        return res.status(200).json({
            success:true,
            message:"User data fetched succcessfully",
            userDetails:userDetails,
        });
    }catch(err){
        return res.status(500).json({
            success:false,
            mssage:err.message,
        });
    }
}

exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }