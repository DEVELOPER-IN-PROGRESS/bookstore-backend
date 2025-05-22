const mongoose = require('mongoose')

const applicationSchema = mongoose.Schema({
    fullname:{
        type: String,
        required: true
    },
    jobtitle:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    qualification:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    coverletter:{
        type: String,
        required: true
    },
    resume:{
        type:String,
        default:""
    }

})

const applications = mongoose.model("applications",applicationSchema)
module.exports = applications