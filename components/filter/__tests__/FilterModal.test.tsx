import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FilterModal from '../FilterModal';

const mockCategories: string[] = [
  'פירות וירקות',
  'בשר ודגים', 
  'מוצרי חלב'
];

describe('FilterModal', () => {
  const mockOnClose = jest.fn();
  const mockOnReset = jest.fn();
  const mockToggleCategorySelection = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with correct title', () => {
    const { getByText } = render(
      <FilterModal
        isVisible={true}
        selectedCategories={[]}
        toggleCategorySelection={mockToggleCategorySelection}
        priceRange={{ min: 0, max: 100 }}
        selectedCompany=""
        onClose={mockOnClose}
        onReset={mockOnReset}
        availableCategories={mockCategories}
        filterTitle="סינון"
      />
    );

    expect(getByText('סינון')).toBeTruthy();
  });

  it('displays all categories for selection', () => {
    const { getByText } = render(
      <FilterModal
        isVisible={true}
        selectedCategories={[]}
        toggleCategorySelection={mockToggleCategorySelection}
        priceRange={{ min: 0, max: 100 }}
        selectedCompany=""
        onClose={mockOnClose}
        onReset={mockOnReset}
        availableCategories={mockCategories}
      />
    );

    expect(getByText('פירות וירקות')).toBeTruthy();
    expect(getByText('בשר ודגים')).toBeTruthy();
    expect(getByText('מוצרי חלב')).toBeTruthy();
  });

  it('shows apply filters button', () => {
    const { getByText } = render(
      <FilterModal
        isVisible={true}
        selectedCategories={[]}
        toggleCategorySelection={mockToggleCategorySelection}
        priceRange={{ min: 0, max: 100 }}
        selectedCompany=""
        onClose={mockOnClose}
        onReset={mockOnReset}
        availableCategories={mockCategories}
        applyButtonText="החל סינון"
      />
    );

    expect(getByText('החל סינון')).toBeTruthy();
  });

  it('shows reset filters button', () => {
    const { getByText } = render(
      <FilterModal
        isVisible={true}
        selectedCategories={[]}
        toggleCategorySelection={mockToggleCategorySelection}
        priceRange={{ min: 0, max: 100 }}
        selectedCompany=""
        onClose={mockOnClose}
        onReset={mockOnReset}
        availableCategories={mockCategories}
        resetButtonText="נקה סינון"
      />
    );

    expect(getByText('נקה סינון')).toBeTruthy();
  });

  it('calls onReset when reset button is pressed', () => {
    const { getByText } = render(
      <FilterModal
        isVisible={true}
        selectedCategories={[]}
        toggleCategorySelection={mockToggleCategorySelection}
        priceRange={{ min: 0, max: 100 }}
        selectedCompany=""
        onClose={mockOnClose}
        onReset={mockOnReset}
        availableCategories={mockCategories}
        resetButtonText="נקה סינון"
      />
    );

    fireEvent.press(getByText('נקה סינון'));
    expect(mockOnReset).toHaveBeenCalled();
  });

  it('toggles category selection when category is pressed', () => {
    const { getByText } = render(
      <FilterModal
        isVisible={true}
        selectedCategories={[]}
        toggleCategorySelection={mockToggleCategorySelection}
        priceRange={{ min: 0, max: 100 }}
        selectedCompany=""
        onClose={mockOnClose}
        onReset={mockOnReset}
        availableCategories={mockCategories}
      />
    );

    fireEvent.press(getByText('פירות וירקות'));
    expect(mockToggleCategorySelection).toHaveBeenCalledWith('פירות וירקות');
  });

  it('renders with pre-selected categories', () => {
    const { getByText } = render(
      <FilterModal
        isVisible={true}
        selectedCategories={['פירות וירקות']}
        toggleCategorySelection={mockToggleCategorySelection}
        priceRange={{ min: 0, max: 100 }}
        selectedCompany=""
        onClose={mockOnClose}
        onReset={mockOnReset}
        availableCategories={mockCategories}
      />
    );

    expect(getByText('פירות וירקות')).toBeTruthy();
  });

  it('handles empty categories array', () => {
    const { getByText } = render(
      <FilterModal
        isVisible={true}
        selectedCategories={[]}
        toggleCategorySelection={mockToggleCategorySelection}
        priceRange={{ min: 0, max: 100 }}
        selectedCompany=""
        onClose={mockOnClose}
        onReset={mockOnReset}
        availableCategories={[]}
        filterTitle="סינון"
      />
    );

    expect(getByText('סינון')).toBeTruthy();
  });

  it('does not render when not visible', () => {
    const { queryByText } = render(
      <FilterModal
        isVisible={false}
        selectedCategories={[]}
        toggleCategorySelection={mockToggleCategorySelection}
        priceRange={{ min: 0, max: 100 }}
        selectedCompany=""
        onClose={mockOnClose}
        onReset={mockOnReset}
        availableCategories={mockCategories}
        filterTitle="סינון"
      />
    );

    expect(queryByText('סינון')).toBeNull();
  });
}); 