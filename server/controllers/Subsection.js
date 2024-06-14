const SubSection = require("../models/SubSection")

const Section = require("../models/Section")
// const { uploadImageToCloudinary } = require("../utils/imageUploader");
const {uploadVideoToCloudinary} =require("../utils/videoUploader");
 require("dotenv").config();

exports.createSubSection = async (req,res)=>{
    try{
            const {sectionId, title, timeDuration, description} = req.body;

            const video = req.files.videoFile;

            if(!sectionId || !title || !timeDuration || !description){
                return res.status(400).json({
                    success:false,
                    message:"All fields are required",
                });
            }

            const uploadDetails = await uploadVideoToCloudinary(video, process.env.FOLDER_NAME);

            const SubSectionDetails = await SubSection.create({
                title:title,
                timeDuration:timeDuration,
                description:description,
                videoUrl:uploadDetails.secure_url,
            });

            const updatedSection = await Section.findByIdAndUpdate({_id:sectionId}, 
                                                                            {
                                                                                $push:{
                                                                                    subSection:SubSectionDetails._id,
                                                                                }
                                                                            },{new:true})
                                                                            .populate("subSection");
            // HW : log updated section here, after adding populate querry

            return res.status(200).json({
                success:true,
                message:"SubSection created successfully",
                updatedSection,
            });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Unable to create SubSection",
        });
    }
};


// HW: updateSubSection
exports.updateSubSection = async (req,res)=>{
    try{
        const{subSectionId, title, timeDuration, description, videoUrl} = req.body;

        if(!title || !timeDuration || !description || !videoUrl){
            return res.status(400).json({
                success:false,
                message:"Fill all the Details",
            });
        }

        const updatedSubSection = await SubSection.findByIdAndUpdate({_id:subSectionId},
                                                                                    {
                                                                                        title:title,
                                                                                        timeDuration:timeDuration,
                                                                                        description:description,
                                                                                        videoUrl:videoUrl,
                                                                                    }, {new:true});
        
        return res.status(200).json({
            success:true,
            message:"SubSection updated successfully",
            updatedSubSection,
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"unable to update SubSection",
        });
    }
}

// HW: deleteSubSection

exports.deleteSubSection = async (req,res) =>{
    try{

        const{subSectionId} = req.params;

        if(!subSectionId){
            return res.status(400).json({
                success:false,
                message:"Fill all details",
            });
        }

        await SubSection .findByIdAndDelete(subSectionId);

        return res.status(200).json({
            success:true,
            message:"SubSection deleted successfully",
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Something went wrong",
        });
    }
}