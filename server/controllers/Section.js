const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");

exports.createSection = async (req,res)=>{
    try{

        const {sectionName,courseId} = req.body;
        if(!sectionName || !courseId){
            return res.json({
                success:false,
                message:"all fields are required",
            });
        }

        const newSection = await Section.create({sectionName});

        const updatedCourse = await Course.findByIdAndUpdate(courseId,
                                                            {
                                                                $push:{
                                                                    courseContent:newSection._id,
                                                                }
                                                            },
                                                            {new:true},);
        
        return res.status(200).json({
            success:true,
            message:"Section Created Successfully",
            updatedCourse,
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Unable to create section",
            err:err.message,
        });
    }
};



exports.updateSection = async (req,res)=>{
    try{

        const {sectionName, sectionId} = req.body;

        if(!sectionName || !sectionId){
            return res.status(500).json({
                success:false,
                message:"Missing properties",
            });
        }

        const section = await Section.findByIdAndUpdate({_id:sectionId},{sectionName},{new:true});

        return res.status(200).json({
            success:true,
            message:"Section updated successfully",
            section,
        });



    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Unable to update Section",
        });
    }
}



// exports.deleteSection = async (req,res)=>{
//     try{

//         const {sectionId,courseId}  =req.body;

//         if(!sectionId || !courseId){
//             return res.json({
//                 success:false,
//                 message:"Fill all the details",
//             });
//         }

//         await Section.findByIdAndDelete(sectionId);

//         return res.status(200).json({
//             success:true,
//             message:"Section deleted successfully",
//         });
//     }catch(err){
//         console.log(err);
//         return res.status(500).json({
//             success:false,
//             message:"Unable to update Section",
//         });
//     }
// }
exports.deleteSection = async (req, res) => {
    try {
      const { sectionId, courseId } = req.body
      await Course.findByIdAndUpdate(courseId, {
        $pull: {
          courseContent: sectionId,
        },
      })
      const section = await Section.findById(sectionId)
      console.log(sectionId, courseId)
      if (!section) {
        return res.status(404).json({
          success: false,
          message: "Section not found",
        })
      }
      // Delete the associated subsections
      await SubSection.deleteMany({ _id: { $in: section.subSection } })
  
      await Section.findByIdAndDelete(sectionId)
  
      // find the updated course and return it
      const course = await Course.findById(courseId)
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec()
  
      res.status(200).json({
        success: true,
        message: "Section deleted",
        data: course,
      })
    } catch (error) {
      console.error("Error deleting section:", error)
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }