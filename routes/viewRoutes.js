const express = require('express');
const viewRouter = express.Router();
const viewController = require("./../controllers/viewController");
const authController = require("./../controllers/authController");
const bookingController = require('./../controllers/bookingController');

// viewRouter.use();

viewRouter.get('/', bookingController.createBookingCheckout, authController.isLoggedIn, viewController.getOverview);

viewRouter.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);

viewRouter.get('/login', authController.isLoggedIn, viewController.getLoginForm);

viewRouter.get('/me', authController.protect, viewController.getAccount);

viewRouter.post('/submit-user-data', authController.protect, viewController.updateUserData);

module.exports = viewRouter;