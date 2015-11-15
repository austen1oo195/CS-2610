var express 	  = require('express')
var exphbs		  = require('express-handlebars')
var bodyParser  = require('body-parser')
var querystring = require('querystring')
var request     = require('request')
var session     = require('express-session')
var path        = require('path') //needed for static path
var cfg         = require('./config')
var router 	    = express.Router();
var port        = 3000;

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'auth_base'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public'))); //so it can find static files (like the css files)

//check if access token is still valid, if not then redirect to the home pages
//app.use(if(req.access_token))

app.use(session({
  cookieName: 'session',
  secret: 'alsdkfjaclskdjf',
  resave: false,
  saveUninitialized: true
}))

app.use('/dashboard', function(req, res, next) {
  console.log(req.session)
  if(req.session.access_token == ""){
    console.log("You'll Never Make It This Far")
    res.redirect('/')
  }
  next()
});

app.get('/sign_out', function(req, res){
  req.session.access_token = ""
  console.log(req.session, 'successful sign out')
  res.redirect('/')
  //output sign out successful when that gets resolved
})

app.get('/authorize', function(req, res){
  var qs = {
    client_id: cfg.client_id,
    redirect_uri: cfg.redirect_uri,
    response_type: 'code'
  }

  var query = querystring.stringify(qs)
  var url = 'https://api.instagram.com/oauth/authorize/?' + query

  res.redirect(url)
})

app.get('/auth/finalize', function(req, res) {
  if (req.query.error == 'access_denied') {
    return res.redirect('/')
  }

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
    try {
    var data = JSON.parse(body)
  }
  catch(err) {
    return next(err)
  }
    req.session.access_token = data.access_token
    res.redirect('/dashboard')
  })
})

app.get('/', function(req, res) {
  res.render('index', {
		title: 'Login',
		layout: 'base',
    css: '\\CSS\\home.css'
  });
});

app.get('/dashboard', function(req, res, next) {
    var options = {
      url: 'https://api.instagram.com/v1/users/self/feed?access_token=' + req.session.access_token
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


app.get('/profile', function(req, res) {
	res.render('profile', {
		title: 'Profile',
    active_profile: "active",
		css: "\\CSS\\profile.css",
	});
});

app.get('/search', function(req, res){
	res.render('search', {
		title: 'Search',
		active_search: "active",
		css: "\\CSS\\search.css",
	});
});

app.post('/search', function(req, res){
  var tagName  = req.body.query;

  var options = {
    url: 'https://api.instagram.com/v1/tags' + tagName + '/media/recent?access_token' + req.session.access_token
  };

  request.get(options, function(error, response, body){
    console.log(body);
  });
  res.send('good post');
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        layout: 'base',
        message: err,
        error: {}
    });
});

app.listen(port);

console.log('Server running at http:127.0.0.1:' + port + '/')
