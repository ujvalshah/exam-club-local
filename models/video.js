var mongoose = require("mongoose");
var mongoosePaginate = require('mongoose-paginate');

var videoSchema = new mongoose.Schema({
    title: String,
    description: String,
    exam: [String],
    attempt: [String],
    subject: [String],
    topic: String,
    url:String,
    author: {
        id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
        },
        username: String,
    },
    date: {type: Date, default: Date.now }
},{
    timestamps:true,        
    }
);

videoSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Video", videoSchema);