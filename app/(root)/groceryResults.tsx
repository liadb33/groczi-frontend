import React, { useCallback, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import AppHeader from '@/components/header/AppHeader';
import GroceryResultCard from '@/components/grocery/GroceryResultCard';
import { useGroceryStore } from '@/store';
import { useLocalSearchParams } from 'expo-router';



const GroceryResultsScreen = () => {
  const { searchQuery } = useLocalSearchParams<{ searchQuery: string }>();
  const { groceries,groceriesResults, search, page, totalPages, isLoading } = useGroceryStore();

  // Load initial results when screen mounts or searchQuery changes
  useEffect(() => {
    if (searchQuery) {
      search(searchQuery, 1);
    }
  }, [searchQuery, search]);

  // Load more results on scroll if not at last page and not currently loading
  const loadMore = useCallback(() => {
    if (!isLoading && page < totalPages) {
      search(searchQuery, page + 1);
    }
  }, [isLoading, page, totalPages, searchQuery, search]);

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="large" color="#5382A6" />
      </View>
    );
  };

  if (!searchQuery) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text>אין מחרוזת חיפוש</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <AppHeader title="תוצאות" />

      <FlatList
        data={groceriesResults}
        renderItem={({ item }) => (
          <GroceryResultCard
            key={item.itemCode}
            itemCode={Number(item.itemCode)}
            name={item.itemName || ""}
            category={item.category || ""}
            weight={item.unitQty || ""}
            price={item.price || ""}
            discount={"35%"} // TODO: get discount from backend
            image={
              "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            } // TODO: get image from backend
            bookmarked={false} // TODO: get bookmarked from backend
            onPress={() => console.log(`Pressed ${item.itemName}`)}
            onAddToCart={() => console.log(`Added ${item.itemName} to cart`)}
            onToggleBookmark={() =>
              console.log(`Toggled bookmark for ${item.itemName}`)
            }
          />
        )}
        keyExtractor={(item) => item.itemCode}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        contentContainerStyle={{ paddingHorizontal: 10, paddingTop: 10 }}
      />
    </View>
  );
};
export default GroceryResultsScreen;
