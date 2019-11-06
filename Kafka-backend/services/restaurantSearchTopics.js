var crypt = require('./bcrypt.js');
//var Buyers = require('../models/BuyersSchema');
var Owners = require('../models/OwnersSchema');
const genericApis = require('./genericApis.js');

exports.RestaurantSearchService = function RestaurantSearchService(msg, callback) {
    console.log("InRestaurant Search Service path:", msg.path);
    switch (msg.path) {
        case "filterRestaurants":
            filterRestaurants(msg, callback);
            break;
        case "getRestaurantDetails":
                getRestaurantDetails(msg, callback);
                break;
    }
};


let filterRestaurants = function(message, callback){
    let itemName = message.itemName;
    Owners.find({"sections.menu_items.item_name" : itemName}, function(err, ownersList){
        if(err){
            callback(err, { status: 500, message : "Database not responding!"});
        } else {
            console.log(ownersList);
            let restaurantsList = [];
            for(let i = 0; i < ownersList.length; i++){
                let owner = ownersList[i];
                let {owner_restName, owner_restZipcode, owner_restDescription} = owner;
                let owner_id = owner._id;
                restaurantsList.push({owner_restName, owner_restZipcode, owner_restDescription, owner_id});
            }
            callback(null, { status: 200, message : restaurantsList });
        }
    });
};


let getRestaurantDetails = function(message, callback){
    let owner_id = message.owner_id;
    Owners.findOne({_id : owner_id}, function(err, owner){
        if(err){
            callback(err, { status: 500, message : "Database not responding!"});
        } else {
            if(owner){
                console.log(owner);
                callback(null, { status: 200, message : owner });
            } else {
                callback(null, { status: 200, message : "No details" });
            }
            
        }
    });
};