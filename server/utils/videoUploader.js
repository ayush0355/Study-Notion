const cloudinary = require("cloudinary").v2;

exports.uploadVideoToCloudinary = async (file, folder, height, quality)=>{
    const options = {folder};
    if(height){
        options.height=height;
    }
    if(quality){
        options.quality = quality;
    }
    options.resourse_type = "video";

    return await cloudinary.uploader.upload(file.tempFilePath, options);
}