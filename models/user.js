var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");


var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstName:{type:String, required: true},
    lastName:{type:String, required: true},
    image: String,
    description: String,
    location: String,
    address: String,
    city: {type:String},
    state: {type:String},
    pincode: {type:String},
    mobile: { type: String},
    email: {type:String, unique: true, required: true},
    subject: [String],
    videos:[
        { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
        }],    
    downloads:[
        { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Download"
        }],    
    videoBookmarks:[
        { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
        }],    
    downloadBookmarks:[
        { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Download"
        }],
    accountCreated :{ type: Date, default: Date.now },
    resetPasswordToken: String,
    resetPasswordExpires:Date,
    isAdmin: {type: Boolean, default: false},
    isFaculty: {type: Boolean, default: false},
    isStudent: {type: Boolean, default: false},
});

UserSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model("User", UserSchema);