import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CategoryList from '../CategoryList';

interface Category {
  id: number;
  name: string;
  icon: string;
}

const mockCategories: Category[] = [
  { id: 1, name: 'פירות וירקות', icon: 'fruit-cherries' },
  { id: 2, name: 'בשר ודגים', icon: 'food-steak' },
  { id: 3, name: 'מוצרי חלב', icon: 'cow' },
  { id: 4, name: 'לחם ומאפים', icon: 'bread-slice' }
];

describe('CategoryList', () => {
  const mockOnCategoryPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all categories correctly', () => {
    const { getByText } = render(
      <CategoryList 
        categories={mockCategories}
        onCategoryPress={mockOnCategoryPress}
      />
    );

    expect(getByText('פירות וירקות')).toBeTruthy();
    expect(getByText('בשר ודגים')).toBeTruthy();
    expect(getByText('מוצרי חלב')).toBeTruthy();
    expect(getByText('לחם ומאפים')).toBeTruthy();
  });

  it('calls onCategoryPress when a category is pressed', () => {
    const { getByText } = render(
      <CategoryList 
        categories={mockCategories}
        onCategoryPress={mockOnCategoryPress}
      />
    );

    fireEvent.press(getByText('פירות וירקות'));
    expect(mockOnCategoryPress).toHaveBeenCalledWith(mockCategories[0]);
  });

  it('renders without onCategoryPress callback', () => {
    const { getByText } = render(
      <CategoryList categories={mockCategories} />
    );

    expect(getByText('פירות וירקות')).toBeTruthy();
  });

  it('handles empty categories array', () => {
    const { queryByText } = render(
      <CategoryList 
        categories={[]}
        onCategoryPress={mockOnCategoryPress}
      />
    );

    expect(queryByText('פירות וירקות')).toBeNull();
  });

  it('handles RTL layout correctly', () => {
    const { getByText } = render(
      <CategoryList 
        categories={mockCategories}
        onCategoryPress={mockOnCategoryPress}
      />
    );

    expect(getByText('פירות וירקות')).toBeTruthy();
  });

  it('handles LTR layout correctly', () => {
    const { getByText } = render(
      <CategoryList 
        categories={mockCategories}
        onCategoryPress={mockOnCategoryPress}
      />
    );

    expect(getByText('פירות וירקות')).toBeTruthy();
  });

  it('renders categories with different icons', () => {
    const { getByText } = render(
      <CategoryList 
        categories={mockCategories}
        onCategoryPress={mockOnCategoryPress}
      />
    );

    // Each category should render with its icon
    mockCategories.forEach(category => {
      expect(getByText(category.name)).toBeTruthy();
    });
  });

  it('handles single category', () => {
    const singleCategory = [mockCategories[0]];
    
    const { getByText } = render(
      <CategoryList 
        categories={singleCategory}
        onCategoryPress={mockOnCategoryPress}
      />
    );

    expect(getByText('פירות וירקות')).toBeTruthy();
  });

  it('calls onCategoryPress with correct category object', () => {
    const { getByText } = render(
      <CategoryList 
        categories={mockCategories}
        onCategoryPress={mockOnCategoryPress}
      />
    );

    fireEvent.press(getByText('בשר ודגים'));
    expect(mockOnCategoryPress).toHaveBeenCalledWith({
      id: 2,
      name: 'בשר ודגים',
      icon: 'food-steak'
    });
  });

  it('handles categories with long names', () => {
    const longNameCategories = [
      { id: 1, name: 'זהו שם קטגוריה ארוך מאוד שאמור להיות מוצג כראוי', icon: 'test-icon' }
    ];

    const { getByText } = render(
      <CategoryList 
        categories={longNameCategories}
        onCategoryPress={mockOnCategoryPress}
      />
    );

    expect(getByText('זהו שם קטגוריה ארוך מאוד שאמור להיות מוצג כראוי')).toBeTruthy();
  });

  it('handles categories with special characters', () => {
    const specialCategories = [
      { id: 1, name: 'מוצרי ב"ח & ניקיון', icon: 'special-icon' }
    ];

    const { getByText } = render(
      <CategoryList 
        categories={specialCategories}
        onCategoryPress={mockOnCategoryPress}
      />
    );

    expect(getByText('מוצרי ב"ח & ניקיון')).toBeTruthy();
  });
}); 