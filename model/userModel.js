    const mongoose = require("mongoose")
    const {Schema} = require ("mongoose")

    const userDetailsSchema = new Schema({
        name:{type:String,default:null},
        email:{type:String,default:null},
        password:{type:String,default:null},
        role:{type:String,enum:['user',"admin"],default:"user"},
        resetPasswordToken:{type:String},
        resetPasswordTokenExpire:{type:Date},
        isBlocked: {type: Boolean, default: false},    
        deleted:{type:Boolean,default:false}
    },{timestamps:true})

    const userModel = new mongoose.model("userDetails",userDetailsSchema)
    module.exports = userModel