const mongoose = require('mongoose');
const userschema =  new mongoose.Schema({
    username: {
        type: String , 
        required : true,
        unique : true
    },
    email : {
        type: String, 
        required: true,
        unique : true ,
        lowercase : true
    },
    password : {
        type: String,
        required : true,
    },
    usertype: {
        type: String ,
        enum:["psychologue","etudiant"],
        required : true,
    }, 
    post :[{
        type : mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
    postSauv : [{
        type: mongoose.Schema.Types.ObjectId,
        ref : "Post"
    }],
    profilePicture: {
        type : String,
        require : false,
        default : ""
    },
    tasks : [{
        type:mongoose.Schema.Types.ObjectId,
        ref : "Tasks"
    }],
    notification: [{
        type:mongoose.Schema.Types.ObjectId,
        ref : "notification"
    }]
},{timestamps : true})
module.exports = mongoose.model('User',userschema)