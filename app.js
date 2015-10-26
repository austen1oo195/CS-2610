var express 	= require('express')
	, exphbs		= require('express-handlebars')
  , port      = 3000
	, path = require('path') //needed for static path
	, router 	= express.Router();

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'base'}));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public'))); //so it can find static files (like the css files)

app.get('/', function(req, res) {
  res.render('index', {
		title: 'Login',
    welcome: 'Welcome to the site!'
  })
})

app.get('/dashboard', function(req, res) {
  res.render('dashboard', {
		active_dash: "active",
		layout: 'auth_base',
    title: 'Dashboard',
  })
})

app.listen(port)

console.log('Server running at http:127.0.0.1:' + port + '/')
