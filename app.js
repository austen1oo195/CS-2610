var express 	  = require('express')
var exphbs		  = require('express-handlebars')
var bodyParser  = require('body-parser')
var querystring = require('querystring')
var request     = require('request')
var session     = require('express-session')
var path        = require('path') //needed for static path
var cfg         = require('./config')
var router 	    = express.Router();
var port        = 3000

var app = express()

app.engine('handlebars', exphbs({defaultLayout: 'auth_base'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({extended: false}))

app.use(express.static(path.join(__dirname, 'public'))); //so it can find static files (like the css files)

app.use(session({
  cookieName: 'session',
  secret: 'alsdkfjaclskdjf',
  resave: false,
  saveUninitialized: true
}))

app.get('/sign_out', function(req, res){
  session.access_token = 0;
  console.log(';alskdfj')
  res.redirect('/')
  //output sign out successful when that gets resolved
})

app.get('/authorize', function(req, res){
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

app.get('/auth/finalize', function(req, res) {
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
    res.redirect('/dashboard')
  })
})

app.get('/', function(req, res) {
  res.render('index', {
		title: 'Login',
		layout: 'base',
    css: '\\CSS\\home.css'
  })
})

app.get('/dashboard', function(req, res) {
  res.render('dashboard', {
    active_dashboard: "active",
		css: "\\CSS\\image.css",
    title: 'Dashboard',
  })
})

app.get('/profile', function(req, res) {
	res.render('profile', {
		title: 'Profile',
    active_profile: "active",
		css: "\\CSS\\profile.css",
	})
})

app.get('/search', function(req, res){
	res.render('search', {
		title: 'Search',
		active_search: "active",
		css: "\\CSS\\search.css",
	})
})

app.post('/search', function(req, res){
  var tagName  = req.body.query

  var options = {
    url: 'https://api.instagram.com/v1/tags' + tagName + '/media/recent?access_token' + req.session.access_token
  }

  request.get(options, function(error, response, body){
    console.log(body)
  })
  res.send('good post')
})

app.listen(port)

console.log('Server running at http:127.0.0.1:' + port + '/')
