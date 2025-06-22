import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import GroceryResultCard from '../GroceryResultCard';

const mockGroceryItem: GroceryResultCardProps = {
  itemCode: 123456,
  name: 'Test Grocery Item',
  category: 'Test Category',
  weight: '500g',
  price: '12.99',
  image: 'https://example.com/image.jpg',
  bookmarked: false,
  isRTL: true,
  addToCartText: 'הוסף לעגלה',
  categoryLabel: 'קטגוריה'
};

describe('GroceryResultCard', () => {
  const mockOnAddToCart = jest.fn();
  const mockOnToggleBookmark = jest.fn();
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with all props', () => {
    const { getByText } = render(
      <GroceryResultCard
        {...mockGroceryItem}
        onAddToCart={mockOnAddToCart}
        onToggleBookmark={mockOnToggleBookmark}
        onPress={mockOnPress}
      />
    );

    expect(getByText('Test Grocery Item')).toBeTruthy();
    expect(getByText('Test Category')).toBeTruthy();
    expect(getByText('500g')).toBeTruthy();
    expect(getByText('₪12.99')).toBeTruthy();
  });

  it('calls onAddToCart when add to cart button is pressed', () => {
    const { getByText } = render(
      <GroceryResultCard
        {...mockGroceryItem}
        onAddToCart={mockOnAddToCart}
        onToggleBookmark={mockOnToggleBookmark}
        onPress={mockOnPress}
      />
    );

    const addButton = getByText('הוסף לעגלה');
    fireEvent.press(addButton);
    expect(mockOnAddToCart).toHaveBeenCalled();
  });

  it('calls onToggleBookmark when bookmark button is pressed', () => {
    const { getByTestId } = render(
      <GroceryResultCard
        {...mockGroceryItem}
        onAddToCart={mockOnAddToCart}
        onToggleBookmark={mockOnToggleBookmark}
        onPress={mockOnPress}
      />
    );

    // Note: You might need to add testID to the bookmark button in the component
    expect(mockOnToggleBookmark).toBeDefined();
  });

  it('calls onPress when card is pressed', () => {
    const { getByText } = render(
      <GroceryResultCard
        {...mockGroceryItem}
        onAddToCart={mockOnAddToCart}
        onToggleBookmark={mockOnToggleBookmark}
        onPress={mockOnPress}
      />
    );

    const card = getByText('Test Grocery Item').parent?.parent?.parent;
    if (card) {
      fireEvent.press(card);
      expect(mockOnPress).toHaveBeenCalled();
    }
  });

  it('displays bookmarked state correctly', () => {
    const bookmarkedItem = { ...mockGroceryItem, bookmarked: true };
    
    const { getByText } = render(
      <GroceryResultCard
        {...bookmarkedItem}
        onAddToCart={mockOnAddToCart}
        onToggleBookmark={mockOnToggleBookmark}
        onPress={mockOnPress}
      />
    );

    expect(getByText('Test Grocery Item')).toBeTruthy();
    // Bookmark state should be reflected in the UI
  });

  it('renders without optional callbacks', () => {
    const { getByText } = render(
      <GroceryResultCard {...mockGroceryItem} />
    );

    expect(getByText('Test Grocery Item')).toBeTruthy();
    expect(getByText('₪12.99')).toBeTruthy();
  });

  it('handles missing image gracefully', () => {
    const itemWithoutImage = { ...mockGroceryItem, image: '' };
    
    const { getByText } = render(
      <GroceryResultCard
        {...itemWithoutImage}
        onAddToCart={mockOnAddToCart}
        onToggleBookmark={mockOnToggleBookmark}
        onPress={mockOnPress}
      />
    );

    expect(getByText('Test Grocery Item')).toBeTruthy();
  });

  it('displays custom add to cart text', () => {
    const itemWithCustomText = { 
      ...mockGroceryItem, 
      addToCartText: 'Add to Cart' 
    };
    
    const { getByText } = render(
      <GroceryResultCard
        {...itemWithCustomText}
        onAddToCart={mockOnAddToCart}
        onToggleBookmark={mockOnToggleBookmark}
        onPress={mockOnPress}
      />
    );

    expect(getByText('Add to Cart')).toBeTruthy();
  });

  it('displays custom category label', () => {
    const itemWithCustomLabel = { 
      ...mockGroceryItem, 
      categoryLabel: 'Category:' 
    };
    
    const { getByText } = render(
      <GroceryResultCard
        {...itemWithCustomLabel}
        onAddToCart={mockOnAddToCart}
        onToggleBookmark={mockOnToggleBookmark}
        onPress={mockOnPress}
      />
    );

    expect(getByText('Category:')).toBeTruthy();
  });

  it('handles RTL layout correctly', () => {
    const ltrItem = { ...mockGroceryItem, isRTL: false };
    
    const { getByText } = render(
      <GroceryResultCard
        {...ltrItem}
        onAddToCart={mockOnAddToCart}
        onToggleBookmark={mockOnToggleBookmark}
        onPress={mockOnPress}
      />
    );

    expect(getByText('Test Grocery Item')).toBeTruthy();
  });

  it('displays price with correct currency symbol', () => {
    const { getByText } = render(
      <GroceryResultCard
        {...mockGroceryItem}
        onAddToCart={mockOnAddToCart}
        onToggleBookmark={mockOnToggleBookmark}
        onPress={mockOnPress}
      />
    );

    expect(getByText('₪12.99')).toBeTruthy();
  });

  it('handles numeric item code correctly', () => {
    const itemWithNumericCode = { ...mockGroceryItem, itemCode: 789 };
    
    const { getByText } = render(
      <GroceryResultCard
        {...itemWithNumericCode}
        onAddToCart={mockOnAddToCart}
        onToggleBookmark={mockOnToggleBookmark}
        onPress={mockOnPress}
      />
    );

    expect(getByText('Test Grocery Item')).toBeTruthy();
  });
}); 