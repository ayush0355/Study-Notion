const Category = require("../models/Category");


exports.createCategory = async (req,res)=>{
    try{

        const {name,description} = req.body;
        if(!name){
            return res.json({
                success:false,
                message:"All fields are required",
            });
        }

        const CategoryDetails = await Category.create({
            name:name,
            description:description,
        });

        return res.status(200).json({
            sucess:true,
            message:"Category created Successfully",
        });
    }catch(err){
        res.status(500).json({
            success:false,
            message:err.message,
        });
    }
};


exports.showAllCategories = async (req,res)=>{
    try{
        const allCategory = await Category.find();
        return res.status(200).json({
            success:true,
            message:"All Categories return successfully",
            data:allCategory,
        });
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:err.message,
        });
    }
};


exports.categoryPageDetails = async (req,res)=>{
    try{
        const {categoryId} = req.body;

        const selectedCategory = await Category.findById(categoryId)
                                                .populate({
                                                    path: "courses",
                                                    match: {status: "Published"},
                                                    populate: "ratingAndReviews",
                                                }).exec();
        if(!selectedCategory){
            return res.status(404).json({
                success:false,
                message:"Category not found",
            });
        }

        if (selectedCategory.courses.length === 0) {
            console.log("No courses found for the selected category.")
            return res.status(404).json({
              success: false,
              message: "No courses found for the selected category.",
            })
          }

        const differentCategories = await Category.find({_id: {$ne: categoryId},});

        // get top selling courses data
        const allCategories = await Category.find()
      .populate({
        path: "courses",
        match: { status: "Published" },
      })
      .exec()
    const allCourses = allCategories.flatMap((category) => category.courses)
    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);

        return res.status(200).json({
            success:true,
            data:{
                selectedCategory,
                differentCategories,
                mostSellingCourses,
            },
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:err.message,
    });
    }
}