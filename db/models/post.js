const mongoose = require('mongoose')
const user = require('./user')

const {ObjectId} = mongoose.Schema.Types
const postSchema = new mongoose.Schema({
    title:{
        type: String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        default:"No photo" //can be changed to a URL of the default photo
    },
    postedBy: {
        type:ObjectId,
        ref:"User"
    }
})

module.exports = mongoose.model("Post", postSchema)