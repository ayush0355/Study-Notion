const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");


exports.createRating = async (req,res)=>{
    try{
        const userId = req.user.id;
        const {courseId, rating, review} = req.body;
        const courseDetails = await Course.findOne(
                                                    {_id:courseId,
                                                    studentsEnrolled: {$eleMatch: {$eq: userId}},
                                                    }
                                                );
        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:"User is not registered in the course",
            });
        }

        const alreadyReviewed = await RatingAndReview.findOne({
                                                        user:userId,
                                                        course:courseId,
                                                    });
        if(alreadyReviewed){
            return res.status(400).json({
                success:false,
                message:"Course is already reviewed by the user",
            });
        }

        const ratingReview = await RatingAndReview.create({
            rating,review,
            course:courseId,
            user:userId,
        }); 

        const updatedCourseDetails = await Course.findByIdAndUpdate({_id:courseId},{
            $push: {
                ratingAndReviews: ratingReview._id,
            }
        },{new:true});

        console.log(updatedCourseDetails);

        return res.status(200).json({
            success:true,
            message:"Rating and created successfully",
            ratingReview,
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:err.message,
        });
    }
}



exports.getAverageRating = async (req,res)=>{
    try{
        const {courseId} = req.body;
        
        const result = await RatingAndReview.aggregate([
            {
                $match:{
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group:{
                    _id:null,
                    averageRating:{$avg: "$rating"},
                }
            }
        ]);

        if(result.length>0){
            res.status(200).json({
                success:true,
                averageRating : result[0].averageRating,
            });
        }

        return res.status(200).json({
            success:true,
            message:"No ratings",
            averageRating:0,
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:err.message,
        });
    }
}


exports.getAllRatings = async (req,res)=>{
    try{

        const allReviews = await RatingAndReview.find({}).sort({rating:"desc"}).populate(
                                                                                        {
                                                                                            path:"user",
                                                                                            select:"firstName lastName email image",
                                                                                        }
                                                                                        )
                                                                                .populate(
                                                                                        {
                                                                                            path:"course",
                                                                                            select:"courseName",
                                                                                        }
                                                                                ).exec();

        return res.status(200).json({
            success:true,
            message:"All reviews successfully",
            allReviews,
        });
        
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:err.message,
        });
    }
}