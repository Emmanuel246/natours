const User = require("./../models/userModel");
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  // send response
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users: users,
    },
  });
  // Send Response
    res.status(500).json({
      status: "Error",
      message: "This route is not yet defined",
    });
  });
  
  exports.getUser = (req, res) => {
    res.status(500).json({
      status: "Error",
      message: "This route is not yet defined",
    });
  };
  
  exports.createUser = (req, res) => {
    res.status(500).json({
      status: "Error",
      message: "This route is not yet defined",
    });
  };
  
  exports.updateUser = (req, res) => {
    res.status(500).json({
      status: "Error",
      message: "This route is not yet defined",
    });
  };
  
  exports.deleteUser = (req, res) => {
    res.status(500).json({
      status: "Error",
      message: "This route is not yet defined",
    });
  }; 