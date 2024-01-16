const mongoose = require("mongoose")


mongoose.connect("mongodb://localhost:27017/pin")

const PostSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref : "user"
    },
    title:String,
    descrpition:String,
    image:String,
})



module.exports = mongoose.model("post" , PostSchema);