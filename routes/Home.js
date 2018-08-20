// Louisa Katlubeck
// Routes for the home page, including authentication
// Description: js file that drives the Oauth authentication app
// Sources: https://developers.google.com/identity/protocols/OAuth2, 
// http://classes.engr.oregonstate.edu/eecs/spring2018/cs496/module-4/oauth-demo.html,
// https://github.com/jaredhanson/oauth2orize/issues/182,
// https://manage.auth0.com/#/applications/iqpQtdJ0sVk83JDfswf2jV1W51YeMKie/quickstart

const express = require('express');
const app = express();
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwks = require('jwks-rsa');
const router = express.Router();


module.exports = function () {
    var express = require('express');
    var router = express.Router();
    var randomstring = require('randomstring');
    var request = require('request');
    var Auth0Strategy = require('passport-auth0'),
        passport = require('passport');

    var strategy = new Auth0Strategy({
        domain: 'trip-planning.auth0.com',
        clientID: 'iqpQtdJ0sVk83JDfswf2jV1W51YeMKie',
        clientSecret: 'KynJitwG2oOLWiWCnP8J3Bj9oPxlWpMayCP7BomseiZ4bzH9gxcrodZBTXIo24mB',
        callbackURL: '/callback'
    },
        function (accessToken, refreshToken, extraParams, profile, done) {
            // accessToken is the token to call Auth0 API (not needed in the most cases)
            // extraParams.id_token has the JSON Web Token
            // profile has all the information from the user
            return done(null, profile, extraParams.id_token);
        }
    );

    passport.use(strategy);

// Source: https://auth0.com/docs/quickstart/backend/nodejs/01-authorization
    // Authentication middleware. When used, the
    // Access Token must exist and be verified against
    // the Auth0 JSON Web Key Set
    const checkJwt = jwt({
        // Dynamically provide a signing key
        // based on the kid in the header and 
        // the signing keys provided by the JWKS endpoint.
        secret: jwks.expressJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: `https://trip-planning.auth0.com/.well-known/jwks.json`
        }),

        // Validate the the issuer.
        issuer: `https://trip-planning.auth0.com/`,
        algorithms: ['RS256']
    });
    console.log(checkJwt);

    // will return the token
    router.get('/callback',
        passport.authenticate('auth0', { failureRedirect: '/login' }),
        function (req, res) {
            if (!req.user) {
                throw new Error('user null');
            }
            res.json({ 'jwt': req.authInfo });
        }
    );

    // will login
    router.get('/login',
        passport.authenticate('auth0', {}), function (req, res) {
            res.redirect("/");
        });

    // initial home screen
    router.get('/', function (req, res) {
        res.json({ 'instructions': 'Go to /login endpoint to log in' });
    });

    // test route to check the current user
    router.get('/test', checkJwt, function (req, res) {
        res.json({ "user": req.user});
        console.log(req.user);
        res.send(req.user);
    });

    return router;
}();