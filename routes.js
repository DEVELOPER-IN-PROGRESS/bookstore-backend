// import express
const express = require('express')
const userController = require('./controllers/userController');
const bookController = require('./controllers/bookController')
const jobController = require('./controllers/jobController')
const applicationController = require('./controllers/applicationController')
const jwtMiddleware = require('./middleware/jwtMiddleware');
//import multer config
const multerConfig = require('./middleware/imgMulterMiddleware');
//import pdf multer config
const pdfMulterConfig = require('./middleware/pdfMulter')

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

route.post('/apply-job',jwtMiddleware, pdfMulterConfig.single('resume'),
applicationController.addApplications)

route.get('/all-application', applicationController.getAllApplicationController)

// ========================== ADMIN API's ============================

// path for getting all books in the admin side
route.get('/admin-books',jwtMiddleware, bookController.getAllBookAdminController)


// path to approve a book
route.put('/approve-book',jwtMiddleware,bookController.approveBookController)

// path to get all the users from the database
route.get('/all-users',jwtMiddleware,userController.getAllUsersController)

// ====================  job controllers =========================

// path to add new jobs
route.post('/add-job', jobController.addJobsContoller);

route.get('/all-jobs', jobController.getAllJobsController)

//delete a job from the backend
route.delete('/delete-job/:id', jobController.deleteAJobController)

// route to apply for a job

route.post('/apply-job', applicationController.addApplications)


//routes exports
module.exports = route
