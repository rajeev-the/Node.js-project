const mongoose = require("mongoose")
const plm = require("passport-local-mongoose")

mongoose.connect("mongodb://localhost:27017/pin")

const UserSchema = mongoose.Schema({
    username:String,
    name:String,
    email:String,
    password:String,
    profileImage:String,
    contact:String,
    board:{
        type:Array,
        default:[]
    },
    post:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "post"
        }
    ]
})

UserSchema.plugin(plm)

module.exports = mongoose.model("user" , UserSchema);