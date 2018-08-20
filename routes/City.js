// Louisa Katlubeck
// Routes for City
// Sources: OSU CS290, OSU CS340, https://expressjs.com/en/guide/routing.html,
// https://stackoverflow.com/questions/19619936/how-to-separate-the-routes-and-models-from-app-js-using-nodejs-and-express,
// http://timjrobinson.com/how-to-structure-your-nodejs-models-2/, http://krakenjs.com/, https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4.
// https://stackoverflow.com/questions/39328295/what-does-mean-in-node-js, https://stackoverflow.com/questions/35864088/how-to-send-error-http-response-in-express-node-js

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

// POST city
router.post('/', checkJwt, (req, res) => {
    var newCity = new City(req.body);
    var mysql = req.app.get('mysql');
    console.log(newCity);
    console.log(req.user);

    // Insert the city into the db
    var sql = "INSERT INTO city (name, self, visited, user_id) VALUES (?,?,?,?)";
    var inserts = [newCity.name, newCity.self, newCity.visited, newCity.user_id];
    console.log(inserts);
    sql = mysql.pool.query(sql, inserts, (error, results, fields) => {
        if (error) {
            console.log(error);
            return res.status(400).send({
                message: error
            });
        }
        else {
            res.json(req.body);
        }
    });
});

// GET a specific city
router.get('/:id', checkJwt, (req, res) => {
    var myCity = {};
    var mysql = req.app.get('mysql');
    console.log('the req.params.id is ');
    console.log(req.params.id);

    // get the specific user
    var mySub = req.user.sub;
    console.log(mySub);

    // get the parameters for the query
    var parameters = [req.params.id, mySub];
    
    mysql.pool.query('SELECT city_id, name, self, visited, user_id FROM city WHERE city.city_id=? AND city.user_id=(SELECT user_id FROM user WHERE user.sub=?)', parameters, (error, results, fields) => {
        console.log("in select city");
        console.log(results);
        
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
            console.log(myCity);
            res.json(myCity);
        }
    });
});

// DELETE a city
router.delete('/:id', checkJwt, (req, res) => {
    var myCity = {};
    var myRestaurant = {};
    var myActivity = {};
    var mysql = req.app.get('mysql');
    var sql;

    // delete the city
    // get the specific user
    var mySub = req.user.sub;
    console.log(mySub);

    // get the parameters for the query
    var parameters = [req.params.id, mySub];
    console.log(parameters);

    sql = "DELETE FROM city WHERE city_id=? AND city.user_id=(SELECT user_id FROM user WHERE user.sub=?)";
    mysql.pool.query(sql, parameters, (error, results, fields) => {
        if (error) {
            return res.status(400).send({
                message: error
            });
        }
        else {
            // check to make sure a row was deleted
            if (!(results.affectedRows||results.changedRows)) {
                return res.status(400).send({
                    message: 'Invalid id'
                });
            }
            else res.status(202).end();
        }
    });
});

// Update a city - PUT
router.put('/:id', checkJwt, (req, res) => {
    // get the specific user
    var mySub = req.user.sub;
    console.log(mySub);

    var mysql = req.app.get('mysql');
    var sql = "UPDATE city SET name=?, self=?, visited=?, user_id=? WHERE city_id=? AND city.user_id=(SELECT user_id FROM user WHERE user.sub=?)";
    var inserts = [req.body.name, req.body.self, req.body.visited, req.body.user_id, req.params.id, mySub];
    sql = mysql.pool.query(sql, inserts, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json(error);
        }
        else {
            // check to make sure a row was updated
            if (!(results.affectedRows||results.changedRows)) {
                return res.status(400).send({
                    message: 'Invalid id'
                });
            }
            res.status(200);
            res.end();
        }
    });
});

module.exports = router;