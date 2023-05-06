const jwt = require('jsonwebtoken')
require('dotenv').config()
const mongoose = require('mongoose')
const User = mongoose.model("User")

module.exports = (req,res,next) => {
    const {authorization} = req.headers
    if(!authorization){
        return res.status(401).send({error: "Unauthorized"})
    }
    
    const token = authorization.replace("Bearer ", "")
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if(err){
            return res.status(401).send({error: "Unauthorized"})
        }
        const {_id} = payload
        User.findById(_id).then(userdata => {
            const {_id, name, email} = userdata
            req.user = {_id, name, email}
            // console.log(req.user)
            next()
        }).catch(e => {
            console.log(e.message)
            return res.status(500).send({error: e.message})
        })
    })
}