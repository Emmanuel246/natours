const express = require('express');
const viewRouter = express.Router();
const viewController = require("./../controllers/viewController");
const authController = require("./../controllers/authController");

viewRouter.use(authController.isLoggedIn);

viewRouter.get('/', viewController.getOverview);

viewRouter.get('/tour/:slug', viewController.getTour);

viewRouter.get('/login', viewController.getLoginForm);

module.exports = viewRouter;