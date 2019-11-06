var crypt = require('./bcrypt.js');
var Buyers = require('../models/BuyersSchema');
var Owners = require('../models/OwnersSchema');
var Orders = require('../models/OrdersSchema');
const genericApis = require('./genericApis.js');

exports.OrderTopicService = function OrderTopicService(msg, callback) {
    console.log("In Owner Menu Service path:", msg.path);
    switch (msg.path) {
        case "addToCart":
            addToCart(msg, callback);
            break;
        case "getCart":
            getCart(msg, callback);
            break;
        case "placeOrder":
            placeOrder(msg, callback);
            break;
        case "buyerUpcomingOrders":
            buyerUpcomingOrders(msg, callback);
            break;
        case "buyerPastOrders":
            buyerPastOrders(msg, callback);
            break;
        case "ownerUpcomingOrders":
            ownerUpcomingOrders(msg, callback);
            break;
        case "ownerPastOrders":
            ownerPastOrders(msg, callback);
            break;
        case "updateOrderStatus":
            updateOrderStatus(msg, callback);
            break;
        case "sendOrderMessage":
            sendOrderMessage(msg, callback);
            break;
    }
};

let addToCart = function(message, callback){
    console.log("In Order topics : addToCart ", message);
    let {buyer_id, owner_id, orderDetails, buyer_name} = message;
    Orders.findOne({ buyer_id: buyer_id, orderPlaced:"false"}, function (err, order) {
        if (err) {
            console.log(err);
            console.log("unable to read the database");
            callback(err, "Database Error");
        } else {
            if (order) {
                console.log("Owner found..adding section to the restaurant..");
                //Owners.insert({_id:owner_id, {sections}})
                console.log(order);
                let orderItems = order.orderItems;
                let totalPrice = parseInt(order.totalPrice);
                let currentOrderPrice = parseInt(orderDetails.item_calculatedPrice);
                totalPrice += currentOrderPrice;
                order.totalPrice = totalPrice;
                orderItems.push(orderDetails);
                order.markModified("orderItems");
                order.markModified("totalPrice");
                order.save(function(err, result){
                    callback(null, { status: 200, message:"item added to cart successfully!!" });
                });
            } else {
                let order = {buyer_id, owner_id, buyer_name, orderItems: orderDetails, totalPrice:orderDetails.item_calculatedPrice};
                console.log("order in add to cart is..");
                console.log(order);
                Owners.findOne({_id: owner_id}, function(err, owner){
                    if(err){
                        console.log("unable to insert into database", err);
                        callback(err, "Database Error");
                    } else  if(owner){
                            let ownerRestName = owner.owner_restName;
                            order.owner_restName = ownerRestName;
                            //order.totalPrice = order.item_calculatedPrice;
                            Orders.create( order, function(err, res){
                                if (err) {
                                    console.log("unable to insert into database", err);
                                    callback(err, "Database Error");
                                } else {
                                    console.log("item added to cart successfully!!");
                                    callback(null, { status: 200, message:"item added to cart successfully!!" });
                                }
                            });
                       
                    }
                    
                });
            }
        }
    });
};

let getCart = function(message, callback){
    console.log("In Order topics : getCart ", message);
    let {buyer_id} = message;
    Orders.findOne({buyer_id, orderPlaced:"false"}, function(err, cartDetails){
        if (err) {
            console.log(err);
            console.log("unable to read the database");
            callback(err, "Database Error");
        } else {
            console.log("cart items...");
            console.log(cartDetails);
            if(cartDetails){
                callback(null, { status: 200, message:cartDetails });
            } else{
                callback(null, { status: 200, message:"cart items cannot be returned" });
            }
        }
    });
};

let placeOrder = function(message, callback){
    console.log("In Order topics : placeOrder "+ message);
    let {buyer_id, orderAddress}  = message;
    Orders.findOne({buyer_id, orderPlaced:"false"}, function(err, order){
        if (err) {
            console.log(err);
            console.log("unable to read the database");
            callback(err, "Database Error");
        } else {
            console.log("cart details..");
            console.log(order);
            if(order){
                order.orderPlaced = "true";
                order.orderAddress = orderAddress;
                order.save();
                callback(null, { status: 200, message:"Order placed successfully!!" });
            } else{
                callback(null, { status: 200, message:"Order cannot be placed" });
            }
        }
    });
};

