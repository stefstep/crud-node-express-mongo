var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//connect to local mongo db
mongoose.connect('mongodb://localhost/nodetest');

// create a schema
var userSchema = new Schema({
  name: String,
  message: String
});

var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;
