import React from 'react';
import { View, Text } from 'react-native';

interface StoreItemInSolutionProps {
  item: {
    itemCode: string;
    itemName: string;
    quantity: number;
    price: number;
  };
}

const StoreItemInSolution: React.FC<StoreItemInSolutionProps> = ({ item }) => (
  <View className="flex-row justify-between items-center py-1 px-1">
    <Text className="text-base text-gray-800 font-medium ml-2">
      ₪{item.price.toFixed(2)}
    </Text>
    <Text
      className="text-base text-gray-700 flex-1 text-right"
      numberOfLines={1}
      ellipsizeMode="tail"
    >
      {item.itemName}
    </Text>
  </View>
);

export default StoreItemInSolution; 