let buyerUpcomingOrders = function(message, callback){
    console.log("In buyerupcoming orders.."+ message);
    let {buyer_id} = message;
    Orders.find({buyer_id, orderPlaced:"true", $and:[ {orderStatus : {$ne : "delivered"}},{orderStatus : {$ne : "cancelled"} } ] }, function(err, ordersList){
        if (err) {
            console.log(err);
            console.log("unable to read the database");
            callback(err, "Database Error");
        } else{
            if(ordersList){
                callback(null, { status: 200, message:ordersList });
            } else{
                callback(null, { status: 200, message:"No upcoming orders" });
            }
        }
    });
}

let buyerPastOrders = function(message, callback){
    console.log("In buyerpast orders.."+ message);
    let {buyer_id} = message;
    Orders.find({buyer_id, orderPlaced:"true", $or:[ {orderStatus : {$eq : "delivered"}},{orderStatus : {$eq : "cancelled"} } ] }, function(err, ordersList){
        if (err) {
            console.log(err);
            console.log("unable to read the database");
            callback(err, "Database Error");
        } else{
            if(ordersList){
                callback(null, { status: 200, message:ordersList });
            } else{
                callback(null, { status: 200, message:"No past orders" });
            }
        }
    });
}

let ownerUpcomingOrders = function(message, callback){
    console.log("In ownerUpcomingOrders..");
    console.log(message);
    let {owner_id} = message;
    Orders.find({owner_id, orderPlaced:"true", $and:[ {orderStatus : {$ne : "delivered"}},{orderStatus : {$ne : "cancelled"} } ] }, function(err, ordersList){
        if (err) {
            console.log(err);
            console.log("unable to read the database");
            callback(err, "Database Error");
        } else {
            if(ordersList){
                callback(null, { status: 200, message:ordersList });
            } else{
                callback(null, { status: 200, message:"No upcoming orders" });
            }
        }
    });
}

let ownerPastOrders = function(message, callback){
    console.log("In ownerPastOrders.."+ message);
    let {owner_id} = message;
    Orders.find({owner_id, orderPlaced:"true", $or:[ {orderStatus : {$eq : "delivered"}},{orderStatus : {$eq : "cancelled"} } ] }, function(err, ordersList){
        if (err) {
            console.log(err);
            console.log("unable to read the database");
            callback(err, "Database Error");
        } else {
            if(ordersList){
                console.log("orders list..");
                console.log(ordersList);
                callback(null, { status: 200, message:ordersList });
            } else{
                callback(null, { status: 200, message:"No past orders" });
            }
        }
    });
}
let updateOrderStatus = function(message, callback){
    console.log("In updateOrderStatus.."+ message);
    let{order_id, order_status} = message;
    Orders.update(
        { _id : order_id },
        {
            $set : {
                orderStatus : order_status
            }
        },
        function(err, order){
            if (err) {
                console.log(err);
                console.log("unable to read the database");
                callback(err, "Database Error");
            } else {
                if(order){
                    callback(null, { status: 200, message:"Order status is successfully updated" });
                } else{
                    callback(null, { status: 200, message:"Order status is not updated" });
                }
            }
        }
    );
}

let sendOrderMessage = function(message, callback){
    console.log("In sendOrderMessage.."+ message);
    let{order_id, order_message, sentBy} = message;
    Orders.findOne(
        { _id : order_id },
        function(err, order){
            if (err) {
                console.log(err);
                console.log("unable to read the database");
                callback(err, "Database Error");
            } else {
                if(order){
                     let messages = order.messages;
                     messages.push({message : order_message, sentBy});
                     order.markModified("messages");
                    order.save(function(err){
                        if(!err){
                            callback(null, { status: 200, message:"Message is sent" });
                        } else{
                            callback(null, { status: 200, message:"Message is not sent!!" });
                        }
                    });  
                } else{
                    callback(null, { status: 200, message:"Message is not sent" });
                }
            }
        }
    );
}
