require('dotenv').config()
const mongoose = require('mongoose')
const MONGOURI = process.env.MONGOURI
require('./models/user')
require('./models/post')
// mongoose.model("User")

mongoose.connect(MONGOURI)
mongoose.connection.on('connected',() => {
    console.log("CONNECTED TO MONGODB")
})
mongoose.connection.on('error',() => {
    console.log("MONGODB CONNECTION ERROR")
})


module.exports = mongoose