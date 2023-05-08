require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const PORT = 4000

//connect to db
const mongoose = require('./db/connect')

app.use(cors())
app.use(express.json()) //parsing request body
app.use(require('./routes/auth')) 
app.use(require('./routes/post')) 

app.listen(PORT, ()=>{
    console.log('Server is running on', PORT)
})