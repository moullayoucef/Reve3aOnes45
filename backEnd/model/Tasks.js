const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const blogSchema = new Schema({
    Untitled : {
        type : String , 
        required : true 
    },

    description : {
        type : String, 
        required: true 
    },

    created : {
        type : String, 
        required: false 
    },

    status : {
        type : String, 
        required: false 
    },

    link : {
        type : String, 
        required: false 
    },

    comment : {
        type : String, 
        required: false 
    },
}, {timestamps: true})

const Tasks = mongoose.model('Tasks', blogSchema)
module.exports = Tasks ;