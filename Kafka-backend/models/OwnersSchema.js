var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//schema
OwnersSchema = new Schema({
  owner_name: {
    type: String,
    default: ''
  },
  owner_email: {
    type: String,
    default: ''
  },
  owner_password: {
    type: String,
    default: ''
  },
  owner_restName:{
    type: String,
    default: ''
  },
  owner_restZipcode:{
    type: String,
    default: ''
  },
  sections:[]
});
    
module.exports = mongoose.model('Owners', OwnersSchema);