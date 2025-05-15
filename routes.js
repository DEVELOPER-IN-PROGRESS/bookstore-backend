// import express
const express = require('express')
const userController = require('./controllers/userController');
const bookController = require('./controllers/bookController')
const jwtMiddleware = require('./middleware/jwtMiddleware');
//import multer config
const multerConfig = require('./middleware/imgMulterMiddleware');

//create instance to access the class router in express
const route = new express.Router();

//1) path for register
route.post("/register", userController.registerController)

//path to login
route.post("/login",userController.loginController)

//path for google login
route.post("/google-login", userController.googleLoginController)

//path to add the books
//when we test in the frontend via the postman the uploadedImages key should be passed
route.post("/add-books",jwtMiddleware,multerConfig.array('uploadedImages',3) ,  bookController.addBookController)

//routes export
module.exports = route
