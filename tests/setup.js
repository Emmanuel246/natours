const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// Setup test database before all tests
beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-purposes-only';
  process.env.JWT_EXPIRES_IN = '1d';
  
  // Start in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Connect to the in-memory database
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Clean up after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Cleanup after all tests
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

// Global test utilities
global.testUtils = {
  createTestUser: async (userData = {}) => {
    const User = require('../models/userModel');
    const defaultUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'testPassword123!',
      passwordConfirm: 'testPassword123!'
    };
    return await User.create({ ...defaultUser, ...userData });
  },
  
  createTestTour: async (tourData = {}) => {
    const Tour = require('../models/tourModel');
    const defaultTour = {
      name: 'Test Tour Name',
      duration: 5,
      maxGroupSize: 25,
      difficulty: 'easy',
      price: 497,
      summary: 'Test tour summary for testing purposes',
      description: 'Test tour description for testing purposes'
    };
    return await Tour.create({ ...defaultTour, ...tourData });
  }
};
