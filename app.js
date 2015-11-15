var express 	  = require('express')
var exphbs		  = require('express-handlebars')
var bodyParser  = require('body-parser')
var session     = require('express-session')
var path        = require('path') //needed for static path
var homeRoutes  = require('./Routes/homeRoutes.js')
var userRoutes  = require('./Routes/userRoutes.js')
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
    res.redirect('/')
});

app.listen(port);

console.log('Server running at http:127.0.0.1:' + port + '/')
