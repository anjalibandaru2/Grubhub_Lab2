'use strict';
var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var Buyers = require('../src/models/BuyersSchema');
var Owners = require('../src/models/OwnersSchema');
var config = require('./settings');

// Setup work and export for the JWT passport strategy
var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secret_key
};
passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    console.log("JWT Payload:", jwt_payload);
    let user_type = jwt_payload.user_type;
    let Users = (user_type == "buyer") ? Buyers :Owners;
    Users.findOne({ _id: jwt_payload.id }, function (err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            delete user.buyer_password;
            console.log("Authentication valid");
            return done(null, user);
        } else {
            /*Owners.findOne({ _id: jwt_payload.id }, function (err, user) {
                if (err) {
                    return done(err, false);
                }
                if (user) {
                    delete user.owner_password;
                    console.log("Authentication valid");
                    return done(null, user);
                } else{
                    return done(null, false);
                }
            });*/
            return done(null, false);
        }
    });
}));

module.exports = passport;