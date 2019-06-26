var mongoose = require("mongoose");


var TeacherSchema = new mongoose.Schema({
    username : { type:String, unique: true, required: "Name cannot be blank!"},
    password: {type:String, required: "Password cannot be blank!"},
    firstName:{type:String, required: true},
    lastName:{type:String, required: true},
    image: String,
    description: String,
    location: String,
    address: String,
    city: {type:String, required: true},
    state: {type:String, required: true},
    pincode: {type:String, required: true},
    mobile: { type: Number, min: 10, max: 10, required: true },
    email: {type:String, unique: true, required: true},
    subject: [String],
    downloads: String,
    documents: String,  
    videos: String,
    accountCreated :{ type: Date, default: Date.now },
    resetPasswordToken: String,
    resetPasswordExpires:Date,
    isAdmin: {type: Boolean, default: false},
    isFaculty: {type: Boolean, default: false},
    isStudent: {type: Boolean, default: false},
});

module.exports = mongoose.model("Teacher", TeacherSchema);