import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import AppHeader from '@/components/header/AppHeader';
import GroceryResultCard from '@/components/grocery/GroceryResultCard';
import { useGroceryStore, usePromotionsSummaryStore, useCartStore, useBookmarkStore } from '@/store';
import { useLocalSearchParams, router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { toastConfig } from '@/utils/toastConfig/toastConfig';

const GroceryResultsScreen = () => {
  const { 
    searchQuery, 
    promotionId, 
    chainId, 
    subChainId, 
    storeId 
  } = useLocalSearchParams<{ 
    searchQuery?: string;
    promotionId?: string;
    chainId?: string;
    subChainId?: string;
    storeId?: string;
  }>();

  const { groceriesResults, search, page, totalPages, isLoading: groceryLoading } = useGroceryStore();
  const { discountedGroceries, fetchDiscountedGroceries, isLoading: promotionLoading } = usePromotionsSummaryStore();
  const { addToCart, cartItems } = useCartStore();
  const { addToBookmarks, removeFromBookmarks, bookmarks } = useBookmarkStore();
  const [pendingAddItemCode, setPendingAddItemCode] = useState<string | null>(null);

  // Determine which mode we're in and what data to use
  const isSearchMode = !!searchQuery;
  const isPromotionMode = !!(promotionId && chainId && subChainId && storeId);
  const currentData = isSearchMode ? groceriesResults : discountedGroceries;
  const isLoading = isSearchMode ? groceryLoading : promotionLoading;

  // Load initial results when screen mounts or params change
  useEffect(() => {
    if (isSearchMode && searchQuery) {
      search(searchQuery, 1);
    } else if (isPromotionMode) {
      fetchDiscountedGroceries(promotionId!, chainId!, subChainId!, storeId!);
    }
  }, [searchQuery, promotionId, chainId, subChainId, storeId, search, fetchDiscountedGroceries, isSearchMode, isPromotionMode]);

  // Load more results on scroll (only for search mode since promotions don't have pagination)
  const loadMore = useCallback(() => {
    if (isSearchMode && !groceryLoading && page < totalPages && searchQuery) {
      search(searchQuery, page + 1);
    }
  }, [isSearchMode, groceryLoading, page, totalPages, searchQuery, search]);

  // Handler for adding items to cart
  const handleAddToCart = async (item: any) => {
    if (item?.itemCode) {
      await addToCart(item.itemCode);
      setPendingAddItemCode(item.itemCode);
    }
  };

  // Handler for toggling bookmark
  const handleToggleBookmark = async (item: any) => {
    if (!item?.itemCode) return;
    
    const isCurrentlyBookmarked = bookmarks.some(bookmark => bookmark.itemCode === item.itemCode);
    
    if (isCurrentlyBookmarked) {
      await removeFromBookmarks(item.itemCode);
      Toast.show({
        text1: "המוצר הוסר ממוצרים שלי",
        type: "info",
        position: "bottom",
      });
    } else {
      await addToBookmarks(item.itemCode);
      Toast.show({
        text1: "המוצר נוסף למוצרים שלי",
        type: "success",
        position: "bottom",
      });
    }
  };

  // Check if item is bookmarked
  const isItemBookmarked = (itemCode: string) => {
    return bookmarks.some(bookmark => bookmark.itemCode === itemCode);
  };

  // Handler for navigating to the grocery info screen
  const handlePress = (item: any) => {
    router.push({
      pathname: "../groceryInfo",
      params: { id: item.itemCode }
    });
    console.log(`Navigating to grocery info for ${item.itemName}`);
  };

  // Show toast notification when item is added to cart
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

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="large" color="#5382A6" />
      </View>
    );
  };

  // Determine header title based on mode
  const headerTitle = isSearchMode ? "תוצאות חיפוש" : "מוצרים במבצע";

  if (!isSearchMode && !isPromotionMode) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text>פרמטרים חסרים</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <AppHeader title={headerTitle} />

      {isPromotionMode && currentData.length === 0 && !isLoading ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600 text-lg">
           לא נמצאו מוצרים תחת קוד המבצע: {promotionId} 
          </Text>
        </View>
      ) : (
        <FlatList
          data={currentData}
          renderItem={({ item }) => (
            <GroceryResultCard
              key={item.itemCode}
              itemCode={Number(item.itemCode)}
              name={item.itemName || ""}
              category={item.category || ""}
              weight={item.unitQty || ""}
              price={item.price || ""}
              image={
                "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              }
              bookmarked={isItemBookmarked(item.itemCode.toString())}
              onPress={() => handlePress(item)}
              onAddToCart={() => handleAddToCart(item)}
              onToggleBookmark={() => handleToggleBookmark(item)}
            />
          )}
          keyExtractor={(item) => item.itemCode}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          onEndReached={isSearchMode ? loadMore : undefined}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          contentContainerStyle={{ paddingHorizontal: 10, paddingTop: 10 }}
        />
      )}
      
      <Toast config={toastConfig} />
    </View>
  );
};

export default GroceryResultsScreen;