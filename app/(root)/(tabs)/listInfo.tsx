import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import CartItem from '@/components/CartItem';
import { useListDetailsStore } from '@/store';
import AppHeader from '@/components/header/AppHeader';
import { LinearGradient } from 'expo-linear-gradient';
import { useOptimizationStore } from '@/store';
export default function ListInfoScreen() {
  const router = useRouter();
  const { id, name } = useLocalSearchParams();
  const { setGroceries } = useOptimizationStore();
  
  const {
    id: listId,
    items,
    fetchList,
    updateItemQuantity,
  } = useListDetailsStore();

  useEffect(() => {
    if (typeof id === "string") {
      fetchList(id);
    }
    console.log(items);
  }, [id]);
  
  // Handlers
  const handleNavigateBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("./my-lists");
    }
  };

  const handleSettings = () => {
    // Implement settings functionality
    console.log('Open settings for list');
  };

  const handleImagePress = (itemId: string) => {
    // Could navigate to item details or show modal
    console.log(`Image pressed for item ${itemId}`);
  };

  const handleComparePrices = () => {
    setGroceries(
      items.map((item) => ({
        itemCode: item.itemCode,
        quantity: item.quantity,
        itemName: item.name,
      }))
    );
    router.push({
      pathname: '/comparePrices',
    });
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <View className="flex-1 bg-gray-50">
      <AppHeader
        title={name?.toString() || "רשימת קניות"}
        onBackPress={handleNavigateBack}
        onSettingsPress={handleSettings}
      />

      {/* List content */}
      {items.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-lg text-gray-600 font-medium text-center">
            אין מוצרים ברשימה זו
          </Text>
          <Text className="text-sm text-gray-500 text-center mt-2 mb-6">
            הוסף מוצרים כדי להתחיל לבנות את הרשימה שלך
          </Text>
          <TouchableOpacity
            onPress={handleGoHome}
            className="rounded-xl overflow-hidden"
          >
            <LinearGradient
              colors={["#2563EB", "#1D4ED8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              className="py-3 px-6 items-center justify-center rounded-xl"
            >
              <Text className="text-white text-base font-medium">
                חזור לעמוד הבית
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.itemCode}
          renderItem={({ item }) => (
            <CartItem
              item={item}
              onIncrease={() => updateItemQuantity(item.itemCode, 1)}
              onDecrease={() => updateItemQuantity(item.itemCode, -1)}
              onImagePress={handleImagePress}
            />
          )}
          contentContainerStyle={{ paddingVertical: 16 }}
        />
      )}

      {/* Floating Compare Prices Button */}
      {items.length > 0 && (
        <View className="absolute bottom-0 left-0 right-0 bg-white p-4 pt-2 border-t border-gray-200 pb-5">
          <TouchableOpacity
            onPress={handleComparePrices}
            className="rounded-full overflow-hidden"
          >
            <LinearGradient
              colors={["#2563EB", "#1D4ED8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              className="py-3 items-center justify-center rounded-full"
            >
              <Text className="text-white text-lg font-semibold">
                השוואת מחירים
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
