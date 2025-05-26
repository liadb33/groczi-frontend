import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StoreItemInSolution from './StoreItemInSolution';

interface StoreInSolutionItemProps {
  storeName: string;
  storeData: NonNullable<MultiStoreSolution['assignments']>[string];
  solutionKey: string;
  isExpanded: boolean;
  onToggleExpansion: () => void;
  onNavigate?: (address: string) => void;
}

const StoreInSolutionItem: React.FC<StoreInSolutionItemProps> = ({
  storeName,
  storeData,
  solutionKey,
  isExpanded,
  onToggleExpansion,
  onNavigate,
}) => {
  // Determine if items list needs to be scrollable
  const maxDisplayItems = 5; // Show 5 items before scrolling
  const needsScroll = storeData.items.length > maxDisplayItems;

  const handleNavigate = () => {
    if (onNavigate) {
      onNavigate(storeData.address);
    } else {
      console.log("Navigate to:", storeData.address);
    }
  };

  return (
    <View className="bg-white mb-2 p-3 rounded-xl border border-gray-200">
      <View className="flex-row items-center justify-between py-2">
        {/* Left: Chevron icon and Navigate icon */}
        <View className="flex-row items-center gap-x-2">
          <TouchableOpacity onPress={onToggleExpansion}>
            <Ionicons
              name={
                isExpanded ? "chevron-up-outline" : "chevron-down-outline"
              }
              size={24}
              color="#3B82F6"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNavigate}>
            <Ionicons
              name="navigate"
              size={20}
              color="#2563EB"
              className="ml-3"
            />
          </TouchableOpacity>
        </View>

        {/* Right: Store info */}
        <View className="flex-1 mr-3 items-end">
          <Text className="text-lg font-bold text-gray-800 text-right">
            {storeName}
          </Text>
          <Text className="text-sm text-gray-500 text-right">
            {storeData.address}
          </Text>
        </View>
      </View>

      {isExpanded && (
        <View className="mt-2 pl-2 pr-1">
          <Text className="text-md font-semibold text-gray-700 mb-1 text-right">
            מוצרים לקנייה:
          </Text>
          {needsScroll ? (
            <ScrollView
              style={{ maxHeight: 150 }}
              showsVerticalScrollIndicator={true}
              persistentScrollbar={true}
              nestedScrollEnabled={true}
            >
              {storeData.items.map(
                (
                  item: {
                    itemCode: string;
                    itemName: string;
                    quantity: number;
                    price: number;
                  },
                  idx: number
                ) => (
                  <StoreItemInSolution
                    key={`${item.itemCode}-${idx}`}
                    item={item}
                  />
                )
              )}
            </ScrollView>
          ) : (
            storeData.items.map(
              (
                item: {
                  itemCode: string;
                  itemName: string;
                  quantity: number;
                  price: number;
                },
                idx: number
              ) => (
                <StoreItemInSolution
                  key={`${item.itemCode}-${idx}`}
                  item={item}
                />
              )
            )
          )}
        </View>
      )}
    </View>
  );
};

export default StoreInSolutionItem; 