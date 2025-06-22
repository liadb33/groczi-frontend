import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SingleStoreItemCard from '../SingleStoreItemCard';

const mockStoreEvaluation: SingleStoreEvaluation = {
  store_id: 'store-123',
  store_name: 'Test Supermarket',
  address: '123 Test Street, Test City',
  latitude: 32.0853,
  longitude: 34.7818,
  chainId: 'chain-456',
  subChainId: 'subchain-789',
  city: 'Test City',
  combined_score: 85.5,
  item_cost_at_store: 45.99,
  travel_cost_to_store: 8.50,
  distance_to_store_km: 2.5,
  items_in_list: [
    {
      itemCode: 'ABC123',
      itemName: 'Test Item 1',
      quantity: 2,
      priceAtThisStore: 10.99
    },
    {
      itemCode: 'DEF456', 
      itemName: 'Test Item 2',
      quantity: 1,
      priceAtThisStore: 24.01
    }
  ],
  missing_items: ['GHI789']
};

describe('SingleStoreItemCard', () => {
  const mockOnPress = jest.fn();
  const mockOnNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders store information correctly', () => {
    const { getByText } = render(
      <SingleStoreItemCard 
        store={mockStoreEvaluation}
        onPress={mockOnPress}
        onNavigate={mockOnNavigate}
      />
    );

    expect(getByText('Test Supermarket')).toBeTruthy();
    expect(getByText('123 Test Street, Test City')).toBeTruthy();
    expect(getByText('2.5 ק"מ')).toBeTruthy();
  });

  it('displays costs correctly', () => {
    const { getByText } = render(
      <SingleStoreItemCard 
        store={mockStoreEvaluation}
        onPress={mockOnPress}
        onNavigate={mockOnNavigate}
      />
    );

    expect(getByText('₪45.99')).toBeTruthy();
    expect(getByText('₪8.50')).toBeTruthy();
  });

  it('shows combined score', () => {
    const { getByText } = render(
      <SingleStoreItemCard 
        store={mockStoreEvaluation}
        onPress={mockOnPress}
        onNavigate={mockOnNavigate}
      />
    );

    expect(getByText('85.5')).toBeTruthy();
  });

  it('displays available items count', () => {
    const { getByText } = render(
      <SingleStoreItemCard 
        store={mockStoreEvaluation}
        onPress={mockOnPress}
        onNavigate={mockOnNavigate}
      />
    );

    expect(getByText('2 פריטים זמינים')).toBeTruthy();
  });

  it('shows missing items count when there are missing items', () => {
    const { getByText } = render(
      <SingleStoreItemCard 
        store={mockStoreEvaluation}
        onPress={mockOnPress}
        onNavigate={mockOnNavigate}
      />
    );

    expect(getByText('1 פריט חסר')).toBeTruthy();
  });

  it('does not show missing items when all items are available', () => {
    const storeWithAllItems = {
      ...mockStoreEvaluation,
      missing_items: []
    };

    const { queryByText } = render(
      <SingleStoreItemCard 
        store={storeWithAllItems}
        onPress={mockOnPress}
        onNavigate={mockOnNavigate}
      />
    );

    expect(queryByText('חסר')).toBeNull();
  });

  it('calls onPress when card is pressed', () => {
    const { getByText } = render(
      <SingleStoreItemCard 
        store={mockStoreEvaluation}
        onPress={mockOnPress}
        onNavigate={mockOnNavigate}
      />
    );

    const card = getByText('Test Supermarket').parent?.parent?.parent;
    if (card) {
      fireEvent.press(card);
      expect(mockOnPress).toHaveBeenCalledWith(mockStoreEvaluation);
    }
  });

  it('calls onNavigate when navigate button is pressed', () => {
    const { getByText } = render(
      <SingleStoreItemCard 
        store={mockStoreEvaluation}
        onPress={mockOnPress}
        onNavigate={mockOnNavigate}
      />
    );

    const navigateButton = getByText('נווט');
    fireEvent.press(navigateButton);
    expect(mockOnNavigate).toHaveBeenCalledWith(mockStoreEvaluation);
  });

  it('renders without optional callbacks', () => {
    const { getByText } = render(
      <SingleStoreItemCard store={mockStoreEvaluation} />
    );

    expect(getByText('Test Supermarket')).toBeTruthy();
  });

  it('handles zero distance correctly', () => {
    const nearbyStore = {
      ...mockStoreEvaluation,
      distance_to_store_km: 0
    };

    const { getByText } = render(
      <SingleStoreItemCard 
        store={nearbyStore}
        onPress={mockOnPress}
        onNavigate={mockOnNavigate}
      />
    );

    expect(getByText('0 ק"מ')).toBeTruthy();
  });

  it('handles high scores correctly', () => {
    const highScoreStore = {
      ...mockStoreEvaluation,
      combined_score: 98.7
    };

    const { getByText } = render(
      <SingleStoreItemCard 
        store={highScoreStore}
        onPress={mockOnPress}
        onNavigate={mockOnNavigate}
      />
    );

    expect(getByText('98.7')).toBeTruthy();
  });

  it('handles low scores correctly', () => {
    const lowScoreStore = {
      ...mockStoreEvaluation,
      combined_score: 15.2
    };

    const { getByText } = render(
      <SingleStoreItemCard 
        store={lowScoreStore}
        onPress={mockOnPress}
        onNavigate={mockOnNavigate}
      />
    );

    expect(getByText('15.2')).toBeTruthy();
  });

  it('displays zero costs correctly', () => {
    const freeTravelStore = {
      ...mockStoreEvaluation,
      travel_cost_to_store: 0,
      item_cost_at_store: 0
    };

    const { getByText } = render(
      <SingleStoreItemCard 
        store={freeTravelStore}
        onPress={mockOnPress}
        onNavigate={mockOnNavigate}
      />
    );

    expect(getByText('₪0')).toBeTruthy();
  });

  it('handles long store names', () => {
    const longNameStore = {
      ...mockStoreEvaluation,
      store_name: 'זהו שם חנות ארוך מאוד שאמור להיות מוצג כראוי'
    };

    const { getByText } = render(
      <SingleStoreItemCard 
        store={longNameStore}
        onPress={mockOnPress}
        onNavigate={mockOnNavigate}
      />
    );

    expect(getByText('זהו שם חנות ארוך מאוד שאמור להיות מוצג כראוי')).toBeTruthy();
  });

  it('handles long addresses', () => {
    const longAddressStore = {
      ...mockStoreEvaluation,
      address: 'זהו כתובת ארוכה מאוד עם הרבה פרטים על המיקום המדויק של החנות'
    };

    const { getByText } = render(
      <SingleStoreItemCard 
        store={longAddressStore}
        onPress={mockOnPress}
        onNavigate={mockOnNavigate}
      />
    );

    expect(getByText('זהו כתובת ארוכה מאוד עם הרבה פרטים על המיקום המדויק של החנות')).toBeTruthy();
  });

  it('handles multiple missing items', () => {
    const storeWithManyMissing = {
      ...mockStoreEvaluation,
      missing_items: ['GHI789', 'JKL012', 'MNO345']
    };

    const { getByText } = render(
      <SingleStoreItemCard 
        store={storeWithManyMissing}
        onPress={mockOnPress}
        onNavigate={mockOnNavigate}
      />
    );

    expect(getByText('3 פריטים חסרים')).toBeTruthy();
  });
}); 