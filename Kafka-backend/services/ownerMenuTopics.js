var crypt = require('./bcrypt.js');
var Buyers = require('../models/BuyersSchema');
var Owners = require('../models/OwnersSchema');
const genericApis = require('./genericApis.js');

exports.OwnerMenuService = function OwnerMenuService(msg, callback) {
    console.log("In Owner Menu Service path:", msg.path);
    switch (msg.path) {
        case "addSectionToMenu":
            addSectionToMenu(msg, callback);
            break;
        case "getAllMenuItems":
            getAllMenuItems(msg, callback);
            break;
        case "addItemtoSection":
            addItemtoSection(msg, callback);
            break;
        case "deleteSection":
            deleteSection(msg, callback);
            break;
    }
};

let addSectionToMenu = function(message, callback){
    console.log("In Owner Menu Service path: addSectionToMenu ", message);
    var {owner_id, section_type} = message.sectionDetails;
    Owners.findOne({ _id: owner_id}, function (err, owner) {
        if (err) {
            console.log(err);
            console.log("unable to read the database");
            callback(err, "Database Error");
        } else {
            if (owner) {
                console.log("Owner found..adding section to the restaurant..");
                //Owners.insert({_id:owner_id, {sections}})
                console.log(owner);
                let section = {section_type: section_type, menu_items:[]}
                owner.sections.push(section);
                owner.save();

                callback(null, { status: 200, message:"section is added successfully!!" });
            } else {
                callback(null, { status: 200, message:"section cannot be added!!" });
            }
        }
    });
};

let addItemtoSection = function(message, callback){
    console.log("In Owner Menu Service path: addItemtoSection ", message);
    let owner_id = message.owner_id;
    let section_type = message.section_type
    var {item_name, item_description, item_price, item_image} = message.itemDetails;
    Owners.findOne({ _id: owner_id}, function (err, owner) {
        if (err) {
            console.log(err);
            console.log("unable to read the database");
            callback(err, "Database Error");
        } else {
            if (owner) {
                console.log("Owner found..adding item to section...");
                //Owners.insert({_id:owner_id, {sections}})
                owner.sections.forEach(function(section){
                    console.log("before adding in section....");
                    console.log(section);
                    if(section["section_type"] == section_type){
                        section["menu_items"].push({item_name, item_description, item_price, item_image});
                        console.log(section["menu_items"]);
                    }
                });
                console.log(owner);
                owner.markModified("sections");
                owner.save(function(err){
                    if(!err){
                        callback(null, { status: 200, message:"item is added successfully!!" });
                    } else{
                        callback(null, { status: 200, message:"item not added!!" });
                    }
                });   
            } else {
                callback(null, { status: 200, message:"item cannot be added!!" });
            }
        }
    });
};



let getAllMenuItems = function(message, callback){
    let owner_id = message.owner_id;
    Owners.findOne({_id : owner_id}, function(err, owner){
        if (err) {
            console.log(err);
            console.log("Unable to read the database");
            callback(err, "Database Error");
        } else {
            if (owner) {
               let sectionsList = owner.sections;
               console.log(sectionsList);
               callback(null, { status: 200, message : sectionsList });
            } else {
                callback(null, { status: 200, message:"No sections for the owner!!" });
            }
        }
    });
};

//Favorite.update( {cn: req.params.name}, { $pullAll: {uid: [req.params.deleteUid] } } )

let deleteSection = function(message, callback){
    let owner_id = message.owner_id;
    let section_type = message.section_type;
    console.log(message);
    console.log("section type is.."+section_type);
    Owners.updateOne({_id:owner_id}, {$pull:{sections : {section_type: section_type} }}, function(err){
        if(err){
            console.log(err);
            callback(null, { status: 200, message : "ERROR!!!not deleted!!" });
        } else{
            callback(null, { status: 200, message : "deleted successfully!" });
        }
    });
}


