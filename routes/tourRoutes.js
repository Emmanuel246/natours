const express = require("express");
const tourController = require("./../controllers/tourController");
const authController = require("./../controllers/authController");
const reviewRouter = require("./../routes/reviewRoutes");
const router = require("./../routes/reviewRoutes");

const tourRouter = express.Router();

// tourRouter.param("id", tourController.checkID);

tourRouter.use("/:tourId/reviews", reviewRouter);

tourRouter
  .route("/top-5-cheap")
  .get(tourController.aliasTopTours, tourController.getAllTours);

tourRouter.route("/tour-stats").get(tourController.getTourStats);
tourRouter
  .route("/monthly-plan/:year")
  .get(
    authController.protect,
    authController.restrictTo("admin", "lead-guide", "guide"),
    tourController.getMonthlyPlan,
  );

tourRouter.route("/tours-within/:distance/center/:latlng/unit/:unit").get(tourController.getToursWithin);

tourRouter.route("/distances/:latlng/unit/:unit").get(tourController.getDistances);

tourRouter
  .route("/")
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.createTour,
  );
tourRouter
  .route("/:id")
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.updateTour,
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.deleteTour,
  );

module.exports = tourRouter;
