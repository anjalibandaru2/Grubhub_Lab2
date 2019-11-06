const express = require('express');

const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const genericApis = require('./genericApis.js');
var config = require('../../config/settings');
var kafka = require('../kafka/client');
var jwt = require('jsonwebtoken');
const passport = require('../../config/passport');
var requireAuth = passport.authenticate('jwt', { session: false });

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
      console.log("in destination..");
    callback(null, './uploads/menuItems');
  },
  filename: (req, file, callback) => {
    fileExtension = file.originalname.split('.')[1];
    console.log("fileExtension", fileExtension);
    callback(null, file.originalname.split('.')[0] + '-' + Date.now() + '.' + fileExtension);
  },
});

var upload = multer({ storage: storage });

router.post("/addSectionToMenu",  requireAuth,async function(req, res){
    var responseObj = {};
    let {section_type, owner_id} = req.body;
    try{
        if(genericApis.checkIfEmpty(section_type) || genericApis.checkIfEmpty(owner_id)){
            responseObj.status = false;
            responseObj.message = "Please Enter all the details";
            res.status(200).json(responseObj);
        } else {
            //responseObj = await menuItemAccess.addSectionToMenu(owner_id, section_type);
            kafka.make_request('ownerMenuTopics',{"path":"addSectionToMenu", "sectionDetails" : {section_type, owner_id}}, function(err,result){
              let status= 200;
              let responseObj = {
                  status : false,
                  message : ""
              };
                console.log("result is..");
                console.log(result);
                if (err) {
                  console.log(err);
                  status = 500;
                  responseObj.message = "Database is not responding!!!";
                 // res.status(500).json({ message: 'Database is not responding!!!' });
                }
                else if (result.status === 200) {
                  console.log("Menu item is Added successfully!");
                  responseObj.status = true;
                  responseObj.message = "Menu item is Added successfully!!";
                  //res.status(200).json(responseObj);
                }
                res.status(status).json(responseObj);
              });
        }
    } catch(e) {
        console.log(e);
       /* responseObj.status = false;
        responseObj.message = "Unexpected error at server side! Please login and try again!!";
        res.status(200).json(responseObj);*/
    }
});

let resolveImages = (sectionsList) =>{
  for(let i=0; i<sectionsList.length; i++){
      let menuItems = sectionsList[i]["menu_items"];
      for(let j=0; j< menuItems.length; j++){
          let {item_image} = menuItems[j];
          if(!genericApis.checkIfEmpty(item_image)){
              let imageFileName =getImageDirectory(item_image);
              menuItems[j]["item_image"]= "data:image/png;base64,"+base64Image(imageFileName);
          }
      } 
  }
  return sectionsList;
}
let base64Image = (buyer_profileImageName) =>{
  var bitmap = fs.readFileSync(buyer_profileImageName);
  return new Buffer(bitmap).toString('base64');
}
let getImageDirectory=(buyer_profieImageName)=>{
  let pathName = path.join(__dirname, '../../uploads/menuItems', buyer_profieImageName);
  return pathName;
}


router.post("/getAllMenuItems", requireAuth, async function(req, res){
  var responseObj = {};
    let { owner_id} = req.body;
    try{
      if(genericApis.checkIfEmpty(owner_id)){
        responseObj.status = false;
        responseObj.message = "Please Enter all the details";
        res.status(200).json(responseObj);
      } else {
        kafka.make_request('ownerMenuTopics',{"path":"getAllMenuItems", "owner_id" : owner_id}, function(err,result){
          var status = 200;
          var responseObj = {
            status : false,
            message :""
          };
          console.log("result is..");
          console.log(result);
          if (err) {
            console.log(err);
            status = 500;
            responseObj.message = "Database is not responding!!!";
            //res.status(500).json({ message: 'Database is not responding!!!' });
          }
          else if (result.status === 200) {
            console.log("Menu items returned are ::");
            console.log(result);
            sectionsList = resolveImages(result.message);
            responseObj.status = true;
            responseObj.message = sectionsList;
            //res.status(200).json(responseObj);
          } /*else if (result.status === 401){
            console.log("Menu items are not returned!!");
            responseObj.status = false;
            responseObj.message = result.message;
            res.status(200).json(responseObj);
          }*/
          res.status(status).json(responseObj);
          
        });
      }
    } catch(e){
      console.log(e);
      let responseObj = {};
      responseObj.status = false;
      responseObj.message = "Issue at server side.. please login again";
      res.status(200).json(responseObj);
    }
});

router.post("/addItemtoSection",  upload.single('item_image'),  requireAuth, async function(req, res){
  var responseObj = {};
  let { owner_id, item_name, item_description, item_price, section_type} = req.body;
  console.log("in owner menu..add item to section..");
  console.log(req.body);
  try{
    if(genericApis.checkIfEmpty(owner_id)){
      responseObj.status = false;
      responseObj.message = "Please Enter all the details";
      res.status(200).json(responseObj);
    } else {
      let itemDetails = {item_name, item_description, item_price};
      if(req.file){
        //upload.single('item_image');
        let item_imageName = req.file.filename;
        itemDetails.item_image = item_imageName;
      }
      kafka.make_request('ownerMenuTopics',{"path":"addItemtoSection", "owner_id" : owner_id, section_type, itemDetails}, function(err,result){
        console.log("result is..");
          console.log(result);
          let responseObj ={};
          if (err) {
            console.log(err);
            res.status(500).json({ message: 'Database is not responding!!!' });
          } else if (result.status === 200) {
            responseObj.status = true;
            responseObj.message = result.message;
            res.status(200).json(responseObj);
          } else if (result.status === 401){
            console.log("Menu items cannot be added!!");
            responseObj.status = false;
            responseObj.message = result.message;
            res.status(200).json(responseObj);
          }
      });
    }
  } catch(e){
    let responseObj ={};
    responseObj.status = false;
    responseObj.message = "Error!! at server side!";
    res.status(200).json(responseObj);
  }
});

router.post("/deleteSection", requireAuth, async function(req, res){
  var responseObj = {};
    let { owner_id, section_type} = req.body;
    try{
      if(genericApis.checkIfEmpty(owner_id)){
        responseObj.status = false;
        responseObj.message = "Please Enter all the details";
        res.status(200).json(responseObj);
      } else {
        kafka.make_request('ownerMenuTopics',{"path":"deleteSection", "owner_id" : owner_id, section_type}, function(err,result){
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
          else if (result.status === 200) {
            console.log("Menu items returned are ::");
            console.log(result);
            responseObj.status = true;
            responseObj.message = result.message;
            res.status(200).json(responseObj);
          } /*else if (result.status === 401){
            console.log("Menu items are not returned!!");
            responseObj.status = false;
            responseObj.message = result.message;
            res.status(200).json(responseObj);
          }*/
        });
      }
    } catch(e){

    }
});


module.exports = router;