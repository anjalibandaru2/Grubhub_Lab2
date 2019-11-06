const express = require('express');
const router = express.Router();

//imports
var config = require('../../config/settings');
var kafka = require('../kafka/client');

// Set up middleware
var jwt = require('jsonwebtoken');
var passport = require('passport');


router.post('/getOwnerList', function (req, res) {
  console.log("Inside getOwnerList");
  console.log("Requestbody is ::");
  console.log(req.body);
  //let {email, password, name}  = req.body;
  

  kafka.make_request('chatTopics',{"path":"getOwnerList"}, function(err,result){
    var responseObj = {
      status : false,
      message :""
    };
    if (err) {
      console.log(err);
      res.status(500).json({ message: 'Database is not responding!!!' });
    }
    else if (result.status === 200)
    {
      console.log("ownerList..");
      responseObj.status = true;
      responseObj.message = result.message;
      res.status(200).json(responseObj);
    } else if (result.status === 401){
      console.log("Owner list cannot be returned!");
      responseObj.status = false;
      responseObj.message = "Owner list cannot be returned!";
      res.status(200).json(responseObj);
    }
  });

});

module.exports = router;