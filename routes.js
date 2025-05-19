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

//path to get the books (the latest 4 books)
route.get('/all-home-book',bookController.getHomeBookController)

//path to add the books
//when we test in the frontend via the postman the uploadedImages key should be passed
route.post("/add-books",jwtMiddleware,multerConfig.array('uploadedImages',3) ,  bookController.addBookController)


// path to get all the books in the database
route.get('/all-books', jwtMiddleware,  bookController.getAllBookController) ;

//path to get a single book from the database
route.get('/view-book/:id', bookController.getSingleBookController );

//routes export
module.exports = route
