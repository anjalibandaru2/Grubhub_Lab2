var crypt = require('./bcrypt.js');
var Buyers = require('../models/BuyersSchema');
var Owners = require('../models/OwnersSchema');
const genericApis = require('./genericApis.js');

exports.ChatTopicService = function OrderTopicService(msg, callback) {
    console.log("In Owner Menu Service path:", msg.path);
    switch (msg.path) {
        case "getOwnerList":
            getOwnerList(msg, callback);
            break;
       
    }
};

let getOwnerList = function(message, callback){
    console.log("In Order topics : getOwnerList ", message);
   Owners.find({}, function(err, owners){
       if(err){
            console.log("unable to insert into database", err);
            callback(err, "Database Error");
       } else if(owners){
           const ownersList = owners.map(function(owner){ return {owner_id :owner._id, owner_name : owner.owner_name }});
           callback(null, { status: 200, message: ownersList });
       }
   });
};

