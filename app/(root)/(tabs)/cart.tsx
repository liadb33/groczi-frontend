import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import CartItem from '@/components/CartItem';
import SwipeDeleteItem from '@/components/SwipeDeleteItem';
import { LinearGradient } from 'expo-linear-gradient';
import { useCartStore } from '@/store';
import { useOptimizationStore } from '@/store';
import AppHeader from '@/components/header/AppHeader';
import CartItemShimmer from '@/components/ui/CartItemShimmer';
import ShimmerContainer from '@/components/ui/ShimmerContainer';

// --- Main Cart Screen Component ---
export default function CartScreen() {
  const router = useRouter();

  // State Management Placeholder
  const { cartItems, loadCart, incrementQuantity, decrementQuantity, removeFromCart, isLoading } = useCartStore(); 
  const { groceries, setGroceries } = useOptimizationStore();

  // Load cart items from API
  useEffect(() => {
    loadCart();
  }, []);
  
  const handleImagePress = (itemId: string) => {
    console.log('Image pressed for item:', itemId);
  };

  const handleCardPress = (item: CartItemType) => {
    router.push({
      pathname: "../groceryInfo",
      params: { id: item.itemCode }
    });
    console.log(`Navigating to grocery info for ${item.name}`);
  };

  const handleComparePrices = () => {
    setGroceries(cartItems.map(item => ({
      itemCode: item.itemCode,
      quantity: item.quantity,
      itemName: item.name
    })));
    router.push('../comparePrices');
  };

  // Render an individual cart item
  const renderCartItem = (item: CartItemType) => (
    <CartItem
      item={item}
      onIncrease={() => incrementQuantity(item.id)}
      onDecrease={() => decrementQuantity(item.id)}
      onImagePress={handleImagePress}
      onPress={handleCardPress}
    />
  );

  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-50">
        <AppHeader title="עגלה" />
        <ShimmerContainer 
          count={6}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <CartItemShimmer />
        </ShimmerContainer>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 ">
      <AppHeader title="עגלה" />

      {/* Cart Item List */}
      {cartItems.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-500">העגלה שלך ריקה.</Text>
        </View>
      ) : (
        <SwipeDeleteItem
          data={cartItems}
          renderItem={renderCartItem}
          onDelete={removeFromCart}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      {/* Floating Compare Prices Button */}
      {cartItems.length > 0 && (
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
