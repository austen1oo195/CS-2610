var express     = require('express');
var request     = require('request')
var cfg         = require('../config')
var querystring = require('querystring')
var User        = require('../models/users')
var Router      = express.Router();

Router.get('/authorize', function(req, res){
  var qs = {
    client_id: cfg.client_id,
    redirect_uri: cfg.redirect_uri,
    response_type: 'code'
  }

  var query = querystring.stringify(qs)
  var url = 'https://api.instagram.com/oauth/authorize/?' + query

  res.redirect(url)
})

Router.get('/auth/finalize', function(req, res) {
  var post_data = {
    client_id: cfg.client_id,
    client_secret: cfg.client_secret,
    redirect_uri: cfg.redirect_uri,
    grant_type: 'authorization_code',
    code: req.query.code
  }

  var options = {
    url: 'https://api.instagram.com/oauth/access_token',
    form: post_data
  }

  request.post(options, function(error, response, body) {
    var data = JSON.parse(body)
    var user = data.user

    req.session.access_token = data.access_token
    req.session.userId = user._id = user.id

    delete user.id
    //find person in the database. If they aren't found in the database from
    //the user id, then insert them into the database.
    User.find(user._id, function(document){
      if(!document){
        User.insert(user, function(result){

          //just for verification in console that everything is good. Can be
          //deleted later once everything is working.
          console.log(data.user)

          res.redirect('/user/dashboard')
        })
      }else{
        res.redirect('/user/dashboard')
      }

    })
  })
})

Router.get('/', function(req, res) {
  res.render('index', {
		title: 'Login',
		layout: 'base',
    css: '\\CSS\\home.css'
  });
});

module.exports = Router;
