// Louisa Katlubeck
// Routes for Weather
// Sources: OSU CS290, OSU CS340, https://expressjs.com/en/guide/routing.html,
// https://stackoverflow.com/questions/19619936/how-to-separate-the-routes-and-models-from-app-js-using-nodejs-and-express,
// http://timjrobinson.com/how-to-structure-your-nodejs-models-2/, http://krakenjs.com/, https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4.
// https://stackoverflow.com/questions/39328295/what-does-mean-in-node-js, https://stackoverflow.com/questions/35864088/how-to-send-error-http-response-in-express-node-js
// API reference https://openweathermap.org/current
// Making an https call: https://www.twilio.com/blog/2017/08/http-requests-in-node-js.html

// Variable setup
const City = require('../models/City');
const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwks = require('jwks-rsa');
var request = require("request");

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

// GET weather for a specific city
router.get('/:id', checkJwt, (req, res) => {
    var myCity = {};
    var mysql = req.app.get('mysql');
    var key = '18e2e2fcd2daa15b6ec125ec698794e4';
    // the two parts of the id
    var firstPart = 'https://api.openweathermap.org/data/2.5/weather?q='; // + {city name}
    var secondPart = '&APPID=';
    var url;
    
    // get the specific user
    var mySub = req.user.sub;
    console.log(mySub);

    // get the parameters for the query
    var parameters = [req.params.id, mySub];

    mysql.pool.query("SELECT city_id, name FROM city WHERE city_id=? AND city.user_id=(SELECT user_id FROM user WHERE user.sub=?)", parameters, (error, results, fields) => {
        if (error) {
            console.log(error);
            return res.status(400).send({
                message: error
            });
        }
        else {
            for (var i of results) {
                myCity = new City(i);
            }
            // check to make sure a valid object was returned
            if (!myCity.city_id) {
                return res.status(400).send({
                    message: 'Invalid id'
                });
            }
            else {// make the url for the Open Weather Map API call
                url = firstPart + myCity.name + secondPart + key;
                var context = {};
                request(url, (err, response) => {
                    weather = response.body;
                    console.log(weather);
                    console.log(myCity);
                    context.name = myCity.name;
                    context.weather = weather;
                    res.json(context);
                })
            }
        }
    });
});


module.exports = router;