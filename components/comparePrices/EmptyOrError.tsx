import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmptyOrErrorComponentProps {
  isLoading: boolean;
  error: string | null;
  groceries: CustomOptimizationItem[];
  userLatitude: number | null;
  userLongitude: number | null;
  selectedOption: string;
  singleStoreResult: any;
  multiStoreResult: any;
}

const EmptyOrErrorComponent: React.FC<EmptyOrErrorComponentProps> = ({
  isLoading,
  error,
  groceries,
  userLatitude,
  userLongitude,
  selectedOption,
  singleStoreResult,
  multiStoreResult,
}) => {
  if (isLoading) return null;

  if (error) {
    return (
      <View className="flex-1 justify-center items-center py-10 px-5">
        <Ionicons name="alert-circle-outline" size={48} color="red" />
        <Text className="text-red-500 text-lg text-center mt-2">Error: {error}</Text>
        <Text className="text-gray-600 text-center mt-1">Please try again later.</Text>
      </View>
    );
  }
  
  if (!groceries || groceries.length === 0) {
    return (
      <View className="flex-1 justify-center items-center py-10">
        <Ionicons name="cart-outline" size={48} color="#9CA3AF" />
        <Text className="text-gray-500 text-lg mt-2">Your cart is empty</Text>
        <Text className="text-gray-400 text-center mt-1">Add items to start comparing prices.</Text>
      </View>
    );
  }

  if (!userLatitude || !userLongitude) {
    return (
      <View className="flex-1 justify-center items-center py-10">
        <Ionicons name="location-outline" size={48} color="#9CA3AF" />
        <Text className="text-gray-500 text-lg mt-2">Location required</Text>
        <Text className="text-gray-400 text-center mt-1">Enable location services to find stores.</Text>
      </View>
    );
  }

  if (selectedOption === "חנות יחידה" && (!singleStoreResult || singleStoreResult.ranked_stores.length === 0)) {
    return (
      <View className="flex-1 justify-center items-center py-10 px-5">
        <Ionicons name="sad-outline" size={48} color="#9CA3AF" />
        <Text className="text-gray-600 text-lg text-center mt-2">No suitable stores found</Text>
        <Text className="text-gray-500 text-center mt-1">Try changing your preferences or product list.</Text>
      </View>
    );
  }

  if (selectedOption === "מספר חנויות" && (!multiStoreResult || multiStoreResult.solutions.length === 0)) {
    return (
      <View className="flex-1 justify-center items-center py-10 px-5">
        <Ionicons name="map-outline" size={48} color="#9CA3AF" />
        <Text className="text-gray-600 text-lg text-center mt-2">No multi-store solutions found</Text>
        <Text className="text-gray-500 text-center mt-1">Try increasing the distance limit or maximum number of stores.</Text>
      </View>
    );
  }

  return null; // Should not reach here if data is present
};

export default EmptyOrErrorComponent;
