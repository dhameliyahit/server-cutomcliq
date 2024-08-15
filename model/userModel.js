const mongoose = require("mongoose");


const imageSchema = new mongoose.Schema({
    data: Buffer,
    contentType: String,
});

const userSchema = new mongoose.Schema({
    name:{type:String}, 
    profession:{type:String},
    companyName:{type:String}, 
    contactNumber:{type:String}, 
    email:{type:String}, 
    whatsApp:{type:String}, 
    location:{type:String},
    facebook:{type:String},
    instragram:{type:String},
    youtube:{type:String}, 
    googlereview:{type:String},
    logo:{
        data:Buffer,
        contentType:String
    }, 
    profilePic:{
        data:Buffer,
        contentType:String
    },
    gImg: [imageSchema] 
},{timestamps:true})

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;