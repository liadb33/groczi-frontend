import { renderHook, act } from '@testing-library/react-native';
import { useLocationStore, useCartStore, useBookmarkStore } from '../index';

// Mock API functions
jest.mock('@/utils/api/bookmarks');
jest.mock('@/utils/api/cart');
jest.mock('@/utils/api/lists');
jest.mock('@/utils/api/groceries');
jest.mock('@/utils/api/promotions');
jest.mock('@/utils/api/stores');
jest.mock('@/utils/api/optimization');
jest.mock('@/utils/api/categories');

const mockFetchCart = require('@/utils/api/cart').fetchCart;
const mockAddCartItem = require('@/utils/api/cart').addCartItem;
const mockRemoveCartItem = require('@/utils/api/cart').removeCartItem;
const mockUpdateCartItemQuantity = require('@/utils/api/cart').updateCartItemQuantity;
const mockFetchBookmarks = require('@/utils/api/bookmarks').fetchBookmarks;
const mockAddBookmark = require('@/utils/api/bookmarks').addBookmark;
const mockRemoveBookmark = require('@/utils/api/bookmarks').removeBookmark;

describe('Location Store', () => {
  beforeEach(() => {
    // Reset store state
    useLocationStore.setState({
      userLatitude: null,
      userLongitude: null,
      userAddress: null,
      destinationLatitude: null,
      destinationLongitude: null,
      destinationAddress: null,
      storeId: null,
      chainId: null,
      subChainId: null,
    });
  });

  it('should set user location correctly', () => {
    const { result } = renderHook(() => useLocationStore());

    act(() => {
      result.current.setUserLocation({
        latitude: 32.0853,
        longitude: 34.7818,
        address: 'Tel Aviv, Israel'
      });
    });

    expect(result.current.userLatitude).toBe(32.0853);
    expect(result.current.userLongitude).toBe(34.7818);
    expect(result.current.userAddress).toBe('Tel Aviv, Israel');
  });

  it('should set destination location with all parameters', () => {
    const { result } = renderHook(() => useLocationStore());

    act(() => {
      result.current.setDestinationLocation({
        latitude: 31.7683,
        longitude: 35.2137,
        address: 'Jerusalem, Israel',
        storeId: 'store-123',
        chainId: 'chain-456',
        subChainId: 'subchain-789'
      });
    });

    expect(result.current.destinationLatitude).toBe(31.7683);
    expect(result.current.destinationLongitude).toBe(35.2137);
    expect(result.current.destinationAddress).toBe('Jerusalem, Israel');
    expect(result.current.storeId).toBe('store-123');
    expect(result.current.chainId).toBe('chain-456');
    expect(result.current.subChainId).toBe('subchain-789');
  });

  it('should set partial destination location', () => {
    const { result } = renderHook(() => useLocationStore());

    act(() => {
      result.current.setDestinationLocation({
        storeId: 'store-123'
      });
    });

    expect(result.current.storeId).toBe('store-123');
    expect(result.current.destinationLatitude).toBeUndefined();
    expect(result.current.destinationLongitude).toBeUndefined();
  });
});

