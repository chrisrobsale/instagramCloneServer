require('dotenv').config()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const requireLogin = require('../middlewares/requireLogin')

router.get('/', (req,res) => {
    async function retryRequest(promiseFunc, nrOfRetries) {
        // Write your code here
        let response;
        for(i=1;i<=nrOfRetries;i++){
            console.log(i)
            let retval = await promiseFunc().then(res => {
                return res;
            }).catch((error) => {
                return false;
            })
            if(retval){
                response = retval
                i = nrOfRetries + 1
            }else{
                response = "Exception!"
            }
        }
        return response;
      }
              
      let hasFailed = false;
      function getUserInfo() {
        return new Promise((resolve, reject) => {
          if(!hasFailed) {
            hasFailed = true;
            reject("Exception!");
          } else {
            resolve("Fetched user!");
          }
        });
      }
      let promise = retryRequest(getUserInfo, 3);
      if(promise) {
        promise.then((result) => console.log(result))
        .catch((error) => console.log("Error!"));
      }
    res.send("hello isaw")
})

router.get('/protected', requireLogin, (req,res) => {
  res.send("test")
})

router.post('/signup', (req,res) => {
    const {name, email, password} = req.body
    if(!email || !password || !name){
      res.status(400).send({error: "Invalid Request"})
    }
    
    User.findOne({email:email})
      .then((savedUser) => {
        if(savedUser){
          return res.status(400).send({error: "User already exists"})
        }
        bcrypt.hash(password,12).then(hashpass => {
          const newUser = new User({
            email,
            password:hashpass,
            name
          })
  
          newUser.save()
            .then(u => {
              res.status(201).send({message: "User saved successfully"})
            })
            .catch(e => {
              res.status(500).send({error: e.message})
            })
        }).catch(e => {
          res.status(500).send({error: e.message})
        })
        
      })
      .catch(e =>{
        res.status(500).send({error: e.message})
      })
})

router.post('/signin', (req,res) => {
  const {email, password} = req.body
  if(!email || !password) res.status(400).send({error: "Invalid Username/Password"})
  User.findOne({email:email}).then(savedUser => {
    if(!savedUser) res.status(400).send({error: "Invalid Username/Password"})
    bcrypt.compare(password, savedUser.password).then(doMatch => {
      if(doMatch) {
        const token = jwt.sign({_id: savedUser._id,},process.env.JWT_SECRET)
        res.status(200).send({token})
      }
      else res.status(400).send({error: "Invalid Username/Password"})
    }).catch(e => {
      res.status(500).send({error: e.message})
    })
  })
})

module.exports = router