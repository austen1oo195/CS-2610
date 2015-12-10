var express 	  = require('express')
var exphbs		  = require('express-handlebars')
var bodyParser  = require('body-parser')
var session     = require('express-session')
var path        = require('path') //needed for static path
var homeRoutes  = require('./Routes/homeRoutes.js')
var userRoutes  = require('./Routes/userRoutes.js')
var db          = require('./db')
var request     = require('request')
var port        = 3000;

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'auth_base'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public'))); //so it can find static files (like the css files)

app.use(session({
  cookieName: 'session',
  secret: 'alsdkfjaclskdjf',
  resave: false,
  saveUninitialized: true
  })
)

app.use('/', homeRoutes);
app.use('/user', userRoutes);

//middleware that catches errors. console.log()'s the error and redirects to home page '/'
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log(err)
    if(err == "The access_token provided is invalid."){
      res.redirect('/')
    }
    else{
      res.render('error', {
        layout: 'base',
        message: err
      })
    }
});

db.connect('mongodb://dbuser:password@ds033153.mongolab.com:33153/cs2610_app', function(err) {
  if (err) {
    console.log('Unable to connect to Mongo.')
    process.exit(1)
  } else {
    app.listen(3000, function() {
      console.log('Listening on port 3000...')
    })
  }
})
