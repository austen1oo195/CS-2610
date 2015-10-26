var express 	= require('express')
	, exphbs		= require('express-handlebars')
  , port      = 3000
	, path = require('path') //needed for static path
	, router 	= express.Router();

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'auth_base'}));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public'))); //so it can find static files (like the css files)

app.get('/', function(req, res) {
  res.render('index', {
		title: 'Login',
		layout: base
  })
})

app.get('/dashboard', function(req, res) {
  res.render('dashboard', {
		active_dash: "active",
		css: "\\CSS\\kyler.css",
    title: 'Dashboard',
  })
})

app.get('/profile', function(req, res){
	res.render('profile', {
		active_profile: "active",
		css: "\\CSS\\profile.css",
		title: 'Profile'
	})
})

app.get('/search', function(req, res){
	res.render('search', {
		search_active: "active",
		css: "\\CSS\\search.css",
		title: 'Search'
	})
})

app.listen(port)

console.log('Server running at http:127.0.0.1:' + port + '/')
