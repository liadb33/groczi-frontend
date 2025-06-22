import { fetchBookmarks, addBookmark, removeBookmark } from '../bookmarks';

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

describe('Bookmarks API', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    jest.clearAllMocks();
  });

  describe('fetchBookmarks', () => {
    it('should fetch bookmarks with device ID header', async () => {
      const mockBookmarks = { bookmarks: [{ itemCode: 'ABC123', name: 'Test Item' }] };
      mockFetch.mockResolvedValueOnce({
        json: async () => mockBookmarks,
      } as Response);

      const result = await fetchBookmarks();

      expect(mockFetch).toHaveBeenCalledWith('https://api.test.com/me/bookmarks', {
        headers: {
          'X-Device-ID': 'test-device-id',
        },
      });
      expect(result).toEqual(mockBookmarks);
    });
  });

  describe('addBookmark', () => {
    it('should add bookmark with correct payload', async () => {
      const mockResponse = { success: true, bookmark: { itemCode: 'ABC123' } };
      mockFetch.mockResolvedValueOnce({
        json: async () => mockResponse,
      } as Response);

      const result = await addBookmark('ABC123');

      expect(mockFetch).toHaveBeenCalledWith('https://api.test.com/me/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Device-ID': 'test-device-id',
        },
        body: JSON.stringify({ itemCode: 'ABC123' }),
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('removeBookmark', () => {
    it('should remove bookmark with correct item code', async () => {
      const mockResponse = { success: true };
      mockFetch.mockResolvedValueOnce({
        json: async () => mockResponse,
      } as Response);

      const result = await removeBookmark('ABC123');

      expect(mockFetch).toHaveBeenCalledWith('https://api.test.com/me/bookmarks/ABC123', {
        method: 'DELETE',
        headers: {
          'X-Device-ID': 'test-device-id',
        },
      });
      expect(result).toEqual(mockResponse);
    });
  });
}); 