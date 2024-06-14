const Course = require("../models/Course");
const Category = require("../models/Category");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");
const CourseProgress = require("../models/CourseProgress")
const { convertSecondsToDuration } = require("../utils/secToDuration")

exports.createCourse = async (req,res)=>{
    try{
        const userId = req.user.id
        let {
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            tag:_tag,
            category,
            status,
            instructions:_instructions,
        } = req.body;
        // console.log("courseName :",courseName)
        // console.log("courseDescription :",courseDescription)
        // console.log("whatYouWillLearn :",whatYouWillLearn)
        // console.log("price :",price)
        // console.log("tag :",tag.length)
        //console.log("category :",category)

        //const {courseName, courseDescription, whatYouWillLearn, price,category,tags:_tag,status,instructions:_instructions} = req.body;
        const thumbnail = req.files.thumbnailImage;
        const tag = JSON.parse(_tag)
        console.log("Tag : ",tag);
        const instructions = JSON.parse(_instructions)
        console.log("instructions",_instructions);
        console.log("Thumbnail : ",thumbnail);
        if(!courseName || 
            !courseDescription || 
            !whatYouWillLearn || 
            !price || 
            !category ||
            !tag.length ||
            !thumbnail ||
            !instructions.length){
            return res.json({
                success:false,
                message:"Please fill all the details",
            });
        }
        if (!status || status === undefined) {
            status = "Draft"
        }

        
        const instructorDetails = await User.findById(userId, {
            accountType: "Instructor",
        });

        if(!instructorDetails){
            return res.status(404).json({
                sucess:false,
                message:"Instructor Details not found",
            });
        }
       

        const categoryDetails = await Category.findById(category);

        if(!categoryDetails){
            return res.status(404).json({
                sucess:false,
                message:"Category Details not found",
            });
        }

        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);


        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatYouWillLearn:whatYouWillLearn,
            price,
            tag,
            Category:categoryDetails._id,
            thumbnail:thumbnailImage.secure_url,
            status: status,
            instructions,
        });

        await User.findByIdAndUpdate(
            {_id:instructorDetails._id},
            {
                $push:{
                    courses: newCourse._id,
                }
            },
            {new:true},
        );

        const categoryDetails2 =  await Category.findByIdAndUpdate(
            {_id:categoryDetails._id},
            {
                $push:{
                    course:newCourse._id,
                },
            },
            {new:true},
        );

        return res.status(200).json({
            success:true,
            message:"Course created successfully",
            data: newCourse,
        });

    }catch(err){

        console.error(err);
        return res.status(500).json({
            success:false,
            message:"Failed to create Course",
            error:err.message,
        });

    }
}

