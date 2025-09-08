# Natours - Tour Booking Application

A comprehensive tour booking application built with Node.js, Express, MongoDB, and modern web technologies. This application provides a complete platform for browsing, booking, and managing nature tours.

## 🌟 Features

- **User Authentication & Authorization**: Secure JWT-based authentication with role-based access control
- **Tour Management**: Browse, search, and filter tours with advanced query capabilities
- **Booking System**: Complete booking workflow with Stripe payment integration
- **Review System**: Users can leave reviews and ratings for tours
- **Geospatial Queries**: Find tours within specified distances using MongoDB geospatial features
- **Image Upload**: Secure image upload and processing with Sharp
- **Email Notifications**: Automated email system for bookings and user actions
- **Security**: Comprehensive security measures including rate limiting, data sanitization, and CORS
- **Performance**: Optimized with compression, caching, and database indexing
- **Monitoring**: Health checks, logging, and error tracking

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Emmanuel246/natours.git
   cd natours
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp config.env.example config.env
   # Edit config.env with your configuration
   ```

4. **Start the application**

   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## 📋 Environment Variables

Create a `config.env` file based on `config.env.example`:

```env
NODE_ENV=development
PORT=3000
DATABASE=mongodb://localhost:27017/natours
JWT_SECRET=your-super-secure-jwt-secret
STRIPE_SECRET_KEY=your-stripe-secret-key
EMAIL_FROM=your-email@example.com
```

## 🐳 Docker Deployment

### Using Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Docker Build

```bash
# Build image
docker build -t natours .

# Run container
docker run -p 3000:3000 --env-file config.env natours
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/v1/users/signup` - User registration
- `POST /api/v1/users/login` - User login
- `GET /api/v1/users/logout` - User logout
- `POST /api/v1/users/forgotPassword` - Password reset request
- `PATCH /api/v1/users/resetPassword/:token` - Password reset

### Tour Endpoints

- `GET /api/v1/tours` - Get all tours (with filtering, sorting, pagination)
- `GET /api/v1/tours/:id` - Get single tour
- `POST /api/v1/tours` - Create tour (admin/lead-guide only)
- `PATCH /api/v1/tours/:id` - Update tour (admin/lead-guide only)
- `DELETE /api/v1/tours/:id` - Delete tour (admin/lead-guide only)

### Booking Endpoints

- `GET /api/v1/bookings` - Get all bookings (admin only)
- `POST /api/v1/bookings/checkout-session/:tourId` - Create checkout session
- `GET /api/v1/bookings/my-bookings` - Get user's bookings

## 🏗️ Architecture

```
natours/
├── controllers/          # Route handlers
├── models/              # Database models
├── routes/              # Route definitions
├── utils/               # Utility functions
├── views/               # Pug templates
├── public/              # Static assets
├── tests/               # Test files
├── logs/                # Application logs
└── config.env           # Environment variables
```

## 🔒 Security Features

- **Helmet**: Security headers
- **Rate Limiting**: Prevent brute force attacks
- **Data Sanitization**: NoSQL injection and XSS protection
- **CORS**: Cross-origin resource sharing configuration
- **JWT**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security

## 📊 Performance Optimizations

- **Compression**: Gzip compression for responses
- **Caching**: Static file caching with proper headers
- **Database Indexing**: Optimized database queries
- **Image Processing**: Sharp for efficient image handling
- **Connection Pooling**: MongoDB connection optimization

## 🔧 Development

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Database

```bash
# Import sample data
npm run data:import

# Delete all data
npm run data:delete
```

## 🚀 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure production database
- [ ] Set secure JWT secret
- [ ] Configure email service
- [ ] Set up SSL certificates
- [ ] Configure reverse proxy (Nginx)
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy

### Environment-Specific Configs

- **Development**: `config.env`
- **Production**: `config.env.production`
- **Testing**: Handled by test setup

## 📈 Monitoring

### Health Checks

- `GET /health` - Application health status
- `GET /ready` - Readiness probe (Kubernetes)
- `GET /live` - Liveness probe (Kubernetes)

### Logging

Logs are stored in the `logs/` directory:

- `error-YYYY-MM-DD.log` - Error logs
- `combined-YYYY-MM-DD.log` - All logs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Emmanuel Makanjuola** - _Initial work_ - [Emmanuel246](https://github.com/Emmanuel246)

## 🙏 Acknowledgments

- Built as part of Jonas Schmedtmann's Node.js course
- Thanks to the open-source community for the amazing tools and libraries
