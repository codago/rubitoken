'use strict'

const express = require('express');
const router = express.Router();
const config = require('../config');
const jwt = require('jsonwebtoken');
const User = require("../models/user");
const checker = require("../helpers/checker")

/* GET users listing. */
router.post('/authenticate', function(req, res, next) {
  User.findOne({
    username: req.body.username
  }, function(err, user){
    if(err) throw err;
    if(!user){
      res.json({success: false, message: 'Authentication failed. User not found.'});
    }else if(user){
      if(user.password != req.body.password){
        res.json({success: false, message: 'Authentication failed. Wrong password.'});
      }else{
        let token = jwt.sign({id: user._id, username: user.username}, config.secretkey, {
          expiresIn: 86400 // seharian
        })
        res.json({
          success: true,
          message: 'Enjoy your token',
          token: token
        })
      }
    }
  })
});

router.get('/', checker, function(req, res, next){
  User.find({}, function(err, users){
    res.json(users);
  })
})

module.exports = router;
