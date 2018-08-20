// Name: Louisa Katlubeck
// Description: Javascript file for the Trip Planning API
// Sources: https://auth0.com/docs/quickstart/backend/nodejs/01-authorization,
// https://github.com/auth0-samples/auth0-express-api-samples/tree/master/01-Authorization-RS256

// Variable set up
var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');
var app = express();
var router = express.Router();
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');
var request = require('request');
var request = require('request');
var Auth0Strategy = require('passport-auth0'),
    passport = require('passport');

var strategy = new Auth0Strategy({
    domain: 'trip-planning.auth0.com',
    clientID: 'iqpQtdJ0sVk83JDfswf2jV1W51YeMKie',
    clientSecret: 'KynJitwG2oOLWiWCnP8J3Bj9oPxlWpMayCP7BomseiZ4bzH9gxcrodZBTXIo24mB',
    callbackURL: 'https://travelplanning-212822.appspot.com/callback'
},
    function (accessToken, refreshToken, extraParams, profile, done) {
        // accessToken is the token to call Auth0 API (not needed in the most cases)
        // extraParams.id_token has the JSON Web Token
        // profile has all the information from the user
        return done(null, profile);
    }
);

passport.use(strategy);

var session = require('express-session');

//session-related stuff
var sess = {
 secret: 'SecretSauce',
 cookie: {},
 resave: false,
 saveUninitialized: true
};

app.use(session(sess));

var Auth0Strategy = require('passport-auth0'),
    passport = require('passport');

//passport-auth0
var strategy = new Auth0Strategy({
  domain: 'trip-planning.auth0.com',
  clientID: 'ZMdOpTKCX3up3paO5jzi1goS9gvrOkIb',
  clientSecret: 'KynJitwG2oOLWiWCnP8J3Bj9oPxlWpMayCP7BomseiZ4bzH9gxcrodZBTXIo24mB',
  callbackURL: 'https://travelplanning-212822.appspot.com/callback'
 },
 function(accessToken, refreshToken, extraParams, profile, done) {
   // accessToken is the token to call Auth0 API (not needed in the most cases)
   // extraParams.id_token has the JSON Web Token
   // profile has all the information from the user
   return done(null, profile);
 }
);

passport.use(strategy);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

app.use('/static', express.static('public'));
app.set('mysql', mysql);
app.set('port', process.argv[2] || 8080);

// Use bodyParser as middleware for post
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Create JSON parser
var jsonParse = bodyParser.json();

// Create the models
var City = require('./models/City');
var Restaurant = require('./models/Restaurant');
var Activity = require('./models/Activity');

// Create the routes
var cityRoute = require('./routes/City');
var restaurantRoute = require('./routes/Restaurant');
var activityRoute = require('./routes/Activity');
var weatherRoute = require('./routes/Weather');
var homeRoute = require('./routes/Home');
var tokenRoute = require('./routes/Token');

// Set up routes
app.use('/city', cityRoute);
app.use('/restaurant', restaurantRoute);
app.use('/activity', activityRoute);
app.use('/weather', weatherRoute);
app.use('/token', tokenRoute);
app.use('/', homeRoute);

// Set up 404, 403, and 500 errors
app.use(function (req, res) {
    res.status(404).send({
        message: err
    });
});

app.use(function (err, req, res) {
    console.error(err.stack);
    res.status(403).send({
        message: err
    });
});

app.use(function (err, req, res) {
    console.error(err.stack);
    res.status(500).send({
        message: err
    });
});

process.on('uncaughtException', function (err) {
    console.log(err);
});

// Run
app.listen(app.get('port'), function () {
    console.log('Express started on port ' + app.get('port') + '; press Ctrl-C to terminate.');
});