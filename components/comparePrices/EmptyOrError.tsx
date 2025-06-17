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
        <Text className="text-red-500 text-lg text-center mt-2">שגיאה: {error}</Text>
        <Text className="text-gray-600 text-center mt-1">אנא נסה שוב מאוחר יותר.</Text>
      </View>
    );
  }
  
  if (!groceries || groceries.length === 0) {
    return (
      <View className="flex-1 justify-center items-center py-10">
        <Ionicons name="cart-outline" size={48} color="#9CA3AF" />
        <Text className="text-gray-500 text-lg mt-2">העגלה שלך ריקה</Text>
        <Text className="text-gray-400 text-center mt-1">הוסף מוצרים כדי להתחיל להשוות מחירים.</Text>
      </View>
    );
  }

  if (!userLatitude || !userLongitude) {
    return (
      <View className="flex-1 justify-center items-center py-10">
        <Ionicons name="location-outline" size={48} color="#9CA3AF" />
        <Text className="text-gray-500 text-lg mt-2">נדרש מיקום</Text>
        <Text className="text-gray-400 text-center mt-1">אפשר שירותי מיקום כדי למצוא חנויות.</Text>
      </View>
    );
  }

  if (selectedOption === "חנות יחידה" && (!singleStoreResult || singleStoreResult.ranked_stores.length === 0)) {
    return (
      <View className="flex-1 justify-center items-center py-10 px-5">
        <Ionicons name="sad-outline" size={48} color="#9CA3AF" />
        <Text className="text-gray-600 text-lg text-center mt-2">לא נמצאו חנויות מתאימות</Text>
        <Text className="text-gray-500 text-center mt-1">נסה לשנות את ההעדפות או רשימת המוצרים שלך.</Text>
      </View>
    );
  }

  if (selectedOption === "מספר חנויות" && (!multiStoreResult || multiStoreResult.solutions.length === 0)) {
    return (
      <View className="flex-1 justify-center items-center py-10 px-5">
        <Ionicons name="map-outline" size={48} color="#9CA3AF" />
        <Text className="text-gray-600 text-lg text-center mt-2">לא נמצאו פתרונות מרובי חנויות</Text>
        <Text className="text-gray-500 text-center mt-1">נסה להגדיל את מגבלת המרחק או מספר החנויות המקסימלי.</Text>
      </View>
    );
  }

  return null; // Should not reach here if data is present
};

export default EmptyOrErrorComponent;
