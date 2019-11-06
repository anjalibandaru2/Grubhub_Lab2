var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//schema
BuyersSchema = new Schema({
  buyer_name: {
    type: String,
    default: ''
  },
  buyer_email: {
    type: String,
    default: ''
  },
  buyer_password: {
    type: String,
    default: ''
  }
});
    
module.exports = mongoose.model('Buyers', BuyersSchema);