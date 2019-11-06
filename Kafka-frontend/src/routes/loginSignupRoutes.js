//libraries
const express = require('express');
const router = express.Router();

//imports
var config = require('../../config/settings');
var kafka = require('../kafka/client');

// Set up middleware
var jwt = require('jsonwebtoken');
var passport = require('passport');


router.post('/signupBuyer', function (req, res) {
  console.log("Inside signup buyer route");
  console.log("Requestbody is ::");
  console.log(req.body);
  let {email, password, name}  = req.body;
  email = email.toLowerCase().trim();
  let buyerDetails = {
      buyer_name : name,
      buyer_email : email,
      buyer_password : password
  };  

  kafka.make_request('signupAndSignIn_topics',{"path":"signupbuyer", "buyerDetails" : buyerDetails}, function(err,result){
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
      console.log("Buyer is Added successfully!");
      responseObj.status = true;
      responseObj.message = "Signup is successful!!";
      res.status(200).json(responseObj);
    } else if (result.status === 401){
      console.log("Buyer already exists");
      responseObj.status = false;
      responseObj.message = "Buyer already exists! Please give another email id";
      res.status(200).json(responseObj);
    }
  });

});

router.post("/signupowner", async function(req, res){
  let{email, password, name, restName, restZipcode} = req.body;
  var responseObj = {};
  console.log("In signup owner route..");
  //try {
      //password = sha1(password);
      email = email.toLowerCase().trim();
      let ownerDetails = {
          owner_name : name,
          owner_email : email,
          owner_password : password,
          owner_restName : restName,
          owner_restZipcode : restZipcode
      };

      kafka.make_request('signupAndSignIn_topics',{"path":"signupowner", "ownerDetails" : ownerDetails}, function(err,result){
        var responseObj = {
          status : false,
          message :""
        };
        console.log("result is..");
        console.log(result);
        if (err) {
          console.log(err);
          res.status(500).json({ message: 'Database is not responding!!!' });
        }
        else if (result.status === 200)
        {
          console.log("Owner is Added successfully!");
          responseObj.status = true;
          responseObj.message = "Signup is successful!!";
          res.status(200).json(responseObj);
        } else if (result.status === 401){
          console.log("Owner already exists");
          responseObj.status = false;
          responseObj.message = "Owner already exists! Please give another email id";
          res.status(200).json(responseObj);
        }
      });

      //console.log("before calling dao signup..");
      //responseObj = await signupAndSignIn.signupOwner(ownerDetails);
      
  /*} catch(e) {
      console.log(e);
      responseObj.status = false;
  } finally{
      res.status(200).json({
          ...responseObj
      });
  }*/
});


router.post('/signin', function (req, res) {
  console.log("Inside signin post request");
  console.log("Request Body:");
  console.log(req.body);
  let {email, password, userType}  = req.body;
  email = email.toLowerCase().trim();
  let userdata = {
    email, password, userType
  }
  kafka.make_request('signupAndSignIn_topics',{"path":"signin", "body" : userdata}, function(err,result){
    if (err) {
      res.status(500).json({ message: 'Database not responding' });
    }
    else if (result.status === 200)
    {
      console.log("in callback of make_request..");
      console.log("result:", result);
     /* var token = jwt.sign({ id: result.user._id, email: result.user.email }, config.secret_key, {
        expiresIn: 7200 // expires in 7200 seconds
      });*/
     // req.session.user = result.user.email;
      //res.status(200).json({ status: true, token: token, cookies: { cookie1: result.user.role, cookie2: result.user._id, cookie3: result.user.name, cookie4: result.user.email  }  });
        let responseObj = {
          status : true,
          message : result.message
        };
        let user_id = result.userType === "owner" ? "owner_id" : "buyer_id";
        /*var token = jwt.sign({ id: result.user._id, email: result.user.email }, config.secret_key, {
          expiresIn: 7200 // expires in 2 hours
        });*/
       
        /*var token = jwt.sign({
          userType : userType,
          [user_id] : result[user_id],
          name: result.name
        }, config.secret_key,{ expiresIn: 7200});*/
        var token = jwt.sign({
          id: result[user_id], email: result.email , user_type : result.userType
        }, config.secret_key,{ expiresIn: 7200});
       /* res.cookie("user_type",result.userType,{maxAge: 900000, httpOnly: false, path : '/'});
        res.cookie(user_id,result[user_id],{maxAge: 900000, httpOnly: false, path : '/'});
        res.cookie("name",result.name,{maxAge: 900000, httpOnly: false, path : '/'});
        req.session.user = result.email;*/
        res.status(200).json({...responseObj, token : token, cookies : { "user_type": result.userType, [user_id] : result[user_id], name:result.name }});
     // console.log("valid user and token is", token);
    } else if (result.status === 400){
        let responseObj = {
          status : false,
          message : result.message
        };
        res.status(200).json(responseObj);
        console.log("Authentication failed. User does not exist.");
    }
  })

});

module.exports = router;