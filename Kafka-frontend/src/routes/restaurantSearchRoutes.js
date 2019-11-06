const express = require('express');
const router = express.Router();
const genericApis = require('./genericApis.js');
var config = require('../../config/settings');
var kafka = require('../kafka/client');
const path = require('path');
const fs = require('fs');
var jwt = require('jsonwebtoken');
const passport = require('../../config/passport');
var requireAuth = passport.authenticate('jwt', { session: false });

let base64Image = (buyer_profileImageName) =>{
    var bitmap = fs.readFileSync(buyer_profileImageName);
    return new Buffer(bitmap).toString('base64');
}
let getImageDirectory=(buyer_profieImageName)=>{
    let pathName = path.join(__dirname, '../../uploads/menuItems', buyer_profieImageName);
    return pathName;
}
var resolveImages = (restaurantDetails) =>{
    let sectionsList = restaurantDetails.sections;
    for(let i=0; i < sectionsList.length; i++){
        let section = sectionsList[i];
        let menuItems = section["menu_items"];
        for(let i=0; i < menuItems.length; i++){
            let {item_image }= menuItems[i];
            if(!genericApis.checkIfEmpty(item_image)){
                let imageFileName =getImageDirectory(item_image);
                menuItems[i]["item_image"]= "data:image/png;base64,"+base64Image(imageFileName);
            }
        }
    }
    return restaurantDetails;
}


router.post("/findRestaurants",requireAuth, async function(req, res){
    let{itemName} = req.body;
    var responseObj = {};
    try {
        if(genericApis.checkIfEmpty(itemName)){
            responseObj.status = false;
            responseObj.message = "Please Enter all the details";
            res.status(200).json(responseObj);
        } else {
            kafka.make_request('restaurantSearchTopics',{"path":"filterRestaurants", "itemName" : itemName}, function(err,result){
                let status= 200;
                let responseObj = {
                    status : false,
                    message : ""
                };
                if (err) {
                    console.log(err);
                    status = 500;
                    responseObj.message = "Database is not responding!!!";
                  }
                  else if (result.status === 200) {
                    console.log("restarurants list");
                    console.log(result.message);
                    responseObj.status = true;
                    responseObj.message = result.message;
                  }
                  res.status(status).json(responseObj);

            });
        }
    } catch(e) {
        console.log(e);
        let responseObj = {};
        responseObj.status = false;
        responseObj.message = "Issue at server side.. please login again";
        res.status(200).json(responseObj);
    }
});

router.post("/getRestaurantDetails", requireAuth, async function(req, res){
    let{owner_id} = req.body;
    var responseObj = {};
    try {
        if(genericApis.checkIfEmpty(owner_id)){
            responseObj.status = false;
            responseObj.message = "Please Enter all the details";
            res.status(200).json(responseObj);
        } else {
            kafka.make_request('restaurantSearchTopics',{"path":"getRestaurantDetails", "owner_id" : owner_id}, function(err,result){
                let status= 200;
                let responseObj = {
                    status : false,
                    message : ""
                };
                if (err) {
                    console.log(err);
                    status = 500;
                    responseObj.message = "Database is not responding!!!";
                  }
                  else if (result.status === 200) {
                    console.log("restarurant details");
                    console.log(result.message);
                    responseObj.status = true;
                    let restaurantDetails = resolveImages(result.message);
                    responseObj.message = restaurantDetails;
                  }
                  res.status(status).json(responseObj);

            });
        }
    } catch(e) {
        console.log(e);
        let responseObj = {};
        responseObj.status = false;
        responseObj.message = "Issue at server side.. please login again";
        res.status(200).json(responseObj);
    }
});

module.exports = router;