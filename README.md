README for trip planning API
Author: Louisa Katlubeck
Date: August 17, 2018

Introduction
The idea behind the API is to be able to track cities, restaurants, and activities that the user would be interested in visiting or has visited. Basic commands include POST, GET, PUT, and DELETE. Detailed trip planning API documentation and the supported endpoints can be found in the Final API Documentation.pdf document. 

Google App Engine and Amazon Web Services were used in the deployment of the application and the creation of the database schema. 

To Run 
Before running the code, npm install should be executed, and Node.js version 8 should also be installed. The main program is in main.js.

The URL for the API is  https://travelplanning-212822.appspot.com/, and requires one of the supported endpoints (as described in API Description.pdf). There is no home page. Users must be logged in in order to access any of the supported endpoints. The bearer token associated with the user account might need to be updated. To do so, go to the  https://travelplanning-212822.appspot.com/login endpoint (note that this page is a redirect based on the project setup using Auth0), and pick one of the two supported user accounts.

The two user accounts are:
User 1, email: user1@justtwonerds.com, password: user1password!
User 2, email: user2@justtwonerds.com, password: user2password!

A JSON web token will then be provided. This token will be used in Postman as a bearer token to authorize the endpoints. The token needs to be copied and pasted into the appropriate environment variable, either bearer_token_1 or bearer_token_2, depending on whether user 1 and user 2, respectively, was used to login.


