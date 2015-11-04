var express = require('express')
var exphbs = require('express-handlebars')
var bodyParser = require('body-parser')
var request = require('request')
var querystring = require('querystring')

var app = express()
var ACCESS_TOKEN = '2261696381.1677ed0.1992891961cf4e42830657329b06665c'
var CLIENT_ID = 'efb1cebf1061438c98a5a1b4e9c41ef4'
var CLIEND_SECRET = 'c46b3563f08349feb40cc6ed865b8582'
var REDIRECT_URI = 'http://localhost:3000/auth/finalize'

app.engine('handlebars', exphbs({defaultLayout: 'base'}))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({extended: false}))

app.get('/authorize', function(req, res){
  var qs = {
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code'
  }
  //client_id=2261696381.1677ed0.1992891961cf4e42830657329b06665c&http://localhost:3000/auth/finalize
  var query = querystring.stringify(qs)

  var url = 'https://api.instagram.com/oauth/authorize/?' + query

  res.redirect(url)
})

app.get('/auth/finalize', function(req, res){
  var post_data = {
    client_id: CLIENT_ID,
    client_secret: CLIEND_SECRET,
    redirect_uri: REDIRECT_URI,
    grant_type: 'authorization_code',
    code: req.query.code
  }

  var options = {
    url: 'https://api.instagram.com/oauth/access_token',
    form: post_data
  }

  request.post(options, function(error, response, body){
    var data = JSON.parse(body)
    ACCESS_TOKEN = data.access_token
    res.redirect('/feed')
  })
})

app.get('/feed', function(req, res){
  var options = {
    url: 'https://api.instagram.com/v1/users/self/feed?access_token=' + ACCESS_TOKEN
  }

  request.get(options, function(error, response, body){
    var feed = JSON .parse(body)

    res.render('feed', {
      feed: feed.data
    })
  })
})


app.listen(3000)
