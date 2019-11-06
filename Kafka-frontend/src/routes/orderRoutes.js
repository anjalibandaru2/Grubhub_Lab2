//libraries
const express = require('express');
const router = express.Router();

//imports
var config = require('../../config/settings');
var kafka = require('../kafka/client');
var jwt = require('jsonwebtoken');
const passport = require('../../config/passport');
var requireAuth = passport.authenticate('jwt', { session: false });

router.post('/addToCart', requireAuth, function (req, res) {
    console.log("Inside addToCart route");
    console.log("Requestbody is ::");
    console.log(req.body);
    
    let {buyer_id, buyer_name, owner_id, item_name, item_quantity, item_calculatedPrice}  = req.body;
    let orderDetails = {item_name, item_quantity, item_calculatedPrice};
  
    kafka.make_request('orderTopics',{"path":"addToCart", "buyer_id" : buyer_id, "buyer_name": buyer_name, "owner_id":owner_id,"orderDetails" : orderDetails}, function(err,result){
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
        console.log("Item is added to cart successfully!");
        responseObj.status = true;
        responseObj.message = "Item is added to cart successfully!!";
        res.status(200).json(responseObj);
      } else if (result.status === 401){
        console.log("Item cannot be  added!!");
        responseObj.status = false;
        responseObj.message = "Item cannot be added!!";
        res.status(200).json(responseObj);
      }
    });
});

router.post('/getCart',  function (req, res) {
  let {buyer_id} = req.body;
  kafka.make_request('orderTopics',{"path":"getCart", "buyer_id" : buyer_id}, function(err,result){
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
     // console.log("cart details..");
      responseObj.status = true;
      responseObj.message = result.message;
      res.status(200).json(responseObj);
    } else if (result.status === 401){
      console.log("Item cannot be  added!!");
      responseObj.status = false;
      responseObj.message = result.message;
      res.status(200).json(responseObj);
    }
  });
});

router.post('/placeOrder', requireAuth, function (req, res) {
  let {buyer_id, orderAddress} = req.body;
  kafka.make_request('orderTopics',{"path":"placeOrder", buyer_id, orderAddress}, function(err,result){
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
      console.log("order placed..");
      responseObj.status = true;
      responseObj.message = result.message;
      res.status(200).json(responseObj);
    } else if (result.status === 401){
      console.log("Item cannot be  added!!");
      responseObj.status = false;
      responseObj.message = result.message;
      res.status(200).json(responseObj);
    }
  });
});

router.post('/buyerUpcomingOrders', requireAuth, function (req, res) {
  let {buyer_id} = req.body;
  kafka.make_request('orderTopics',{"path":"buyerUpcomingOrders", "buyer_id" : buyer_id}, function(err,result){
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
      console.log("buyer upcoming orders...");
      responseObj.status = true;
      responseObj.message = result.message;
      res.status(200).json(responseObj);
    } else if (result.status === 401){
      console.log("orders cannot be returned!!");
      responseObj.status = false;
      responseObj.message = result.message;
      res.status(200).json(responseObj);
    }
  });
});

router.post('/buyerPastOrders', requireAuth, function (req, res) {
  let {buyer_id} = req.body;
  kafka.make_request('orderTopics',{"path":"buyerPastOrders", "buyer_id" : buyer_id}, function(err,result){
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
      console.log("buyer past orders...");
      responseObj.status = true;
      responseObj.message = result.message;
      res.status(200).json(responseObj);
    } else if (result.status === 401){
      console.log("orders cannot be returned!!");
      responseObj.status = false;
      responseObj.message = result.message;
      res.status(200).json(responseObj);
    }
  });
});


router.post('/ownerUpcomingOrders', requireAuth,  function (req, res) {
  let {owner_id} = req.body;
  kafka.make_request('orderTopics',{"path":"ownerUpcomingOrders", "owner_id" : owner_id}, function(err,result){
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
      console.log("owner upcoming orders...");
      responseObj.status = true;
      responseObj.message = result.message;
      res.status(200).json(responseObj);
    } else if (result.status === 401){
      console.log("orders cannot be returned!!");
      responseObj.status = false;
      responseObj.message = result.message;
      res.status(200).json(responseObj);
    }
  });
});
router.post('/ownerPastOrders', requireAuth, function (req, res) {
  let {owner_id} = req.body;
  kafka.make_request('orderTopics',{"path":"ownerPastOrders", "owner_id" : owner_id}, function(err,result){
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
      console.log("owner past orders...");
      responseObj.status = true;
      responseObj.message = result.message;
      res.status(200).json(responseObj);
    } else if (result.status === 401){
      console.log("orders cannot be returned!!");
      responseObj.status = false;
      responseObj.message = result.message;
      res.status(200).json(responseObj);
    }
  });
});

router.post('/updateOrderStatus',requireAuth,  function (req, res) {
  let {order_id, order_status} = req.body;
  kafka.make_request('orderTopics',{"path":"updateOrderStatus", "order_id" : order_id, order_status}, function(err,result){
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
      console.log("update order status...");
      responseObj.status = true;
      responseObj.message = result.message;
      res.status(200).json(responseObj);
    } else if (result.status === 401){
      console.log("status cannot be updated!!!");
      responseObj.status = false;
      responseObj.message = result.message;
      res.status(200).json(responseObj);
    }
  });
});

router.post('/sendOrderMessage', requireAuth, function (req, res) {
  let {order_id, order_message, sentBy} = req.body;
  kafka.make_request('orderTopics',{"path":"sendOrderMessage", order_id, order_message, sentBy}, function(err,result){
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
      console.log("send order message...");
      responseObj.status = true;
      responseObj.message = result.message;
      res.status(200).json(responseObj);
    } else if (result.status === 401){
      console.log("message cannot be sent!!!");
      responseObj.status = false;
      responseObj.message = result.message;
      res.status(200).json(responseObj);
    }
  });
});


module.exports = router;
  