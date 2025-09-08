const { body, param, query, validationResult } = require('express-validator');
const AppError = require('./appError');

// Validation error handler middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));
    
    return next(new AppError(`Validation failed: ${errorMessages.map(e => e.message).join(', ')}`, 400));
  }
  next();
};

// Common validation rules
const commonValidations = {
  email: body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
    
  password: body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    
  name: body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
    
  mongoId: param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
    
  positiveNumber: (field) => body(field)
    .isFloat({ min: 0 })
    .withMessage(`${field} must be a positive number`),
    
  requiredString: (field, min = 1, max = 255) => body(field)
    .trim()
    .isLength({ min, max })
    .withMessage(`${field} must be between ${min} and ${max} characters`),
};

// Tour validation schemas
const tourValidation = {
  create: [
    body('name')
      .trim()
      .isLength({ min: 10, max: 40 })
      .withMessage('Tour name must be between 10 and 40 characters'),
    body('duration')
      .isInt({ min: 1 })
      .withMessage('Duration must be a positive integer'),
    body('maxGroupSize')
      .isInt({ min: 1, max: 25 })
      .withMessage('Max group size must be between 1 and 25'),
    body('difficulty')
      .isIn(['easy', 'medium', 'difficult'])
      .withMessage('Difficulty must be easy, medium, or difficult'),
    body('price')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    body('summary')
      .trim()
      .isLength({ min: 10, max: 255 })
      .withMessage('Summary must be between 10 and 255 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 2000 })
      .withMessage('Description cannot exceed 2000 characters'),
    handleValidationErrors
  ],
  
  update: [
    commonValidations.mongoId,
    body('name')
      .optional()
      .trim()
      .isLength({ min: 10, max: 40 })
      .withMessage('Tour name must be between 10 and 40 characters'),
    body('duration')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Duration must be a positive integer'),
    body('maxGroupSize')
      .optional()
      .isInt({ min: 1, max: 25 })
      .withMessage('Max group size must be between 1 and 25'),
    body('difficulty')
      .optional()
      .isIn(['easy', 'medium', 'difficult'])
      .withMessage('Difficulty must be easy, medium, or difficult'),
    body('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    handleValidationErrors
  ]
};

// User validation schemas
const userValidation = {
  signup: [
    commonValidations.name,
    commonValidations.email,
    commonValidations.password,
    body('passwordConfirm')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }
        return true;
      }),
    handleValidationErrors
  ],
  
  login: [
    commonValidations.email,
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
    handleValidationErrors
  ],
  
  updateMe: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('email')
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    handleValidationErrors
  ],
  
  updatePassword: [
    body('passwordCurrent')
      .notEmpty()
      .withMessage('Current password is required'),
    commonValidations.password,
    body('passwordConfirm')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }
        return true;
      }),
    handleValidationErrors
  ]
};

// Review validation schemas
const reviewValidation = {
  create: [
    body('review')
      .trim()
      .isLength({ min: 10, max: 500 })
      .withMessage('Review must be between 10 and 500 characters'),
    body('rating')
      .isFloat({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    body('tour')
      .isMongoId()
      .withMessage('Invalid tour ID'),
    handleValidationErrors
  ],
  
  update: [
    commonValidations.mongoId,
    body('review')
      .optional()
      .trim()
      .isLength({ min: 10, max: 500 })
      .withMessage('Review must be between 10 and 500 characters'),
    body('rating')
      .optional()
      .isFloat({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    handleValidationErrors
  ]
};

// Query validation
const queryValidation = {
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    handleValidationErrors
  ],
  
  tourFilters: [
    query('difficulty')
      .optional()
      .isIn(['easy', 'medium', 'difficult'])
      .withMessage('Difficulty must be easy, medium, or difficult'),
    query('duration')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Duration must be a positive integer'),
    query('maxGroupSize')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Max group size must be a positive integer'),
    query('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    handleValidationErrors
  ]
};

module.exports = {
  handleValidationErrors,
  commonValidations,
  tourValidation,
  userValidation,
  reviewValidation,
  queryValidation
};
