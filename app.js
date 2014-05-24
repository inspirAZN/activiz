
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/* Routes variables for files*/
var indexRoute = require('./routes/index');
var userRoute = require('./routes/user');
/* END Routes variables for files */

//load environment variables
var dotenv = require('dotenv');
dotenv.load();

// route includes


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));

//app.engine('html', require('hogan-express'));
//app.set('view engine', 'html');
app.set('view engine', 'mustache');
app.engine('mustache', require('hogan-middleware').__express);


//app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

/* Passport Config Use*/
app.use(express.cookieParser('secret'));
app.use(express.session());
app.use(passport.initialize());
app.use(passport.session());
/*END Passport Config Use*/

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/* Passport Config General */
var User = require('./models/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
/* END Passport Config General */

// Mongoose Connect DB
var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL;
mongoose.connect(mongoUri);

/* Routes */

//GET Requests
app.get('/',ensureAuthenticated,indexRoute.index);
app.get('/logout',ensureAuthenticated,userRoute.logout);
app.get('/signup',userRoute.signup);

// POST requests
app.post('/login',userRoute.login);
app.post('/confirmSignup',userRoute.saveUser);

/* END Routes */

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// Middleware to ensure if the user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.render('login');
}