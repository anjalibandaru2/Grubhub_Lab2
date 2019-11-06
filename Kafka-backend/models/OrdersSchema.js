var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//schema
OrderSchema = new Schema({
  owner_id: {
    type: String,
    default: ''
  },
  buyer_id: {
    type: String,
    default: ''
  },
  buyer_name : {
    type: String,
    default: ''
  },
  orderItems: [

  ],
  totalPrice:{
    type: String,
    default: ''
  },
  orderPlaced:{
    type: String,
    default: "false"
  },
  orderStatus:{
    type: String,
    default : "new"
  },
  owner_restName:{
    type: String,
    default: ''
  },
  messages : [
    
  ],
  orderAddress : ""
});
    
module.exports = mongoose.model('Orders', OrderSchema);