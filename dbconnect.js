require('dotenv').config()
const mongoose = require('mongoose')

const MONGOURI = process.env.NONGOURI
mongoose.connect(MONGOURI)
mongoose.connection.on('connected',() => {
    console.log("CONNECTED TO MONGODB")
})