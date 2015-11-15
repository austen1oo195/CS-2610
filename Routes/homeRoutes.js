var express     = require('express');
var request     = require('request')
var cfg         = require('../config')
var querystring = require('querystring')
var Router      = express.Router();

Router.get('/sign_out', function(req, res){
  req.session.access_token = "";
  console.log('successful sign out')
  res.redirect('/')
  //output sign out successful when that gets resolved
})

Router.get('/authorize', function(req, res){
  var qs = {
    client_id: cfg.client_id,
    redirect_uri: cfg.redirect_uri,
    response_type: 'code'
  }
  //client_id=2261696381.1677ed0.1992891961cf4e42830657329b06665c&http://localhost:3000/auth/finalize
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
    req.session.access_token = data.access_token
    res.redirect('/user/dashboard')
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