exports.editCourse = async (req, res) => {
    try {
      const { courseId } = req.body
      const updates = req.body
      const course = await Course.findById(courseId)
  
      if (!course) {
        return res.status(404).json({ error: "Course not found" })
      }
  
      // If Thumbnail Image is found, update it
      if (req.files) {
        console.log("thumbnail update")
        const thumbnail = req.files.thumbnailImage
        const thumbnailImage = await uploadImageToCloudinary(
          thumbnail,
          process.env.FOLDER_NAME
        )
        course.thumbnail = thumbnailImage.secure_url
      }
  
      // Update only the fields that are present in the request body
      for (const key in updates) {
        if (updates.hasOwnProperty(key)) {
          if (key === "tag" || key === "instructions") {
            course[key] = JSON.parse(updates[key])
          } else {
            course[key] = updates[key]
          }
        }
      }
  
      await Course.save()
  
      const updatedCourse = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec()
  
      res.json({
        success: true,
        message: "Course updated successfully",
        data: updatedCourse,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }

exports.showAllCourses = async (req,res) =>{
    try{
        const allCourses = await Course.find({status: "Published"},{courseName:true,
                                                    price:true,
                                                    thumbnail:true,
                                                    instructor:true,
                                                    ratingAndReviews:true,
                                                    studentsEnrolled:true,
                                                },).populate("instructor").exc();
        return res.status(200).json({
            success:true,
            message:"Data of all courses fetch successfuly",
            data:allCourses,
        });

    }catch(err){   
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Cant't fetch course data",
            err:err.message,
        });
    }
}



exports.getCourseDetails = async (req,res)=>{
    try{

        const {courseId} = req.body;
        if(!courseId){
            return res.status(400).json({
                success:false,
                message:"Fill all the details",
            });
        }
        
        const courseDetails = await Course.findOne(
                                            {_id:courseId})
                                            .populate(
                                                {
                                                    path:"instructor",
                                                    populate:{
                                                        path:"additionalDetails",
                                                    },
                                                }
                                            )
                                            .populate("category")
                                            .populate("ratingAndReviews")
                                            .populate(
                                                {
                                                    path:"courseContent",
                                                    populate:{
                                                        path:"subSection",
                                                    },
                                                })
                                                .exec();

        if(!courseDetails){
            return res.status(400).json({
                success:false,
                message:`Couldn't find the course with ${courseId}`,
            });
        }

        let totalDurationInSeconds = 0
        courseDetails.courseContent.forEach((content) => {
        content.subSection.forEach((subSection) => {
            const timeDurationInSeconds = parseInt(subSection.timeDuration)
            totalDurationInSeconds += timeDurationInSeconds
        })
        })

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

        return res.status(200).json({
                success:true,
                message:"Course details fetched successfully",
                courseDetails,
        })                ;             
    }catch(err){
        return res.status(500).json({
            success:false,
            message:err.message,
        });
    }
}

exports.getFullCourseDetails = async (req, res) => {
    try {
      const { courseId } = req.body
      const userId = req.user.id
      const courseDetails = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec()
  
      let courseProgressCount = await CourseProgress.findOne({
        courseID: courseId,
        userId: userId,
      })
  
      console.log("courseProgressCount : ", courseProgressCount)
  
      if (!courseDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find course with id: ${courseId}`,
        })
      }
  
      // if (courseDetails.status === "Draft") {
      //   return res.status(403).json({
      //     success: false,
      //     message: `Accessing a draft course is forbidden`,
      //   });
      // }
  
      let totalDurationInSeconds = 0
      courseDetails.courseContent.forEach((content) => {
        content.subSection.forEach((subSection) => {
          const timeDurationInSeconds = parseInt(subSection.timeDuration)
          totalDurationInSeconds += timeDurationInSeconds
        })
      })
  
      const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
  
      return res.status(200).json({
        success: true,
        data: {
          courseDetails,
          totalDuration,
          completedVideos: courseProgressCount?.completedVideos
            ? courseProgressCount?.completedVideos
            : [],
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
  
  // Get a list of Course for a given Instructor
  exports.getInstructorCourses = async (req, res) => {
    try {
      // Get the instructor ID from the authenticated user or request body
      const instructorId = req.user.id
  
      // Find all courses belonging to the instructor
      const instructorCourses = await Course.find({
        instructor: instructorId,
      }).sort({ createdAt: -1 })
  
      // Return the instructor's courses
      res.status(200).json({
        success: true,
        data: instructorCourses,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Failed to retrieve instructor courses",
        error: error.message,
      })
    }
  }
  // Delete the Course
  exports.deleteCourse = async (req, res) => {
    try {
      const { courseId } = req.body
  
      // Find the course
      const course = await Course.findById(courseId)
      if (!course) {
        return res.status(404).json({ message: "Course not found" })
      }
  
      // Unenroll students from the course
      const studentsEnrolled = course.studentsEnroled
      for (const studentId of studentsEnrolled) {
        await User.findByIdAndUpdate(studentId, {
          $pull: { courses: courseId },
        })
      }
  
      // Delete sections and sub-sections
      const courseSections = course.courseContent
      for (const sectionId of courseSections) {
        // Delete sub-sections of the section
        const section = await Section.findById(sectionId)
        if (section) {
          const subSections = section.subSection
          for (const subSectionId of subSections) {
            await SubSection.findByIdAndDelete(subSectionId)
          }
        }
  
        // Delete the section
        await Section.findByIdAndDelete(sectionId)
      }
  
      // Delete the course
      await Course.findByIdAndDelete(courseId)
  
      return res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      })
    }
  }