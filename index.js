
require('dotenv').config() // no need to create a variable as we don't use it later
//import express library
const express = require('express');
const cors = require('cors');
const route = require('./routes' );

//import db connection file
require('./databaseconnection');

//import application specific middleware
// const appMiddleware = require('./middleware/appMiddleware')

//create express server using express
const bookServer = express();

// the following order is important
bookServer.use(cors()); // connect the server with frontend using cors
// json is the common standard format of sharing data between the frontend and backend  (middleware) 
bookServer.use(express.json()); // pares JSON data , we use middleware

// the application specific request should pass through the app middleware before going to the routes
// bookServer.use(appMiddleware);  // we will use this later
// inorder to break all of the requests into logical operations we use a routes.js file 
bookServer.use(route)  // tell server to use route


// create/set the port
const PORT = 4000 || process.env.PORT

// listen to incoming requests
bookServer.listen(PORT,()=>{
	console.log(`server running successfully at port number ${PORT} `);
})



