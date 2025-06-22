import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StoreInSolutionItem from './StoreInSolutionItem';

interface MultiStoreSolutionItemProps {
  solution: MultiStoreSolution;
  index: number;
  solutionKey?: string;
  isExpanded?: boolean;
  expandedStoresInSolution?: { [key: string]: boolean };
  stores?: Store[];
  onPress?: (solution: MultiStoreSolution, index: number) => void;
  onToggleSolutionExpansion?: () => void;
  onToggleStoreExpansion?: (storeKey: string) => void;
  onNavigateToStore?: (address: string) => void;
}

const MultiStoreSolutionItem: React.FC<MultiStoreSolutionItemProps> = ({
  solution,
  index,
  solutionKey = `solution-${index}`,
  isExpanded = false,
  expandedStoresInSolution = {},
  stores = [],
  onPress,
  onToggleSolutionExpansion,
  onToggleStoreExpansion,
  onNavigateToStore,
}) => {
  if (!solution.assignments) return null; // Should not happen if backend filters correctly

  const storeNames = Object.keys(solution.assignments);

  const handlePress = () => {
    if (onPress) {
      onPress(solution, index);
    }
  };

  const handleToggleSolution = () => {
    if (onToggleSolutionExpansion) {
      onToggleSolutionExpansion();
    }
  };

  return (
    <TouchableOpacity 
      className="bg-white mx-auto my-3 p-4 rounded-2xl shadow-lg w-[92%]"
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View className="flex-row justify-between items-center pb-2">
        <TouchableOpacity onPress={handleToggleSolution}>
          <Ionicons
            name={
              isExpanded
                ? "chevron-up-circle-outline"
                : "chevron-down-circle-outline"
            }
            size={28}
            color="#2563EB"
          />
        </TouchableOpacity>
        <View className="flex-1 mx-3 items-end">
          <Text className="text-lg font-bold text-blue-600">
            #{index + 1}
          </Text>
          <Text className="text-2xl font-extrabold text-gray-800 mt-1">
            ₪{solution.total_cost.toFixed(2)}
          </Text>
          <Text className="text-lg font-semibold text-green-600">
            ₪{solution.item_cost.toFixed(2)}
          </Text>
          <Text className="text-sm text-gray-500">
            ₪{solution.travel_cost.toFixed(2)}
          </Text>
          <Text className="text-sm text-gray-600 mt-1">
            {storeNames.length} {storeNames.length === 1 ? 'חנות' : 'חנויות'}
          </Text>
        </View>
      </View>

      {/* Store names display */}
      <View className="flex-row flex-wrap justify-end mt-2">
        {storeNames.map((storeName, idx) => (
          <Text key={idx} className="text-base font-semibold text-gray-700 ml-2">
            {storeName}
            {idx < storeNames.length - 1 && ','}
          </Text>
        ))}
      </View>

      {/* Items count per store */}
      <View className="flex-row flex-wrap justify-end mt-1">
        {storeNames.map((storeName, idx) => {
          const storeData = solution.assignments![storeName];
          const itemCount = storeData.items.length;
          return (
            <Text key={idx} className="text-sm text-gray-500 ml-2">
              {itemCount} {itemCount === 1 ? 'פריט' : 'פריטים'}
              {idx < storeNames.length - 1 && ' •'}
            </Text>
          );
        })}
      </View>

      {isExpanded && storeNames.length > 0 && (
        <View className="mt-3 border-t border-gray-200 pt-3">
          {storeNames.map((storeName) => {
            const storeData = solution.assignments![storeName];
            const storeKey = `${solutionKey}_${storeData.store_id}`;
            const isStoreExpanded = !!expandedStoresInSolution[storeKey];

            return (
              <StoreInSolutionItem
                key={storeData.store_id}
                storeName={storeName}
                storeData={storeData}
                solutionKey={solutionKey}
                isExpanded={isStoreExpanded}
                stores={stores}
                onToggleExpansion={() => onToggleStoreExpansion?.(storeKey)}
                onNavigate={onNavigateToStore}
              />
            );
          })}
        </View>
      )}
      {isExpanded && storeNames.length === 0 && (
        <Text className="text-center text-gray-500 py-4">
          אין חנויות בפתרון זה.
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default MultiStoreSolutionItem; 