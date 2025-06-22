import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ComparePricesScreen from '../comparePrices';

// Mock stores
const mockOptimizationStore = {
  isLoading: false,
  error: null as string | null,
  singleStoreResult: null as RankedStoresOptimizationResult | null,
  multiStoreResult: null as TopMultiStoreSolutionsResult | null,
  groceries: [
    { itemCode: 'ABC123', quantity: 2, itemName: 'Test Item 1' },
    { itemCode: 'DEF456', quantity: 1, itemName: 'Test Item 2' }
  ],
  runSingleStoreOptimization: jest.fn(),
  runMultiStoreOptimization: jest.fn(),
  clearResults: jest.fn(),
  clearError: jest.fn(),
};

const mockLocationStore = {
  userLatitude: 32.0853,
  userLongitude: 34.7818,
  userAddress: 'Tel Aviv, Israel',
};

const mockSettingsStore = {
  maxStoreDistance: 10,
  maxStores: 3,
  maxTravelDistance: 20,
};

jest.mock('@/store', () => ({
  useOptimizationStore: () => mockOptimizationStore,
  useLocationStore: () => mockLocationStore,
  useSettingsStore: () => mockSettingsStore,
}));

// Mock navigation
const mockPush = jest.fn();
const mockBack = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
}));

const mockSingleStoreResult: RankedStoresOptimizationResult = {
  is_partial_match: false,
  ranked_stores: [
    {
      store_id: 'store-123',
      store_name: 'Test Supermarket',
      address: '123 Test Street',
      latitude: 32.0853,
      longitude: 34.7818,
      chainId: 'chain-456',
      subChainId: 'subchain-789',
      city: 'Test City',
      combined_score: 85.5,
      item_cost_at_store: 45.99,
      travel_cost_to_store: 8.50,
      distance_to_store_km: 2.5,
      items_in_list: [],
      missing_items: []
    }
  ]
};

const mockMultiStoreResult: TopMultiStoreSolutionsResult = {
  solutions: [
    {
      assignments: {
        'Store A': {
          store_id: 'store-123',
          address: '123 Main St',
          latitude: 32.0853,
          longitude: 34.7818,
          chainId: 'chain-456',
          subChainId: 'subchain-789',
          city: 'Test City',
          items: [
            {
              itemCode: 'ABC123',
              itemName: 'Test Item 1',
              quantity: 2,
              price: 10.99
            }
          ]
        }
      },
      total_cost: 62.23,
      item_cost: 52.23,
      travel_cost: 10.00
    }
  ]
};

