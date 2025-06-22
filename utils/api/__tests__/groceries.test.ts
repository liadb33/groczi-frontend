import {
  fetchAllGroceries,
  searchGroceries,
  fetchGroceryByItemCode,
  fetchStoresByGroceryItemCode,
  fetchGroceryPriceHistory
} from '../groceries';

// Mock the config
jest.mock('../config', () => ({
  API_URL: 'https://api.test.com'
}));

// Mock fetch globally
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('Groceries API', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('fetchAllGroceries', () => {
    it('should fetch groceries without parameters', async () => {
      const mockResponse = { groceries: [], totalPages: 1 };
      mockFetch.mockResolvedValueOnce({
        json: async () => mockResponse,
      } as Response);

      const result = await fetchAllGroceries();

      expect(mockFetch).toHaveBeenCalledWith('https://api.test.com/groceries?');
      expect(result).toEqual(mockResponse);
    });

    it('should fetch groceries with all filter parameters', async () => {
      const mockResponse = { groceries: [], totalPages: 1 };
      mockFetch.mockResolvedValueOnce({
        json: async () => mockResponse,
      } as Response);

      const params = {
        minPrice: 10,
        maxPrice: 50,
        company: 'Test Company',
        page: 2,
        limit: 20
      };

      await fetchAllGroceries(params);

      const expectedUrl = 'https://api.test.com/groceries?minPrice=10&maxPrice=50&company=Test+Company&page=2&limit=20';
      expect(mockFetch).toHaveBeenCalledWith(expectedUrl);
    });

    it('should handle partial parameters', async () => {
      const mockResponse = { groceries: [] };
      mockFetch.mockResolvedValueOnce({
        json: async () => mockResponse,
      } as Response);

      await fetchAllGroceries({ minPrice: 5, page: 1 });

      expect(mockFetch).toHaveBeenCalledWith('https://api.test.com/groceries?minPrice=5&page=1');
    });

    it('should handle zero values correctly', async () => {
      const mockResponse = { groceries: [] };
      mockFetch.mockResolvedValueOnce({
        json: async () => mockResponse,
      } as Response);

      await fetchAllGroceries({ minPrice: 0, maxPrice: 0 });

      expect(mockFetch).toHaveBeenCalledWith('https://api.test.com/groceries?minPrice=0&maxPrice=0');
    });
  });

  describe('searchGroceries', () => {
    it('should search with query and default pagination', async () => {
      const mockResponse = { results: [] };
      mockFetch.mockResolvedValueOnce({
        json: async () => mockResponse,
      } as Response);

      await searchGroceries('milk');

      expect(mockFetch).toHaveBeenCalledWith('https://api.test.com/groceries/search?q=milk&page=1&limit=10');
    });

    it('should search with custom pagination', async () => {
      const mockResponse = { results: [] };
      mockFetch.mockResolvedValueOnce({
        json: async () => mockResponse,
      } as Response);

      await searchGroceries('bread', 3, 25);

      expect(mockFetch).toHaveBeenCalledWith('https://api.test.com/groceries/search?q=bread&page=3&limit=25');
    });

    it('should handle special characters in search query', async () => {
      const mockResponse = { results: [] };
      mockFetch.mockResolvedValueOnce({
        json: async () => mockResponse,
      } as Response);

      await searchGroceries('café & tea');

      expect(mockFetch).toHaveBeenCalledWith('https://api.test.com/groceries/search?q=caf%C3%A9+%26+tea&page=1&limit=10');
    });
  });

  describe('fetchGroceryByItemCode', () => {
    it('should fetch grocery by item code', async () => {
      const mockGrocery = { itemCode: 'ABC123', name: 'Test Item' };
      mockFetch.mockResolvedValueOnce({
        json: async () => mockGrocery,
      } as Response);

      const result = await fetchGroceryByItemCode('ABC123');

      expect(mockFetch).toHaveBeenCalledWith('https://api.test.com/groceries/ABC123');
      expect(result).toEqual(mockGrocery);
    });

    it('should handle numeric item codes', async () => {
      const mockGrocery = { itemCode: '123456' };
      mockFetch.mockResolvedValueOnce({
        json: async () => mockGrocery,
      } as Response);

      await fetchGroceryByItemCode('123456');

      expect(mockFetch).toHaveBeenCalledWith('https://api.test.com/groceries/123456');
    });
  });

  describe('fetchStoresByGroceryItemCode', () => {
    it('should fetch stores with default pagination and no coordinates', async () => {
      const mockStores = { stores: [] };
      mockFetch.mockResolvedValueOnce({
        json: async () => mockStores,
      } as Response);

      await fetchStoresByGroceryItemCode('ABC123');

      expect(mockFetch).toHaveBeenCalledWith('https://api.test.com/groceries/ABC123/stores?page=1&limit=10');
    });

    it('should fetch stores with custom pagination', async () => {
      const mockStores = { stores: [] };
      mockFetch.mockResolvedValueOnce({
        json: async () => mockStores,
      } as Response);

      await fetchStoresByGroceryItemCode('ABC123', 2, 20);

      expect(mockFetch).toHaveBeenCalledWith('https://api.test.com/groceries/ABC123/stores?page=2&limit=20');
    });

    it('should fetch stores with user coordinates', async () => {
      const mockStores = { stores: [] };
      mockFetch.mockResolvedValueOnce({
        json: async () => mockStores,
      } as Response);

      await fetchStoresByGroceryItemCode('ABC123', 1, 10, 32.0853, 34.7818);

      const expectedUrl = 'https://api.test.com/groceries/ABC123/stores?page=1&limit=10&userLatitude=32.0853&userLongitude=34.7818';
      expect(mockFetch).toHaveBeenCalledWith(expectedUrl);
    });

    it('should not add coordinates if only one is provided', async () => {
      const mockStores = { stores: [] };
      mockFetch.mockResolvedValueOnce({
        json: async () => mockStores,
      } as Response);

      await fetchStoresByGroceryItemCode('ABC123', 1, 10, 32.0853, undefined);

      expect(mockFetch).toHaveBeenCalledWith('https://api.test.com/groceries/ABC123/stores?page=1&limit=10');
    });
  });

  describe('fetchGroceryPriceHistory', () => {
    it('should fetch price history for item code', async () => {
      const mockHistory = { 
        history: [
          { date: '2024-01-01', price: 10.5 },
          { date: '2024-01-02', price: 11.0 }
        ]
      };
      mockFetch.mockResolvedValueOnce({
        json: async () => mockHistory,
      } as Response);

      const result = await fetchGroceryPriceHistory('ABC123');

      expect(mockFetch).toHaveBeenCalledWith('https://api.test.com/groceries/ABC123/price-history');
      expect(result).toEqual(mockHistory);
    });
  });

  describe('Error handling', () => {
    it('should propagate fetch errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchAllGroceries()).rejects.toThrow('Network error');
    });

    it('should propagate JSON parsing errors', async () => {
      mockFetch.mockResolvedValueOnce({
        json: async () => {
          throw new Error('Invalid JSON');
        },
      } as unknown as Response);

      await expect(searchGroceries('test')).rejects.toThrow('Invalid JSON');
    });
  });
}); 