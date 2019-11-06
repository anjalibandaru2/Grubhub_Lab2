var crypt = require('./bcrypt.js');
var Buyers = require('../models/BuyersSchema');
var Owners = require('../models/OwnersSchema');

exports.SignupAndSignInService = function SignupAndSignInService(msg, callback) {
    console.log("In Login Signup Service path:", msg.path);
    switch (msg.path) {
        case "signupbuyer":
            signupbuyer(msg, callback);
            break;
        case "signin":
            signin(msg, callback);
            break;
        case "signupowner":
            signupowner(msg, callback);
            break;
    }
};

function signupbuyer(message, callback) {

    console.log("In signupbuyer topic service. Msg: ", message);
    var {buyer_email, buyer_password, buyer_name} = message.buyerDetails;
    Buyers.findOne({ buyer_email}, function (err, rows) {
        if (err) {
            console.log(err);
            console.log("unable to read the database");
            callback(err, "Database Error");
        } else {
            if (rows) {
                console.log("User already exists");
                callback(null, { status: 401, rows });
            } else {
                crypt.newHash(buyer_password, function (response) {
                    encrypted_password = response;
                    console.log("Encrypted password: " + encrypted_password);
                    var buyerDetails = {
                        "buyer_name": buyer_name,
                        "buyer_password": encrypted_password,
                        "buyer_email": buyer_email
                    };
                    //Save the user in database
                    Buyers.create(buyerDetails, function (err, user) {
                        if (err) {
                            console.log("unable to insert into database", err);
                            callback(err, "Database Error");
                        } else {
                            console.log("Buyer Signup is Successful!!");
                            callback(null, { status: 200, user });
                        }
                    });
                });
            }
        }
    });
}

function signupowner(message, callback) {

    console.log("In signupowner topic service. Msg: ", message);
    var {owner_email, owner_password, owner_name} = message.ownerDetails;
    Owners.findOne({ owner_email}, function (err, rows) {
        if (err) {
            console.log(err);
            console.log("unable to read the database");
            callback(err, "Database Error");
        } else {
            if (rows) {
                console.log("User already exists");
                callback(null, { status: 401, rows });
            } else {
                crypt.newHash(owner_password, function (response) {
                    encrypted_password = response;
                    console.log("Encrypted password: " + encrypted_password);
                    //Save the user in database
                    let ownerDetails = {
                        ...message.ownerDetails,
                        owner_password : encrypted_password 
                    }
                    console.log("owner details before insertion...");
                    console.log(ownerDetails);
                    Owners.create(ownerDetails, function (err, user) {
                        if (err) {
                            console.log("unable to insert into database", err);
                            callback(err, "Database Error");
                        } else {
                            console.log("Owner Signup is Successful!!");
                            callback(null, { status: 200, user });
                        }
                    });
                });
            }
        }
    });
}


function signin(msg, callback) {

    console.log("In signin topic service. Msg: ", msg);
    let Users, prefix;
    if(msg.body.userType === "owner"){
        Users = Owners;
        prefix = "owner_";
    }else {
        Users = Buyers;
        prefix = "buyer_";
    }
    
    Users.findOne({ [prefix+"email"]: msg.body.email }, function (err, user) {
        if (err) {
            console.log(err);
            console.log("unable to read the database");
            callback(err, "unable to read the database");
        } else if (user) {
            console.log("user:", user)
            crypt.compareHash(msg.body.password, user[prefix+"password"], function (err, isMatch) {
                if (isMatch && !err) {
                    console.log("Login Successful!! in signin..");
                    callback(null, {status: 200, message :"Loggedin successfully!", email : msg.body.email, name:user[prefix+"name"], userType : msg.body.userType, [prefix+"id"] : user["_id"]});
                } else {
                    console.log("Authentication failed. Passwords did not match");
                    callback(null, {status: 400, message: "Invalid Password!"});
                }
            },function(err){
                callback(null, {status: 500, message: "BCrypt hash error!!"});
            })
        } else {
            callback(null, {status: 400, message : "Invalid email ID! User doesn't exist!"});
        }
    });

}