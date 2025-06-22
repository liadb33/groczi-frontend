import {
  fetchCart,
  addCartItem,
  updateCartItemQuantity,
  removeCartItem,
  optimizeSingleStoreCart,
  optimizeMultiStoreCart
} from '../cart';

// Mock the config and deviceId
jest.mock('../config', () => ({
  API_URL: 'https://api.test.com'
}));

jest.mock('@/utils/deviceId/deviceId', () => ({
  getDeviceId: jest.fn(() => 'test-device-id')
}));

// Mock fetch globally
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('Cart API', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    jest.clearAllMocks();
  });

  describe('fetchCart', () => {
    it('should fetch cart with device ID header', async () => {
      const mockCart = { items: [], total: 0 };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCart,
      } as Response);

      const result = await fetchCart();

      expect(mockFetch).toHaveBeenCalledWith('https://api.test.com/me/cart', {
        headers: {
          'X-Device-ID': 'test-device-id',
        },
      });
      expect(result).toEqual(mockCart);
    });

    it('should handle fetch errors and log them', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: async () => 'Cart not found',
        json: async () => ({}),
      } as Response);

      await fetchCart();

      expect(consoleSpy).toHaveBeenCalledWith('Fetch failed with status', 404);
      expect(consoleSpy).toHaveBeenCalledWith('Response text:', 'Cart not found');
      
      consoleSpy.mockRestore();
    });
  });

  describe('addCartItem', () => {
    it('should add item to cart with correct payload', async () => {
      const mockResponse = { success: true, item: { id: '1' } };
      mockFetch.mockResolvedValueOnce({
        json: async () => mockResponse,
      } as Response);

      const result = await addCartItem('ABC123', 2);

      expect(mockFetch).toHaveBeenCalledWith('https://api.test.com/me/cart/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Device-ID': 'test-device-id',
        },
        body: JSON.stringify({ itemCode: 'ABC123', quantity: 2 }),
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle zero quantity', async () => {
      const mockResponse = { success: true };
      mockFetch.mockResolvedValueOnce({
        json: async () => mockResponse,
      } as Response);

      await addCartItem('ABC123', 0);

      expect(mockFetch).toHaveBeenCalledWith('https://api.test.com/me/cart/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Device-ID': 'test-device-id',
        },
        body: JSON.stringify({ itemCode: 'ABC123', quantity: 0 }),
      });
    });
  });

  describe('updateCartItemQuantity', () => {
    it('should update item quantity with correct payload', async () => {
      const mockResponse = { success: true };
      mockFetch.mockResolvedValueOnce({
        json: async () => mockResponse,
      } as Response);

      const result = await updateCartItemQuantity('item-1', 5);

      expect(mockFetch).toHaveBeenCalledWith('https://api.test.com/me/cart/items/item-1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Device-ID': 'test-device-id',
        },
        body: JSON.stringify({ quantity: 5 }),
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('removeCartItem', () => {
    it('should remove item from cart', async () => {
      const mockResponse = { success: true };
      mockFetch.mockResolvedValueOnce({
        json: async () => mockResponse,
      } as Response);

      const result = await removeCartItem('item-1');

      expect(mockFetch).toHaveBeenCalledWith('https://api.test.com/me/cart/items/item-1', {
        method: 'DELETE',
        headers: {
          'X-Device-ID': 'test-device-id',
        },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('optimizeSingleStoreCart', () => {
    it('should optimize single store cart with required params', async () => {
      const mockResponse = { optimizedCart: [] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const params = {
        userLatitude: 32.0853,
        userLongitude: 34.7818,
      };

      const result = await optimizeSingleStoreCart(params);

      expect(mockFetch).toHaveBeenCalledWith('https://api.test.com/me/cart/optimize-single-store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Device-ID': 'test-device-id',
        },
        body: JSON.stringify(params),
      });
      expect(result).toEqual(mockResponse);
    });

    it('should include optional parameters', async () => {
      const mockResponse = { optimizedCart: [] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const params = {
        userLatitude: 32.0853,
        userLongitude: 34.7818,
        costPerDistanceUnit: 2.5,
        lambdaTravel: 0.8,
        maxStoreDistance: 10,
      };

      await optimizeSingleStoreCart(params);

      expect(mockFetch).toHaveBeenCalledWith('https://api.test.com/me/cart/optimize-single-store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Device-ID': 'test-device-id',
        },
        body: JSON.stringify(params),
      });
    });

    it('should handle optimization errors', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => 'Invalid parameters',
      } as Response);

      await expect(optimizeSingleStoreCart({
        userLatitude: 32.0853,
        userLongitude: 34.7818,
      })).rejects.toThrow('Optimize single-store cart failed: Invalid parameters');

      expect(consoleSpy).toHaveBeenCalledWith('Optimize single-store cart failed with status', 400);
      expect(consoleSpy).toHaveBeenCalledWith('Response text:', 'Invalid parameters');
      
      consoleSpy.mockRestore();
    });
  });

  describe('optimizeMultiStoreCart', () => {
    it('should optimize multi-store cart with required params', async () => {
      const mockResponse = { optimizedSolutions: [] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const params = {
        userLatitude: 32.0853,
        userLongitude: 34.7818,
      };

      const result = await optimizeMultiStoreCart(params);

      expect(mockFetch).toHaveBeenCalledWith('https://api.test.com/me/cart/optimize-multi-store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Device-ID': 'test-device-id',
        },
        body: JSON.stringify(params),
      });
      expect(result).toEqual(mockResponse);
    });

    it('should include all optional parameters', async () => {
      const mockResponse = { optimizedSolutions: [] };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const params = {
        userLatitude: 32.0853,
        userLongitude: 34.7818,
        costPerDistanceUnit: 2.5,
        lambdaTravel: 0.8,
        maxStores: 3,
        maxTravelDistance: 20,
        maxStoreDistance: 10,
      };

      await optimizeMultiStoreCart(params);

      expect(mockFetch).toHaveBeenCalledWith('https://api.test.com/me/cart/optimize-multi-store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Device-ID': 'test-device-id',
        },
        body: JSON.stringify(params),
      });
    });

    it('should handle multi-store optimization errors', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'Server error',
      } as Response);

      await expect(optimizeMultiStoreCart({
        userLatitude: 32.0853,
        userLongitude: 34.7818,
      })).rejects.toThrow('Optimize multi-store cart failed: Server error');

      expect(consoleSpy).toHaveBeenCalledWith('Optimize multi-store cart failed with status', 500);
      expect(consoleSpy).toHaveBeenCalledWith('Response text:', 'Server error');
      
      consoleSpy.mockRestore();
    });
  });
}); 