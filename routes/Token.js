// Louisa Katlubeck
// Routes for getting a token
// Sources: 

// Variable setup
const City = require('../models/City');
const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');

/*
// Source: https://auth0.com/docs/quickstart/backend/nodejs/01-authorization
// Authentication middleware. When used, the
// Access Token must exist and be verified against
// the Auth0 JSON Web Key Set
const checkJwt = jwt({
    // Dynamically provide a signing key
    // based on the kid in the header and 
    // the signing keys provided by the JWKS endpoint.
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://trip-planning.auth0.com/.well-known/jwks.json`
    }),
  
    // Validate the audience and the issuer.
    audience: 'https://trip-planning.auth0.com/api/v2/',
    issuer: `https://trip-planning.auth0.com/`,
    algorithms: ['RS256']
  });
  console.log(checkJwt);

// Source: https://auth0.com/docs/api-auth/tutorials/client-credentials
var request = require("request");

var options = { method: 'POST',
  url: 'https://trip-planning.auth0.com/oauth/token',
  headers: { 'content-type': 'application/json' },
  body: 
   { grant_type: 'client_credentials',
     client_id: 'iqpQtdJ0sVk83JDfswf2jV1W51YeMKie',
     client_secret: 'KynJitwG2oOLWiWCnP8J3Bj9oPxlWpMayCP7BomseiZ4bzH9gxcrodZBTXIo24mB',
     audience: 'https://trip-planning.auth0.com/api/v2/' },
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});

// POST token
router.post('/', (req, res) => {
    var mysql = req.app.get('mysql');
});
*/
router.get('/', (req, res) =>{
    res.json({"endpoint": "test"});
});

module.exports = router;