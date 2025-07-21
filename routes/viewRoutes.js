const express = require('express');
const viewRouter = express.Router();
const viewController = require("./../controllers/viewController");
const authController = require("./../controllers/authController");

// viewRouter.use();

viewRouter.get('/', authController.isLoggedIn, viewController.getOverview);

viewRouter.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);

viewRouter.get('/login', authController.isLoggedIn, viewController.getLoginForm);

viewRouter.get('/me', authController.protect, viewController.getAccount);

viewRouter.post('/submit-user-data', authController.protect, viewController.updateUserData);

module.exports = viewRouter;