describe('Cart Store', () => {
  beforeEach(() => {
    // Reset store state
    useCartStore.setState({
      cartItems: [],
      isLoading: false,
    });
    jest.clearAllMocks();
  });

  describe('loadCart', () => {
    it('should load cart successfully', async () => {
      const mockCartData = {
        items: [
          {
            cartItemId: '1',
            itemCode: 'ABC123',
            name: 'Test Item',
            quantity: 2,
            subtotal: '21.00'
          }
        ]
      };

      mockFetchCart.mockResolvedValueOnce(mockCartData);

      const { result } = renderHook(() => useCartStore());

      await act(async () => {
        await result.current.loadCart();
      });

      expect(result.current.cartItems).toHaveLength(1);
      expect(result.current.cartItems[0]).toEqual({
        cartItemId: '1',
        itemCode: 'ABC123',
        name: 'Test Item',
        quantity: 2,
        subtotal: '21.00',
        id: '1',
        price: 21
      });
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle cart loading errors', async () => {
      mockFetchCart.mockRejectedValueOnce(new Error('Network error'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const { result } = renderHook(() => useCartStore());

      await act(async () => {
        await result.current.loadCart();
      });

      expect(result.current.cartItems).toHaveLength(0);
      expect(result.current.isLoading).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Failed to load cart:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });

  describe('addToCart', () => {
    it('should add new item to cart', async () => {
      const mockUpdatedCart = {
        items: [
          {
            cartItemId: '1',
            itemCode: 'ABC123',
            name: 'Test Item',
            quantity: 1,
            subtotal: '10.50'
          }
        ]
      };

      mockAddCartItem.mockResolvedValueOnce(mockUpdatedCart);

      const { result } = renderHook(() => useCartStore());

      await act(async () => {
        await result.current.addToCart('ABC123');
      });

      expect(mockAddCartItem).toHaveBeenCalledWith('ABC123', 1);
      expect(result.current.cartItems).toHaveLength(1);
    });

    it('should increment existing item quantity', async () => {
      const existingItem = {
        id: '1',
        itemCode: 'ABC123',
        name: 'Test Item',
        quantity: 1,
        subtotal: '10.50'
      };

      useCartStore.setState({ cartItems: [existingItem] });

      const mockUpdatedCart = {
        items: [
          {
            cartItemId: '1',
            itemCode: 'ABC123',
            name: 'Test Item',
            quantity: 2,
            subtotal: '21.00'
          }
        ]
      };

      mockUpdateCartItemQuantity.mockResolvedValueOnce(mockUpdatedCart);

      const { result } = renderHook(() => useCartStore());

      await act(async () => {
        await result.current.addToCart('ABC123');
      });

      expect(mockUpdateCartItemQuantity).toHaveBeenCalledWith('1', 1);
    });
  });

  describe('removeFromCart', () => {
    it('should remove item from cart', async () => {
      const mockUpdatedCart = { items: [] };
      mockRemoveCartItem.mockResolvedValueOnce(mockUpdatedCart);

      const { result } = renderHook(() => useCartStore());

      await act(async () => {
        await result.current.removeFromCart('item-1');
      });

      expect(mockRemoveCartItem).toHaveBeenCalledWith('item-1');
      expect(result.current.cartItems).toHaveLength(0);
    });
  });

  describe('decrementQuantity', () => {
    it('should remove item when quantity is 1', async () => {
      const existingItem = {
        id: '1',
        itemCode: 'ABC123',
        name: 'Test Item',
        quantity: 1,
        price: 10.50
      };

      useCartStore.setState({ cartItems: [existingItem] });

      const mockUpdatedCart = { items: [] };
      mockRemoveCartItem.mockResolvedValueOnce(mockUpdatedCart);

      const { result } = renderHook(() => useCartStore());

      await act(async () => {
        await result.current.decrementQuantity('1');
      });

      expect(mockRemoveCartItem).toHaveBeenCalledWith('1');
    });

    it('should decrement quantity when greater than 1', async () => {
      const existingItem = {
        id: '1',
        itemCode: 'ABC123',
        name: 'Test Item',
        quantity: 2,
        price: 21.00
      };

      useCartStore.setState({ cartItems: [existingItem] });

      const mockUpdatedCart = {
        items: [
          {
            cartItemId: '1',
            itemCode: 'ABC123',
            name: 'Test Item',
            quantity: 1,
            subtotal: '10.50'
          }
        ]
      };

      mockUpdateCartItemQuantity.mockResolvedValueOnce(mockUpdatedCart);

      const { result } = renderHook(() => useCartStore());

      await act(async () => {
        await result.current.decrementQuantity('1');
      });

      expect(mockUpdateCartItemQuantity).toHaveBeenCalledWith('1', -1);
    });
  });
});

describe('Bookmark Store', () => {
  beforeEach(() => {
    useBookmarkStore.setState({
      bookmarks: [],
      isLoading: false,
    });
    jest.clearAllMocks();
  });

  describe('loadBookmarks', () => {
    it('should load bookmarks successfully', async () => {
      const mockBookmarks = [
        { itemCode: 'ABC123', name: 'Test Item 1' },
        { itemCode: 'DEF456', name: 'Test Item 2' }
      ];

      mockFetchBookmarks.mockResolvedValueOnce(mockBookmarks);

      const { result } = renderHook(() => useBookmarkStore());

      await act(async () => {
        await result.current.loadBookmarks();
      });

      expect(result.current.bookmarks).toEqual(mockBookmarks);
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle bookmark loading errors', async () => {
      mockFetchBookmarks.mockRejectedValueOnce(new Error('Network error'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const { result } = renderHook(() => useBookmarkStore());

      await act(async () => {
        await result.current.loadBookmarks();
      });

      expect(result.current.bookmarks).toHaveLength(0);
      expect(result.current.isLoading).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Failed to load bookmarks:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });

  describe('addToBookmarks', () => {
    it('should add bookmark successfully', async () => {
      const mockUpdatedBookmarks = [
        { itemCode: 'ABC123', name: 'Test Item' }
      ];

      mockAddBookmark.mockResolvedValueOnce(mockUpdatedBookmarks);

      const { result } = renderHook(() => useBookmarkStore());

      await act(async () => {
        await result.current.addToBookmarks('ABC123');
      });

      expect(mockAddBookmark).toHaveBeenCalledWith('ABC123');
      expect(result.current.bookmarks).toEqual(mockUpdatedBookmarks);
    });
  });
}); 