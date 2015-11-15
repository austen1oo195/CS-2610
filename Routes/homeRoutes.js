var express     = require('express');
var request     = require('request')
var cfg         = require('../config')
var querystring = require('querystring')
var Router      = express.Router();

Router.get('/sign_out', function(req, res){
  /*set access token to something obviously invalid so it will throw erros.
    I couldn't get a blank string to work as the access token because it
    would simply read that the token isn't there and try to return html
    instead of json.
  */
  req.session.access_token = 'asdf';
  res.redirect('/')
  //need to insert popup box confirming sign-out
})

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
