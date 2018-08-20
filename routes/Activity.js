// Louisa Katlubeck
// Routes for City
// Sources: OSU CS290, OSU CS340, https://expressjs.com/en/guide/routing.html,
// https://stackoverflow.com/questions/19619936/how-to-separate-the-routes-and-models-from-app-js-using-nodejs-and-express,
// http://timjrobinson.com/how-to-structure-your-nodejs-models-2/, http://krakenjs.com/, https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4.
// https://stackoverflow.com/questions/39328295/what-does-mean-in-node-js, https://stackoverflow.com/questions/35864088/how-to-send-error-http-response-in-express-node-js

// Variable setup
const Activity = require('../models/Activity');
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

// POST activity
router.post('/', checkJwt, (req, res) => {
    var newActivity = new Activity(req.body);
    var mysql = req.app.get('mysql');
    console.log(newActivity);

    // Insert the activity into the db
    var sql = "INSERT INTO activity (name, self, type, city_id, visited, user_id) VALUES (?,?,?,?,?,?)";
    var inserts = [newActivity.name, newActivity.self, newActivity.type, newActivity.city_id, newActivity.visited, newActivity.user_id];
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
/*
// GET all activities
router.get('/', checkJwt, (req, res) => {
    var myActivities = {};
    var allActivities = [];
    var mysql = req.app.get('mysql');

    mysql.pool.query("SELECT activity_id, name, self, type, city_id, visited, user_id FROM activity", req.params.id, (error, results, fields) => {
        if (error) {
            console.log(error);
            return res.status(400).send({
                message: error
            });
        }
        else {
            for (var i of results) {
                myActivity = new Activity(i);
                allActivities.push(myActivity);
            }
            res.json({ "activities": allActivities, "user": req.user });
        }
    });
});
*/
// GET a specific activity
router.get('/:id', checkJwt, (req, res) => {
    var myActivity = {};
    var mysql = req.app.get('mysql');
    console.log('the req.params.id is ');
    console.log(req.params.id);

    // get the specific user
    var mySub = req.user.sub;
    console.log(mySub);

    // get the parameters for the query
    var parameters = [req.params.id, mySub]

    mysql.pool.query("SELECT activity_id, name, self, type, city_id, visited, user_id FROM activity WHERE activity_id=? AND activity.user_id=(SELECT user_id FROM user WHERE user.sub=?)", parameters, (error, results, fields) => {
        if (error) {
            console.log(error);
            return res.status(400).send({
                message: error
            });
        }
        else {
            for (var i of results) {
                myActivity = new Activity(i);
            }
            // check to make sure a valid object was returned
            if (!myActivity.activity_id) {
                return res.status(400).send({
                    message: 'Invalid id'
                });
            }
            res.json(myActivity);
        }
    });
});

// DELETE an activity
router.delete('/:id', checkJwt, (req, res) => {
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

    sql = "DELETE FROM activity WHERE activity_id=? AND activity.user_id=(SELECT user_id FROM user WHERE user.sub=?)";
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

// Update an activity - PUT
router.put('/:id', checkJwt, (req, res) => {
    var mysql = req.app.get('mysql');

    // get the specific user
    var mySub = req.user.sub;
    console.log(mySub);

    var sql = "UPDATE activity SET name=?, self=?, type=?, city_id=?, visited=?, user_id=? WHERE activity_id=? AND activity.user_id=(SELECT user_id FROM user WHERE user.sub=?)";
    var inserts = [req.body.name, req.body.self, req.body.type, req.body.city_id, req.body.visited, req.body.user_id, req.params.id, mySub];
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