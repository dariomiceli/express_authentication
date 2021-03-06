const
	express = require('express'),
	app = express(),
	ejsLayouts = require('express-ejs-layouts'),
	mongoose = require('mongoose'),
	flash = require('connect-flash'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	MongoDBStore = require('connect-mongodb-session')(session),
	passport = require('passport'),
	passportConfig = require('./config/passport.js'),
	usersRouter = require('./routes/users.js')

// environment port
const
	port = process.env.PORT || 3000,
	mongoConnectionString = process.env.MONGODB_URL || 'mongodb://localhost/passport-authentication'

// mongoose connection
mongoose.connect(mongoConnectionString, (err) => {
	console.log(err || "Connected to MongoDB (passport-authentication)")
})

// will store session information as a 'sessions' collection in Mongo
const store = new MongoDBStore({
  uri: mongoConnectionString,
  collection: 'sessions'
});

// middleware
app.use(logger('dev'))
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(flash())

// ejs configuration
app.set('view engine', 'ejs')
app.use(ejsLayouts)
app.use(session({							// allows us to generate cookies based on passport configuration
	secret: "secretstring",
	cookie: {maxAge: 60000000},				// cookie is good for this long. will log out once expired
	resave: true,
	saveUninitialized: false,				// if someones not logged in, dont generate cookie
	store: store							// where do we keep cookies? server (mongo). check line 27
}))			

app.use(passport.initialize())
app.use(passport.session())

//root route
app.get('/', (req,res) => {
	res.render('index')
})

app.use('/users', usersRouter)

app.listen(port, (err) => {
	console.log(err || "Server running on port " + port)
})
