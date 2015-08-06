var express = require('express');
var app = express();
var User = require('./models/user.js');

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.set('view engine', 'hbs');

// simple logger for this router's requests
// all requests to this router will first hit this middleware
app.use(function(req, res, next) {
  // useful for testing
  // console.log('%s %s %s', req.method, req.url, req.path);
  next();
});

// GET - new message
app.get('/new', function(req, res, next) {
  // render submit form
  res.render('new.hbs');
});

// POST - new message
app.post('/new', function(req, res, next){
  // collect data from body
  var name = req.body.username;
  var message = req.body.message;
  // build & populate new user
  var newUser = User({
      name: name,
      message: message
  });
  //save new user & redirect to homepage
  newUser.save(function(err) {
    res.redirect('/');
  });
});

// GET - deletes element with :id (dont know why i used destroy > delete.)
app.get('/:id/destroy', function(req, res){
  //grab id param
  var id = req.params.id;

  //delete by id
  User.find({ _id: id }).remove().exec();
  res.redirect('/')
});

// GET update form for element with :id
app.get('/:id/update', function(req, res){
  var id = req.params.id;

  User.findOne({_id: id}, function(err, post){
      res.render('update.hbs', {"post": post})
  });
});

// POST update submission that updates in mongo
app.post('/:id/update', function(req, res){
  // id is found in route params
  var post_id = req.params.id;
  // other data in body
  var new_user = req.body.username;
  var new_message = req.body.message;

  //updates mongo element
  User.update({_id: post_id}, { $set: {user: new_user, message: new_message}}, function(err){
    res.redirect('/');
  });
});

// GET - route that catches query and redirects to url correctly
// something tells me there is a much better way to do this,
// but i just got started with node so meh. ill keep searching.
app.get('/find?', function(req, res){
  res.redirect('/' + req.query.route_tag);
});

// find post by id in mongo and shows info
app.get('/:id', function(req, res){
  var id = req.params.id;

  User.findOne({_id: id}, function(err, post) {
    if (post === undefined) {
      post = {name: "NO DATA FOUND"}
    }
    res.render('post', { "post": post });
  });
});

// default. if it gets here its '/'
app.use(function(req, res, next) {
  User.find({}, function(err, users) {
    res.render('index', { "user_names": users });
  });
});

app.listen(3000);

// +++++++  mongoose funcs  +++++++
//
// -- SAVE USER TO DB
// var newUser = User({
//     name: name,
//     message: message
// });
// newUser.save(function(err) {});
//
// -- FIND ALL USERS
//     User.find({}, function(err, users) {
//       res.render('index', { "user_names": users });
//     });
//
// -- DELETE BY ID
//     User.find({ _id: id }).remove().exec();
