// Louisa Katlubeck
// Routes for City
// Sources: OSU CS290, OSU CS340, https://expressjs.com/en/guide/routing.html,
// https://stackoverflow.com/questions/19619936/how-to-separate-the-routes-and-models-from-app-js-using-nodejs-and-express,
// http://timjrobinson.com/how-to-structure-your-nodejs-models-2/, http://krakenjs.com/, https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4.
// https://stackoverflow.com/questions/39328295/what-does-mean-in-node-js, https://stackoverflow.com/questions/35864088/how-to-send-error-http-response-in-express-node-js

// Variable setup
const Restaurant = require('../models/Restaurant');
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

// POST restaurant
router.post('/', checkJwt, (req, res) => {
    var newRestaurant = new Restaurant(req.body);
    var mysql = req.app.get('mysql');
    console.log(newRestaurant);

    // CHECK TO SEE HOW THE CITY WILL BE INSERTED
    // Insert the restaurant into the db
    var sql = "INSERT INTO restaurant (name, self, type, city_id, visited, user_id) VALUES (?,?,?,?,?,?)";
    var inserts = [newRestaurant.name, newRestaurant.self, newRestaurant.type, newRestaurant.city_id, newRestaurant.visited, newRestaurant.user_id];
    sql = mysql.pool.query(sql, inserts, (error, results, fields) => {
        if (error) {
            console.log(error);
            return res.status(400).send({
                message: 'Error'
            });
        }
        else {
            res.json(req.body);
        }
    });
});

// GET a specific restaurant
router.get('/:id', checkJwt, (req, res) => {
    var myRestaurant = {};
    var mysql = req.app.get('mysql');
    console.log('the req.params.id is ');
    console.log(req.params.id);

    // get the specific user
    var mySub = req.user.sub;
    console.log(mySub);

    // get the parameters for the query
    var parameters = [req.params.id, mySub];

    mysql.pool.query("SELECT restaurant_id, name, self, type, city_id, visited, user_id FROM restaurant WHERE restaurant_id=? AND restaurant.user_id=(SELECT user_id FROM user WHERE user.sub=?)", parameters, (error, results, fields) => {
        if (error) {
            console.log(error);
            return res.status(400).send({
                message: error
            });
        }
        else {
            for (var i of results) {
                myRestaurant = new Restaurant(i);
            }
            // check to make sure a valid object was returned
            if (!myRestaurant.restaurant_id) {
                return res.status(400).send({
                    message: 'Invalid id'
                });
            }
            res.json(myRestaurant);
        }
    });
});

// DELETE a restaurant
router.delete('/:id', checkJwt, (req, res) => {
    var myRestaurant = {};
    var mysql = req.app.get('mysql');
    var myID = req.params.id;
    var sql;

    // delete the restaurant
    // get the specific user
    var mySub = req.user.sub;
    console.log(mySub);

    // get the parameters for the query
    var parameters = [req.params.id, mySub];
    console.log(parameters);

    // delete the restaurant
    sql = "DELETE FROM restaurant WHERE restaurant_id = ? AND restaurant.user_id=(SELECT user_id FROM user WHERE user.sub=?)";
    sql = mysql.pool.query(sql, parameters, (error, results, fields) => {
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

// Update a restaurant - PUT
router.put('/:id', checkJwt, (req, res) => {
    // get the specific user
    var mySub = req.user.sub;
    console.log(mySub);

    var mysql = req.app.get('mysql');

    var sql = "UPDATE restaurant SET name=?, type=?, city_id=?, visited=?, self=?, user_id=? WHERE restaurant_id=? AND restaurant.user_id=(SELECT user_id FROM user WHERE user.sub=?)";
    var inserts = [req.body.name, req.body.type, req.body.city_id, req.body.visited, req.body.self, req.body.user_id, req.params.id, mySub];
    console.log(req.body);
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