import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import AppHeader from '@/components/header/AppHeader';
import GroceryResultCard from '@/components/grocery/GroceryResultCard';
import { useGroceryStore, usePromotionsSummaryStore, useCartStore, useBookmarkStore, useCategoryStore } from '@/store';
import { useLocalSearchParams, router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { toastConfig } from '@/utils/toastConfig/toastConfig';
import { PLACEHOLDER_IMAGE } from '@/constants/Placeholders';
import GroceryResultCardShimmer from '@/components/ui/GroceryResultCardShimmer';
import ShimmerContainer from '@/components/ui/ShimmerContainer';

const GroceryResultsScreen = () => {
  const { 
    searchQuery, 
    promotionId, 
    chainId, 
    subChainId, 
    storeId,
    categoryName,
    categories,
    isMultiCategory
  } = useLocalSearchParams<{ 
    searchQuery?: string;
    promotionId?: string;
    chainId?: string;
    subChainId?: string;
    storeId?: string;
    categoryName?: string;
    categories?: string;
    isMultiCategory?: string;
  }>();

  const { groceriesResults, search, page, totalPages, isLoading: groceryLoading } = useGroceryStore();
  const { discountedGroceries, fetchDiscountedGroceries, isLoading: promotionLoading } = usePromotionsSummaryStore();
  const { groceries: categoryGroceries, fetchGroceriesByCategory, page: categoryPage, totalPages: categoryTotalPages, isLoading: categoryLoading } = useCategoryStore();
  const { addToCart, cartItems } = useCartStore();
  const { addToBookmarks, removeFromBookmarks, bookmarks } = useBookmarkStore();
  const [pendingAddItemCode, setPendingAddItemCode] = useState<string | null>(null);

  // Determine which mode we're in and what data to use
  const isSearchMode = !!searchQuery;
  const isPromotionMode = !!(promotionId && chainId && subChainId && storeId);
  const isCategoryMode = !!categoryName;
  const isMultiCategoryMode = !!(categories && isMultiCategory === "true");
  
  const currentData = isSearchMode ? groceriesResults : 
                      isPromotionMode ? discountedGroceries : 
                      (isCategoryMode || isMultiCategoryMode) ? categoryGroceries : [];
  
  const isLoading = isSearchMode ? groceryLoading : 
                    isPromotionMode ? promotionLoading : 
                    (isCategoryMode || isMultiCategoryMode) ? categoryLoading : false;
  
  // Check if this is initial loading (no data yet) vs pagination loading (has data)
  const isInitialLoading = isLoading && currentData.length === 0;
  const isPaginationLoading = isLoading && currentData.length > 0;
  
  const currentPage = isSearchMode ? page : 
                      (isCategoryMode || isMultiCategoryMode) ? categoryPage : 1;
  
  const currentTotalPages = isSearchMode ? totalPages : 
                            (isCategoryMode || isMultiCategoryMode) ? categoryTotalPages : 1;

  // Load initial results when screen mounts or params change
  useEffect(() => {
    if (isSearchMode && searchQuery) {
      search(searchQuery, 1);
    } else if (isPromotionMode) {
      fetchDiscountedGroceries(promotionId!, chainId!, subChainId!, storeId!);
    } else if (isCategoryMode && categoryName) {
      fetchGroceriesByCategory([categoryName], 1);
    } else if (isMultiCategoryMode && categories) {
      const categoryArray = categories.split("|");
      fetchGroceriesByCategory(categoryArray, 1);
    }
  }, [searchQuery, promotionId, chainId, subChainId, storeId, categoryName, categories, search, fetchDiscountedGroceries, fetchGroceriesByCategory, isSearchMode, isPromotionMode, isCategoryMode, isMultiCategoryMode]);

  // Load more results on scroll (for search and category modes with pagination)
  const loadMore = useCallback(() => {
    if (isSearchMode && !groceryLoading && currentPage < currentTotalPages && searchQuery) {
      search(searchQuery, currentPage + 1);
    } else if (isCategoryMode && !categoryLoading && currentPage < currentTotalPages && categoryName) {
      fetchGroceriesByCategory([categoryName], currentPage + 1);
    } else if (isMultiCategoryMode && !categoryLoading && currentPage < currentTotalPages && categories) {
      const categoryArray = categories.split("|");
      fetchGroceriesByCategory(categoryArray, currentPage + 1);
    }
  }, [isSearchMode, isCategoryMode, isMultiCategoryMode, groceryLoading, categoryLoading, currentPage, currentTotalPages, searchQuery, categoryName, categories, search, fetchGroceriesByCategory]);

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
    // Show loading indicator when paginating (has existing data and loading more)
    if (!isPaginationLoading) return null;
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="large" color="#5382A6" />
      </View>
    );
  };

  // Determine header title based on mode
  const headerTitle = isSearchMode ? "תוצאות חיפוש" : 
                      isPromotionMode ? "מוצרים במבצע" : 
                      isCategoryMode ? `${categoryName}` :
                      isMultiCategoryMode ? `קטגוריות נבחרות (${categories?.split("|").length})` : "תוצאות";

  if (!isSearchMode && !isPromotionMode && !isCategoryMode && !isMultiCategoryMode) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text>פרמטרים חסרים</Text>
      </View>
    );
  }

  // Only show shimmer on initial loading when there's no data yet
  if (isInitialLoading) {
    return (
      <View className="flex-1 bg-gray-50">
        <AppHeader title={headerTitle} />
        <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
          {/* Create 3 rows of 2 shimmer cards each */}
          {Array.from({ length: 3 }, (_, rowIndex) => (
            <View 
              key={`shimmer-row-${rowIndex}`} 
              style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between',
                width: '100%'
              }}
            >
              <View style={{ width: '48%' }}>
                <GroceryResultCardShimmer />
              </View>
              <View style={{ width: '48%' }}>
                <GroceryResultCardShimmer />
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <AppHeader title={headerTitle} />

      {((isPromotionMode && currentData.length === 0 && !isInitialLoading) || 
        (isCategoryMode && currentData.length === 0 && !isInitialLoading) ||
        (isMultiCategoryMode && currentData.length === 0 && !isInitialLoading)) ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600 text-lg">
            {isPromotionMode ? `לא נמצאו מוצרים תחת קוד המבצע: ${promotionId}` : 
             isCategoryMode ? `לא נמצאו מוצרים בקטגוריה: ${categoryName}` : 
             isMultiCategoryMode ? "לא נמצאו מוצרים בקטגוריות הנבחרות" :
             "לא נמצאו מוצרים"}
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
                item.imageUrl ?? PLACEHOLDER_IMAGE
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
          onEndReached={(isSearchMode || isCategoryMode || isMultiCategoryMode) ? loadMore : undefined}
          onEndReachedThreshold={0.01}
          ListFooterComponent={renderFooter}
          contentContainerStyle={{ paddingHorizontal: 10, paddingTop: 10 }}
        />
      )}
      
      <Toast config={toastConfig} />
    </View>
  );
};

export default GroceryResultsScreen;