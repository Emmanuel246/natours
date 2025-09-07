const Tour = require("../models/tourModel");
const User = require("../models/userModel");
const Booking = require('../models/bookingModel');
const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();
  // 2) Build Template
  // 3) Render that template using tour data from 1)
  res.status(200).render("overview", {
    title: "All Tours",
    tours: tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user",
  });
  if (!tour) {
    return next(new AppError("There is no tour with that name.", 404));
  }
  // 2) Build template
  // 3) Re der template using data from 1)
  res
    .status(200)
    .set(
      "Content-Security-Policy",
      "default-src 'self' data: blob: https:; base-uri 'self'; block-all-mixed-content; font-src 'self' https: data:; frame-ancestors 'self'; img-src 'self' data: blob:; object-src 'none'; script-src 'self' https://cdnjs.cloudflare.com https://api.mapbox.com https://js.stripe.com 'unsafe-inline' blob: http://127.0.0.1:3000 http://localhost:3000; connect-src 'self' https://api.mapbox.com https://js.stripe.com http://127.0.0.1:3000 http://localhost:3000 ws:; style-src 'self' https: 'unsafe-inline'; upgrade-insecure-requests;",
    )
    .render("tour", {
      title: `${tour.title} Tour`,
      tour,
    });
});

exports.getLoginForm = catchAsync(async (req, res) => {
  res.status(200).render("login", {
    title: "Login Page",
  });
});

exports.getAccount = (req, res) => {
  res.status(200).render("account", {
    title: "Your Account",
  });
};


exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) find all bookings
      const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with the returned IDs
    const tourIDs = bookings.map((el) => el.tour);
    const tours = await Tour.find({ _id: { $in: tourIDs } });

    res.status(200).render('overview', {
      title: 'My Tours',
      tours,
    });
});

exports.updateUserData = catchAsync(async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      mew: true,
      runValidators: true,
    },
  );
  res.status(200).render("account", {
    user: updatedUser,
  });
});
