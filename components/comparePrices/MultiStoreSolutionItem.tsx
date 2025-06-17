import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StoreInSolutionItem from './StoreInSolutionItem';

interface MultiStoreSolutionItemProps {
  solution: MultiStoreSolution;
  index: number;
  solutionKey: string;
  isExpanded: boolean;
  expandedStoresInSolution: { [key: string]: boolean };
  stores: Store[];
  onToggleSolutionExpansion: () => void;
  onToggleStoreExpansion: (storeKey: string) => void;
  onNavigateToStore?: (address: string) => void;
}

const MultiStoreSolutionItem: React.FC<MultiStoreSolutionItemProps> = ({
  solution,
  index,
  solutionKey,
  isExpanded,
  expandedStoresInSolution,
  stores,
  onToggleSolutionExpansion,
  onToggleStoreExpansion,
  onNavigateToStore,
}) => {
  if (!solution.assignments) return null; // Should not happen if backend filters correctly

  const storeNames = Object.keys(solution.assignments);

  return (
    <View className="bg-white mx-auto my-3 p-4 rounded-2xl shadow-lg w-[92%]">
      <TouchableOpacity
        onPress={onToggleSolutionExpansion}
        className="flex-row justify-between items-center pb-2"
      >
        <Ionicons
          name={
            isExpanded
              ? "chevron-up-circle-outline"
              : "chevron-down-circle-outline"
          }
          size={28}
          color="#2563EB"
        />
        <View className="flex-1 mx-3 items-end">
          <Text className="text-lg font-bold text-blue-600">
            🏆 האופציה הטובה ביותר #{index + 1}
          </Text>
          <Text className="text-2xl font-extrabold text-gray-800 mt-1">
            סה"כ: ₪{solution.item_cost.toFixed(2)}
          </Text>
          <Text className="text-sm text-gray-500">
            מרחק כולל וחזרה הביתה: {solution.travel_cost.toFixed(1)}{" "}
            ק״מ
          </Text>
        </View>
      </TouchableOpacity>

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
                onToggleExpansion={() => onToggleStoreExpansion(storeKey)}
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
    </View>
  );
};

export default MultiStoreSolutionItem; 