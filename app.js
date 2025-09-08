const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const compression = require("compression");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("./utils/logger");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const bookingRouter = require("./routes/bookingRoutes");
const viewRouter = require("./routes/viewRoutes");
const healthRouter = require("./routes/healthRoutes");
const { whitelist } = require("validator");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Trust proxy for accurate IP addresses (important for rate limiting)
app.set("trust proxy", 1);

//Global Middleware
// Compression middleware - compress all responses
app.use(compression());

// serving static files with caching
app.use(
  express.static(path.join(__dirname, "public"), {
    maxAge: process.env.NODE_ENV === "production" ? "1y" : "0",
    etag: true,
    lastModified: true,
  }),
);
// Security HTTP headers
// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'", "data:", "blob:", "https:", "ws:"],
//         baseUri: ["'self'"],
//         fontSrc: ["'self'", "https:", "data:"],
//         scriptSrc: [
//           "'self'",
//           "https:",
//           "http:",
//           "blob:",
//           "'unsafe-inline'",
//           "'unsafe-eval'",
//           "js.stripe.com",
//         ],
//         styleSrc: ["'self'", "https:", "'unsafe-inline'"],
//         imgSrc: ["'self'", "data:", "blob:"],
//         connectSrc: [
//           "'self'",
//           "blob:",
//           "https:",
//           "ws:",
//           "http://127.0.0.1:3000",
//           "http://localhost:3000",
//           "https://js.stripe.com",
//         ],
//         frameSrc: ["'self'", "https://js.stripe.com"],
//         childSrc: ["'self'", "blob:"],
//       },
//     },
//   }),
// );

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", "data:", "blob:", "https:", "ws:"],
        baseUri: ["'self'"],
        fontSrc: ["'self'", "https:", "data:"],
        scriptSrc: [
          "'self'",
          "https:",
          "http:",
          "blob:",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "https://js.stripe.com",
        ],
        styleSrc: ["'self'", "https:", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:"],
        connectSrc: [
          "'self'",
          "blob:",
          "https:",
          "ws:",
          "http://127.0.0.1:3000",
          "http://localhost:3000",
          "https://js.stripe.com",
          "https://api.stripe.com",
        ],
        frameSrc: [
          "'self'",
          "https://js.stripe.com",
          "https://checkout.stripe.com",
        ],
        childSrc: ["'self'", "blob:"],
      },
    },
  }),
);

// CORS Configuration - More restrictive for production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",")
      : ["http://localhost:3000", "http://127.0.0.1:3000"];

    if (process.env.NODE_ENV === "development") {
      return callback(null, true);
    }

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["X-Total-Count"],
  maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions));

// HTTP request logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined", { stream: logger.stream }));
}
// Rate limiting configuration
const limiter = rateLimit({
  max:
    parseInt(process.env.RATE_LIMIT_MAX) ||
    (process.env.NODE_ENV === "production" ? 50 : 100),
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60 * 60 * 1000, // 1 hour
  message: {
    error: "Too many requests from this IP, please try again later!",
    retryAfter: Math.ceil(
      (parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 3600000) / 1000,
    ),
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      status: "error",
      message: "Too many requests from this IP, please try again later!",
      retryAfter: Math.ceil(limiter.windowMs / 1000),
    });
  },
});

// Stricter rate limiting for authentication routes
const authLimiter = rateLimit({
  max: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: {
    error: "Too many authentication attempts, please try again later!",
    retryAfter: 900,
  },
  skipSuccessfulRequests: true,
});

app.use("/api", limiter);
app.use("/api/v1/users/signup", authLimiter);
app.use("/api/v1/users/login", authLimiter);
app.use("/api/v1/users/forgotPassword", authLimiter);
// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data Sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  }),
);

// Request timestamp middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Development debugging middleware
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log("Request Headers:", req.headers);
    next();
  });
}

// routes
// app.get("/api/v1/tours", getAllTours);
// app.get("/api/v1/tours/:id", getTour);
// app.post("/api/v1/tours", createTour);
// app.patch("/api/v1/tours/:id", updateTour);
// app.delete("/api/v1/tours/:id", deleteTour);

// Health check routes (should be before other routes)
app.use("/", healthRouter);

app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/bookings", bookingRouter);

app.all("/{*any}", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

// start server
module.exports = app;
