describe('API Config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should export API_URL when environment variable is set', () => {
    process.env.EXPO_PUBLIC_API_URL = 'https://api.test.com';
    
    const { API_URL } = require('../config');
    
    expect(API_URL).toBe('https://api.test.com');
  });

  it('should throw error when API_URL environment variable is not set', () => {
    delete process.env.EXPO_PUBLIC_API_URL;
    
    expect(() => {
      require('../config');
    }).toThrow('API_URL is not defined');
  });
}); 