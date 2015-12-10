var express = require('express');
var request = require('request')
var Router  = express.Router();

Router.get('/dashboard', function(req, res, next) {
  var options = {
    url: 'https://api.instagram.com/v1/users/self/feed?access_token=' +
      req.session.access_token
  };
  request.get(options, function(error, response, body){
    try {
    var feed = JSON.parse(body)
    if (feed.meta.code > 200) {
      return next(feed.meta.error_message);
    }
  }
  catch(err) {
    return next(err)
  }

    res.render('dashboard', {
      active_dashboard: "active",
  		css: "\\CSS\\image.css",
      title: 'Dashboard',
      feed: feed.data
    });

  });
});

Router.get('/profile', function(req, res, next) {
    var options = {
      url: 'https://api.instagram.com/v1/users/self/?access_token='
        + req.session.access_token
    }

  request.get(options, function(error, response, body){
    try {
    var feed = JSON.parse(body)
    if (feed.meta.code > 200) {
      return next(feed.meta.error_message);
    }
  }catch(err) {
    return next(err)
  }

  	res.render('profile', {
      active_profile: "active",
  		css: "\\CSS\\profile.css",
      title: 'Profile',
      feed: feed.data
  	});
  });
});

Router.get('/search', function(req, res, next){
  //options.url is used to make a request to that url with the access token to make sure
  //the token still valid. We don't actually need the info it will return, just need to secret
  //if it throws an error saying the token is invalid.
  var options = {
    url: 'https://api.instagram.com/v1/users/self/?access_token='
      + req.session.access_token
  }

  request.get(options, function(error, response, body){
    try {
      var feed = JSON.parse(body)
      if (feed.meta.code > 200) {
        return next(feed.meta.error_message);
      }
    }catch(err) {
      return next(err)
    }

  	res.render('search', {
      active_search: "active",
      css: "\\CSS\\search.css",
  		title: 'Search',
    });
	});
});

Router.post('/search', function(req, res, next){
  var tagName  = req.body.query;
  var options = {
    url: 'https://api.instagram.com/v1/tags/' + tagName +
      '/media/recent?access_token=' + req.session.access_token
  };

  request.get(options, function(error, response, body){
    try{
      var feed = JSON.parse(body);
      if(feed.meta.code > 200){
        return next(feed.meta.error_message);
      }
    }catch(err){
      return next(err)
    }

    res.render('search', {
      active_search: "active",
      css: "\\CSS\\search.css",
      title: 'Search',
      feed: feed.data
    });
  });
});

//successfully gets the form data on the profile page when submit is hit.
//needs work to save user info to database. and fill out the form with the info
//held in our database, rather than in instagram's database.
Router.post('/profile', function(req, res, next){
  var data = req.body
  console.log(data)
  res.redirect('/user/profile')
})
module.exports = Router;
