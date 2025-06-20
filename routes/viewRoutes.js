const express = require('express');
const viewRouter = express.Router();
const viewController = require("./../controllers/viewController");

viewRouter.get('/', viewController.getOverview);

viewRouter.get('/tour/:slug', viewController.getTour);

module.exports = viewRouter;