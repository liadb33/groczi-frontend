import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MultiStoreSolutionItem from '../MultiStoreSolutionItem';

const mockMultiStoreSolution: MultiStoreSolution = {
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
        },
        {
          itemCode: 'DEF456',
          itemName: 'Test Item 2', 
          quantity: 1,
          price: 15.50
        }
      ]
    },
    'Store B': {
      store_id: 'store-789',
      address: '456 Second St',
      latitude: 32.1000,
      longitude: 34.8000,
      chainId: 'chain-111',
      subChainId: 'subchain-222',
      city: 'Another City',
      items: [
        {
          itemCode: 'GHI789',
          itemName: 'Test Item 3',
          quantity: 3,
          price: 8.25
        }
      ]
    }
  },
  total_cost: 62.23,
  item_cost: 52.23,
  travel_cost: 10.00
};

describe('MultiStoreSolutionItem', () => {
  const mockOnPress = jest.fn();
  const mockOnNavigateToStore = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders solution costs correctly', () => {
    const { getByText } = render(
      <MultiStoreSolutionItem 
        solution={mockMultiStoreSolution}
        index={0}
        onPress={mockOnPress}
        onNavigateToStore={mockOnNavigateToStore}
      />
    );

    expect(getByText('₪62.23')).toBeTruthy();
    expect(getByText('₪52.23')).toBeTruthy(); 
    expect(getByText('₪10.00')).toBeTruthy();
  });

  it('displays solution index correctly', () => {
    const { getByText } = render(
      <MultiStoreSolutionItem 
        solution={mockMultiStoreSolution}
        index={2}
        onPress={mockOnPress}
        onNavigateToStore={mockOnNavigateToStore}
      />
    );

    expect(getByText('#3')).toBeTruthy();
  });

  it('shows number of stores involved', () => {
    const { getByText } = render(
      <MultiStoreSolutionItem 
        solution={mockMultiStoreSolution}
        index={0}
        onPress={mockOnPress}
        onNavigateToStore={mockOnNavigateToStore}
      />
    );

    expect(getByText('2 חנויות')).toBeTruthy();
  });

  it('displays store names correctly', () => {
    const { getByText } = render(
      <MultiStoreSolutionItem 
        solution={mockMultiStoreSolution}
        index={0}
        onPress={mockOnPress}
        onNavigateToStore={mockOnNavigateToStore}
      />
    );

    expect(getByText('Store A')).toBeTruthy();
    expect(getByText('Store B')).toBeTruthy();
  });

  it('shows items count per store', () => {
    const { getByText } = render(
      <MultiStoreSolutionItem 
        solution={mockMultiStoreSolution}
        index={0}
        onPress={mockOnPress}
        onNavigateToStore={mockOnNavigateToStore}
      />
    );

    expect(getByText('2 פריטים')).toBeTruthy(); // Store A
    expect(getByText('1 פריט')).toBeTruthy();   // Store B
  });

  it('calls onPress when solution card is pressed', () => {
    const { getByText } = render(
      <MultiStoreSolutionItem 
        solution={mockMultiStoreSolution}
        index={0}
        onPress={mockOnPress}
        onNavigateToStore={mockOnNavigateToStore}
      />
    );

    const solutionCard = getByText('₪62.23').parent?.parent?.parent;
    if (solutionCard) {
      fireEvent.press(solutionCard);
      expect(mockOnPress).toHaveBeenCalledWith(mockMultiStoreSolution, 0);
    }
  });

  it('calls onNavigateToStore when navigate button is pressed', () => {
    const { getAllByText } = render(
      <MultiStoreSolutionItem 
        solution={mockMultiStoreSolution}
        index={0}
        onPress={mockOnPress}
        onNavigateToStore={mockOnNavigateToStore}
      />
    );

    const navigateButtons = getAllByText('נווט');
    if (navigateButtons.length > 0) {
      fireEvent.press(navigateButtons[0]);
      expect(mockOnNavigateToStore).toHaveBeenCalled();
    }
  });

  it('renders without optional callbacks', () => {
    const { getByText } = render(
      <MultiStoreSolutionItem 
        solution={mockMultiStoreSolution}
        index={0}
      />
    );

    expect(getByText('₪62.23')).toBeTruthy();
  });

  it('handles single store solution', () => {
    const singleStoreSolution = {
      ...mockMultiStoreSolution,
      assignments: {
        'Single Store': mockMultiStoreSolution.assignments!['Store A']
      }
    };

    const { getByText } = render(
      <MultiStoreSolutionItem 
        solution={singleStoreSolution}
        index={0}
        onPress={mockOnPress}
        onNavigateToStore={mockOnNavigateToStore}
      />
    );

    expect(getByText('1 חנות')).toBeTruthy();
    expect(getByText('Single Store')).toBeTruthy();
  });

  it('handles zero travel cost', () => {
    const noTravelSolution = {
      ...mockMultiStoreSolution,
      travel_cost: 0
    };

    const { getByText } = render(
      <MultiStoreSolutionItem 
        solution={noTravelSolution}
        index={0}
        onPress={mockOnPress}
        onNavigateToStore={mockOnNavigateToStore}
      />
    );

    expect(getByText('₪0')).toBeTruthy();
  });

  it('handles high index numbers', () => {
    const { getByText } = render(
      <MultiStoreSolutionItem 
        solution={mockMultiStoreSolution}
        index={99}
        onPress={mockOnPress}
        onNavigateToStore={mockOnNavigateToStore}
      />
    );

    expect(getByText('#100')).toBeTruthy();
  });

  it('displays store addresses correctly', () => {
    const { getByText } = render(
      <MultiStoreSolutionItem 
        solution={mockMultiStoreSolution}
        index={0}
        onPress={mockOnPress}
        onNavigateToStore={mockOnNavigateToStore}
      />
    );

    expect(getByText('123 Main St')).toBeTruthy();
    expect(getByText('456 Second St')).toBeTruthy();
  });

  it('handles stores with no items gracefully', () => {
    const emptyStoreSolution = {
      ...mockMultiStoreSolution,
      assignments: {
        'Empty Store': {
          ...mockMultiStoreSolution.assignments!['Store A'],
          items: []
        }
      }
    };

    const { getByText } = render(
      <MultiStoreSolutionItem 
        solution={emptyStoreSolution}
        index={0}
        onPress={mockOnPress}
        onNavigateToStore={mockOnNavigateToStore}
      />
    );

    expect(getByText('0 פריטים')).toBeTruthy();
  });

  it('handles null assignments gracefully', () => {
    const nullAssignmentsSolution = {
      ...mockMultiStoreSolution,
      assignments: null
    };

    const { getByText } = render(
      <MultiStoreSolutionItem 
        solution={nullAssignmentsSolution}
        index={0}
        onPress={mockOnPress}
        onNavigateToStore={mockOnNavigateToStore}
      />
    );

    expect(getByText('₪62.23')).toBeTruthy();
    expect(getByText('0 חנויות')).toBeTruthy();
  });

  it('handles long store names correctly', () => {
    const longNameSolution = {
      ...mockMultiStoreSolution,
      assignments: {
        'זהו שם חנות ארוך מאוד שאמור להיות מוצג בצורה נכונה': mockMultiStoreSolution.assignments!['Store A']
      }
    };

    const { getByText } = render(
      <MultiStoreSolutionItem 
        solution={longNameSolution}
        index={0}
        onPress={mockOnPress}
        onNavigateToStore={mockOnNavigateToStore}
      />
    );

    expect(getByText('זהו שם חנות ארוך מאוד שאמור להיות מוצג בצורה נכונה')).toBeTruthy();
  });

  it('displays costs with correct precision', () => {
    const precisionSolution = {
      ...mockMultiStoreSolution,
      total_cost: 123.456,
      item_cost: 100.999,
      travel_cost: 22.457
    };

    const { getByText } = render(
      <MultiStoreSolutionItem 
        solution={precisionSolution}
        index={0}
        onPress={mockOnPress}
        onNavigateToStore={mockOnNavigateToStore}
      />
    );

    expect(getByText('₪123.46')).toBeTruthy();
    expect(getByText('₪101.00')).toBeTruthy();
    expect(getByText('₪22.46')).toBeTruthy();
  });
}); 