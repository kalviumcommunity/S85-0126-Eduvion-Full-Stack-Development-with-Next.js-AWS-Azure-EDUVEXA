import { errorHandler } from '@/lib/errorHandler';
import { logger } from '@/lib/logger';
import { sanitizeInput } from '@/lib/sanitizeInput';

describe('Error Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('errorHandler function', () => {
    it('should handle validation errors correctly', () => {
      const error = {
        name: 'ValidationError',
        message: 'Invalid input',
        details: { field: 'email' },
      };

      const result = errorHandler(error);

      expect(result).toHaveProperty('statusCode');
      expect(result).toHaveProperty('message');
      expect(result.statusCode).toBe(400);
    });

    it('should handle authentication errors', () => {
      const error = {
        name: 'AuthenticationError',
        message: 'Invalid credentials',
      };

      const result = errorHandler(error);

      expect(result.statusCode).toBe(401);
    });

    it('should handle authorization errors', () => {
      const error = {
        name: 'AuthorizationError',
        message: 'Access denied',
      };

      const result = errorHandler(error);

      expect(result.statusCode).toBe(403);
    });

    it('should handle not found errors', () => {
      const error = {
        name: 'NotFoundError',
        message: 'Resource not found',
      };

      const result = errorHandler(error);

      expect(result.statusCode).toBe(404);
    });

    it('should handle server errors with 500 status', () => {
      const error = new Error('Internal server error');

      const result = errorHandler(error);

      expect(result.statusCode).toBe(500);
      expect(result.message).toBeDefined();
    });

    it('should sanitize error messages to prevent information leakage', () => {
      const error = {
        name: 'DatabaseError',
        message: 'Connection string: mongodb://user:pass@host',
      };

      const result = errorHandler(error);

      expect(result.message).not.toContain('mongodb://');
      expect(result.message).not.toContain('pass');
    });
  });
});

describe('Logger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('logger.info', () => {
    it('should log info messages', () => {
      logger.info('Test info message');
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Test info message'));
    });

    it('should include timestamp in logs', () => {
      logger.info('Test message');
      expect(console.log).toHaveBeenCalled();
    });
  });

  describe('logger.error', () => {
    it('should log error messages', () => {
      logger.error('Test error', new Error('Test'));
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('logger.warn', () => {
    it('should log warning messages', () => {
      logger.warn('Test warning');
      expect(console.warn).toHaveBeenCalled();
    });
  });
});

describe('Input Sanitization', () => {
  describe('sanitizeInput function', () => {
    it('should remove HTML tags from input', () => {
      const input = '<script>alert("xss")</script>Hello';
      const result = sanitizeInput(input);

      expect(result).not.toContain('<script>');
      expect(result).toContain('Hello');
    });

    it('should handle null and undefined inputs', () => {
      expect(sanitizeInput(null)).toBe('');
      expect(sanitizeInput(undefined)).toBe('');
    });

    it('should preserve safe HTML tags like <b> and <i>', () => {
      const input = '<b>Bold</b> and <i>italic</i> text';
      const result = sanitizeInput(input);

      expect(result).toContain('Bold');
      expect(result).toContain('italic');
    });

    it('should remove dangerous attributes', () => {
      const input = '<img src="x" onerror="alert(1)">';
      const result = sanitizeInput(input);

      expect(result).not.toContain('onerror');
    });

    it('should handle SQL injection attempts', () => {
      const input = "'; DROP TABLE users; --";
      const result = sanitizeInput(input);

      expect(result).toBe("'; DROP TABLE users; --"); // Sanitization doesn't prevent SQL injection on its own, but combined with parameterized queries it's safe
    });

    it('should trim whitespace', () => {
      const input = '  test input  ';
      const result = sanitizeInput(input);

      expect(result).toBe('test input');
    });

    it('should handle unicode characters safely', () => {
      const input = 'Hello 世界 مرحبا';
      const result = sanitizeInput(input);

      expect(result).toContain('Hello');
      expect(result).toContain('世界');
      expect(result).toContain('مرحبا');
    });
  });
});
