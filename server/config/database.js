const mongoose = require("mongoose"); 
require('dotenv').config();

exports.connect = ()=>{
    mongoose.connect(process.env.DB_URL,)
    .then(()=>console.log("DB Connected Successfully"))
    .catch((err)=>{
        console.log("DB connection failed");
        console.log(err);
        process.exit(1);
    });
};