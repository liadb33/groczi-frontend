import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import SwipeDeleteItem from '@/components/ui/SwipeDeleteItem';
import GrocerySavedCard from '@/components/grocery/GrocerySavedCard';
import { useCartStore, useBookmarkStore } from '@/store';
import Toast from 'react-native-toast-message';
import { toastConfig } from '@/utils/toastConfig/toastConfig';
import AppHeader from '@/components/header/AppHeader';
import GroceryCardShimmer from '@/components/ui/GroceryCardShimmer';
import ShimmerContainer from '@/components/ui/ShimmerContainer';

export default function MyGroceriesScreen() {
  const { bookmarks, loadBookmarks, removeFromBookmarks, isLoading } = useBookmarkStore();
  const { addToCart, cartItems } = useCartStore(); 
  const [pendingAddItemCode, setPendingAddItemCode] = useState<string | null>(
    null
  );

  // Load bookmarks from API
  useEffect(() => {
    loadBookmarks();
  }, []);

  // Handler for navigating to the grocery info screen
  const handleCardPress = (item: SavedGroceryItemType) => {
    router.push({
      pathname: "../groceryInfo",
      params: { id: item.itemCode }
    });
    console.log(`Navigating to grocery info for ${item.itemName}`);
  };

  // Handler for back button
  const handleBackPress = () => {
    router.push("/");
    console.log("Navigating back to home");
  };

  // Create a render function for the grocery item to avoid inline JSX in props
  const renderGroceryItem = (item: SavedGroceryItemType) => (
    <GrocerySavedCard
      item={item}
      onAddToCart={() => handleAddToCart(item)}
      onImagePress={handleCardPress}
    />
  );

  
  const handleAddToCart = async (item: SavedGroceryItemType) => {
    if (item?.itemCode) {
      await addToCart(item.itemCode);
      setPendingAddItemCode(item.itemCode);
    }
  };

  useEffect(() => {
    if (pendingAddItemCode) {
      const found = cartItems.find(
        (item) => item.itemCode === pendingAddItemCode
      );
      if (found) {
        Toast.show({
          text1: found.quantity > 1 ? "המוצר כבר בעגלה" : "המוצר נוסף לעגלה",
          text2:
            found.quantity > 1 ? `כמות נוכחית: ${found.quantity}` : undefined,
          type: found.quantity > 1 ? "info" : "success",
          position: "bottom",
        });
        setPendingAddItemCode(null); // Reset for next add
      }
    }
  }, [cartItems, pendingAddItemCode]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-100">
        <AppHeader title="מוצרים שלי" onBackPress={handleBackPress} />
        <View className="flex-1 px-4">
          <ShimmerContainer 
            count={8}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <GroceryCardShimmer />
          </ShimmerContainer>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <AppHeader title="מוצרים שלי" onBackPress={handleBackPress} />

      <View className="flex-1 px-4">
        {bookmarks.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-lg text-gray-500 font-medium">
              אין מוצרים שמורים
            </Text>
          </View>
        ) : (
          <SwipeDeleteItem
            data={bookmarks}
            renderItem={renderGroceryItem}
            onDelete={removeFromBookmarks}
            keyExtractor={(item) => item.itemCode}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>

      <Toast config={toastConfig} />
    </View>
  );
}
