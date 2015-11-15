var express = require('express');
var request = require('request')
var Router  = express.Router();

Router.get('/dashboard', function(req, res) {
  var options = {
    url: 'https://api.instagram.com/v1/users/self/feed?access_token=' +
      req.session.access_token
  };
  request.get(options, function(error, response, body){
    var feed = JSON.parse(body);

    res.render('dashboard', {
      active_dashboard: "active",
  		css: "\\CSS\\image.css",
      title: 'Dashboard',
      feed: feed.data
    });

  });
});

Router.get('/profile', function(req, res) {
  var options = {
    url: 'https://api.instagram.com/v1/users/self/?access_token='
      + req.session.access_token
  }

  request.get(options, function(error, response, body){
    var feed = JSON.parse(body);

  	res.render('profile', {
      active_profile: "active",
  		css: "\\CSS\\profile.css",
      title: 'Profile',
      feed: feed.data
  	});
  });
});

Router.get('/search', function(req, res){
	res.render('search', {
    active_search: "active",
    css: "\\CSS\\search.css",
		title: 'Search',
	});
});

Router.post('/search', function(req, res){
  var tagName  = req.body.query;
  var options = {
    url: 'https://api.instagram.com/v1/tags/' + tagName +
      '/media/recent?access_token=' + req.session.access_token
  };

  request.get(options, function(error, response, body){
    var feed = JSON.parse(body);

    res.render('search', {
      active_search: "active",
      css: "\\CSS\\search.css",
      title: 'Search',
      feed: feed.data
    });

  });
});

module.exports = Router;
