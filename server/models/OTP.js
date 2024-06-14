const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

const otpSchema = new mongoose.Schema({

    email:{
        type:String,
        required:true,
    },
    otp:{
        type: String,
        required:true, 
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires: 60*60,
    },
});

async function sendVerificationEmail(email,otp){

    try{

        const mailResponse =mailSender(email,"Verification Email from StudyNotion", emailTemplate(otp));
        console.log("Email sent Successfully");

    }catch(err){
        console.log("Error while sending OTP mail ");
        throw err;
    }
}   

otpSchema.pre("save",async function (next){
    console.log("New document saved to database");

	// Only send an email when a new document is created
	if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}
	next();
})

module.exports=mongoose.model("OTP",otpSchema);