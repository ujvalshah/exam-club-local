var mongoose = require("mongoose");
var User = require("./user");

var downloadSchema = new mongoose.Schema({
    title: String,
    description: String,
    exam: [String],
    attempt: [String],
    subject: [String],
    topic: String,
    file: [{url:String, public_id:String}],
    author: {
        id : {
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        ref: "User"
        },
        username: String,
    },
    date: {type: Date, default: Date.now}
});



module.exports = mongoose.model("Download", downloadSchema);