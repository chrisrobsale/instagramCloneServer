const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model("Post")
const requireLogin = require('../middlewares/requireLogin')

router.get('/post', (req,res) => {
    Post.find()
    .populate("postedBy", "_id name")
    .then(posts => {
        res.status(200).send({posts})
    }).catch(e => {
        res.status(500).send({error: e.message}) 
    })
})

router.post('/createpost', requireLogin, (req,res) => {
    const {title,body} = req.body
    if(!title || !body) res.status(400).send({error: "Invalid Request"})
    const post = new Post({
        title,
        body,
        postedBy:req.user
    })
    post.save().then(result => {
        res.status(201).send({
            post : result
        })
    }).catch(e => {
        res.status(500).send({error: e.message}) 
    })
})

router.get('/mypost', requireLogin, (req,res) => {
    Post.find({postedBy:req.user._id})
    .populate("postedBy", "_id name")
    .then(mypost=>{
        res.status(200).send({mypost})
    }).catch(e => {
        res.status(500).send({error: e.message}) 
    })
})

module.exports = router