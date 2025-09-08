const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const APIFeatures = require('../../utils/apiFeatures');

describe('AppError', () => {
  test('should create an operational error with correct properties', () => {
    const message = 'Test error message';
    const statusCode = 400;
    
    const error = new AppError(message, statusCode);
    
    expect(error.message).toBe(message);
    expect(error.statusCode).toBe(statusCode);
    expect(error.status).toBe('fail');
    expect(error.isOperational).toBe(true);
  });
  
  test('should set status to "error" for 5xx status codes', () => {
    const error = new AppError('Server error', 500);
    expect(error.status).toBe('error');
  });
  
  test('should set status to "fail" for 4xx status codes', () => {
    const error = new AppError('Client error', 404);
    expect(error.status).toBe('fail');
  });
});

describe('catchAsync', () => {
  test('should catch async errors and pass them to next', async () => {
    const mockNext = jest.fn();
    const mockReq = {};
    const mockRes = {};
    
    const asyncFunction = catchAsync(async (req, res, next) => {
      throw new Error('Test async error');
    });
    
    await asyncFunction(mockReq, mockRes, mockNext);
    
    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    expect(mockNext.mock.calls[0][0].message).toBe('Test async error');
  });
  
  test('should not call next if no error occurs', async () => {
    const mockNext = jest.fn();
    const mockReq = {};
    const mockRes = { json: jest.fn() };
    
    const asyncFunction = catchAsync(async (req, res, next) => {
      res.json({ success: true });
    });
    
    await asyncFunction(mockReq, mockRes, mockNext);
    
    expect(mockNext).not.toHaveBeenCalled();
    expect(mockRes.json).toHaveBeenCalledWith({ success: true });
  });
});

describe('APIFeatures', () => {
  let mockQuery;
  let queryString;
  
  beforeEach(() => {
    mockQuery = {
      find: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
    };
    
    queryString = {
      page: '2',
      limit: '10',
      sort: '-createdAt',
      fields: 'name,price',
      price: { gte: '100', lte: '500' }
    };
  });
  
  test('should filter query correctly', () => {
    const features = new APIFeatures(mockQuery, queryString);
    features.filter();
    
    expect(mockQuery.find).toHaveBeenCalledWith({
      price: { $gte: '100', $lte: '500' }
    });
  });
  
  test('should sort query correctly', () => {
    const features = new APIFeatures(mockQuery, queryString);
    features.sort();
    
    expect(mockQuery.sort).toHaveBeenCalledWith('-createdAt');
  });
  
  test('should limit fields correctly', () => {
    const features = new APIFeatures(mockQuery, queryString);
    features.limitFields();
    
    expect(mockQuery.select).toHaveBeenCalledWith('name price');
  });
  
  test('should paginate correctly', () => {
    const features = new APIFeatures(mockQuery, queryString);
    features.paginate();
    
    expect(mockQuery.skip).toHaveBeenCalledWith(10);
    expect(mockQuery.limit).toHaveBeenCalledWith(10);
  });
  
  test('should chain methods correctly', () => {
    const features = new APIFeatures(mockQuery, queryString);
    const result = features.filter().sort().limitFields().paginate();
    
    expect(result).toBeInstanceOf(APIFeatures);
    expect(mockQuery.find).toHaveBeenCalled();
    expect(mockQuery.sort).toHaveBeenCalled();
    expect(mockQuery.select).toHaveBeenCalled();
    expect(mockQuery.skip).toHaveBeenCalled();
    expect(mockQuery.limit).toHaveBeenCalled();
  });
});