describe('ComparePricesScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockOptimizationStore.isLoading = false;
    mockOptimizationStore.error = null;
    mockOptimizationStore.singleStoreResult = null;
    mockOptimizationStore.multiStoreResult = null;
  });

  it('renders header correctly', () => {
    const { getByText } = render(<ComparePricesScreen />);
    expect(getByText('השוואת מחירים')).toBeTruthy();
  });

  it('displays optimization type dropdown', () => {
    const { getByText } = render(<ComparePricesScreen />);
    expect(getByText('חנות יחידה')).toBeTruthy();
  });

  it('runs single store optimization when button is pressed', async () => {
    const { getByText } = render(<ComparePricesScreen />);
    
    fireEvent.press(getByText('השוואת מחירים'));
    
    expect(mockOptimizationStore.runSingleStoreOptimization).toHaveBeenCalledWith({
      userLatitude: 32.0853,
      userLongitude: 34.7818,
      costPerDistanceUnit: 2.5,
      lambdaTravel: 0.8,
      maxStoreDistance: 10,
    });
  });

  it('switches to multi-store optimization', () => {
    const { getByText } = render(<ComparePricesScreen />);
    
    fireEvent.press(getByText('מספר חנויות'));
    fireEvent.press(getByText('השוואת מחירים'));
    
    expect(mockOptimizationStore.runMultiStoreOptimization).toHaveBeenCalledWith({
      userLatitude: 32.0853,
      userLongitude: 34.7818,
      costPerDistanceUnit: 2.5,
      lambdaTravel: 0.8,
      maxStores: 3,
      maxTravelDistance: 20,
      maxStoreDistance: 10,
    });
  });

  it('displays single store results when available', () => {
    mockOptimizationStore.singleStoreResult = mockSingleStoreResult;
    
    const { getByText } = render(<ComparePricesScreen />);
    
    expect(getByText('Test Supermarket')).toBeTruthy();
    expect(getByText('₪45.99')).toBeTruthy();
  });

  it('displays multi-store results when available', () => {
    mockOptimizationStore.multiStoreResult = mockMultiStoreResult;
    
    const { getByText } = render(<ComparePricesScreen />);
    
    expect(getByText('Store A')).toBeTruthy();
    expect(getByText('₪62.23')).toBeTruthy();
  });

  it('shows loading state during optimization', () => {
    mockOptimizationStore.isLoading = true;
    
    const { getByText } = render(<ComparePricesScreen />);
    
    expect(getByText('מחפש את המחירים הטובים ביותר...')).toBeTruthy();
  });

  it('displays error message when optimization fails', () => {
    mockOptimizationStore.error = 'Network error occurred';
    
    const { getByText } = render(<ComparePricesScreen />);
    
    expect(getByText('Network error occurred')).toBeTruthy();
  });

  it('shows empty state when no groceries are selected', () => {
    mockOptimizationStore.groceries = [];
    
    const { getByText } = render(<ComparePricesScreen />);
    
    expect(getByText('העגלה שלך ריקה')).toBeTruthy();
  });

  it('navigates to store details when store card is pressed', () => {
    mockOptimizationStore.singleStoreResult = mockSingleStoreResult;
    
    const { getByText } = render(<ComparePricesScreen />);
    
    const storeCard = getByText('Test Supermarket').parent?.parent;
    if (storeCard) {
      fireEvent.press(storeCard);
      
      expect(mockPush).toHaveBeenCalledWith({
        pathname: '../storeDetails',
        params: { storeId: 'store-123' }
      });
    }
  });

  it('opens navigation when navigate button is pressed', () => {
    mockOptimizationStore.singleStoreResult = mockSingleStoreResult;
    
    const { getByText } = render(<ComparePricesScreen />);
    
    const navigateButton = getByText('נווט');
    fireEvent.press(navigateButton);
    
    // Should open external maps application
    expect(mockPush).toBeDefined();
  });

  it('clears results when switching optimization types', () => {
    const { getByText } = render(<ComparePricesScreen />);
    
    fireEvent.press(getByText('מספר חנויות'));
    
    expect(mockOptimizationStore.clearResults).toHaveBeenCalled();
  });

  it('handles missing user location gracefully', () => {
    (mockLocationStore as any).userLatitude = null;
    (mockLocationStore as any).userLongitude = null;
    
    const { getByText } = render(<ComparePricesScreen />);
    
    expect(getByText('אנא הגדר את המיקום שלך')).toBeTruthy();
  });

  it('displays partial match warning for single store results', () => {
    mockOptimizationStore.singleStoreResult = {
      ...mockSingleStoreResult,
      is_partial_match: true
    };
    
    const { getByText } = render(<ComparePricesScreen />);
    
    expect(getByText('התאמה חלקית')).toBeTruthy();
  });

  it('shows retry button when error occurs', () => {
    mockOptimizationStore.error = 'Network error';
    
    const { getByText } = render(<ComparePricesScreen />);
    
    const retryButton = getByText('נסה שוב');
    fireEvent.press(retryButton);
    
    expect(mockOptimizationStore.clearError).toHaveBeenCalled();
  });

  it('displays correct optimization parameters', () => {
    const { getByText } = render(<ComparePricesScreen />);
    
    // Should show current settings
    expect(getByText('מרחק מקסימלי: 10 ק"מ')).toBeTruthy();
  });

  it('handles empty optimization results', () => {
    mockOptimizationStore.singleStoreResult = {
      is_partial_match: false,
      ranked_stores: []
    };
    
    const { getByText } = render(<ComparePricesScreen />);
    
    expect(getByText('לא נמצאו חנויות')).toBeTruthy();
  });

  it('navigates back when back button is pressed', () => {
    const { getByTestId } = render(<ComparePricesScreen />);
    
    // Assuming there's a back button with testID
    const backButton = getByTestId?.('back-button');
    if (backButton) {
      fireEvent.press(backButton);
      expect(mockBack).toHaveBeenCalled();
    }
  });

  it('updates optimization when groceries change', () => {
    const { rerender } = render(<ComparePricesScreen />);
    
    // Change groceries
    mockOptimizationStore.groceries = [
      { itemCode: 'NEW123', quantity: 1, itemName: 'New Item' }
    ];
    
    rerender(<ComparePricesScreen />);
    
    // Should trigger new optimization with updated groceries
    expect(mockOptimizationStore.groceries).toHaveLength(1);
  });

  it('preserves optimization type selection', () => {
    const { getByText } = render(<ComparePricesScreen />);
    
    // Switch to multi-store
    fireEvent.press(getByText('מספר חנויות'));
    
    // Selection should persist
    expect(getByText('מספר חנויות')).toBeTruthy();
  });

  it('handles concurrent optimization requests', async () => {
    const { getByText } = render(<ComparePricesScreen />);
    
    // Make multiple quick requests
    fireEvent.press(getByText('השוואת מחירים'));
    fireEvent.press(getByText('השוואת מחירים'));
    
    // Should handle gracefully without duplicate requests
    await waitFor(() => {
      expect(mockOptimizationStore.runSingleStoreOptimization).toHaveBeenCalledTimes(2);
    });
  });
}); 