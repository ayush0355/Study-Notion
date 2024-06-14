const mongoose = require("mongoose");


const sectionSchema = mongoose.Schema({

    sectionName:{
        type:String,
    },
    subSection : [
        {
            type:mongoose.Schema.ObjectId,
            required:true,
            ref:"SubSection",
        }
    ],

});


module.exports = mongoose.model("Section",sectionSchema);