import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ActivityIndicator, TouchableOpacity, Alert, ScrollView, RefreshControl } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useGroceryStore } from '@/store';
import { PriceHistoryChart, usePriceHistoryData, STORE_COLORS } from '@/components/PriceHistoryChart';
import AppHeader from '@/components/header/AppHeader';

export default function PriceHistoryScreen() {
  const router = useRouter();
  const { itemCode, itemName } = useLocalSearchParams<{
    itemCode: string;
    itemName: string;
  }>();

  const { priceHistory, isLoading, fetchPriceHistory, currentItem } = useGroceryStore();
  const [refreshing, setRefreshing] = useState(false);

  // Use the custom hook to get chart metadata
  const chartMetadata = usePriceHistoryData(priceHistory || [], 5);

  useEffect(() => {
    if (itemCode) {
      loadPriceHistory();
    }
  }, [itemCode]);

  const loadPriceHistory = async () => {
    if (!itemCode) return;
    
    try {
      await fetchPriceHistory(itemCode);
    } catch (error) {
      console.error('Failed to load price history:', error);
      Alert.alert(
        'Error',
        'Failed to load price history. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPriceHistory();
    setRefreshing(false);
  };

  const displayName = itemName || currentItem?.itemName || 'Product';

  return (
    <View className="flex-1 bg-gray-50">
      <AppHeader 
        title="היסטוריית מחירים" 
        showSettingsButton={true}
        onBackPress={() => router.back()}
      />

      {/* Content */}
      {isLoading && !refreshing ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-500 mt-4">טוען היסטוריית מחירים...</Text>
        </View>
      ) : (
        <>
          {/* Price History Chart with Layout */}
          {priceHistory && priceHistory.length > 0 ? (
            <ScrollView 
              showsVerticalScrollIndicator={false} 
              className="flex-1"
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  colors={['#3B82F6']}
                  tintColor="#3B82F6"
                />
              }
            >
              <View className="bg-white rounded-lg p-3 mx-2 shadow-sm">
                
                {/* Chart Component */}
                <PriceHistoryChart data={priceHistory} maxStores={5} />

                {/* Custom Legend */}
                <View className="mt-4 mb-2">
                  <Text className="text-sm font-medium text-gray-700 mb-3 text-center">חנויות:</Text>
                  <View className="flex-row flex-wrap justify-center">
                    {chartMetadata.selectedStores.map((store, index) => (
                      <View key={store.store_id} className="flex-row items-center mx-3 mb-2">
                        <View
                          className="w-3 h-3 rounded-sm mr-2"
                          style={{ backgroundColor: STORE_COLORS[index % STORE_COLORS.length] }}
                        />
                        <Text className="text-xs text-gray-600" numberOfLines={1}>
                          {store.store_name}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Summary Stats */}
                {chartMetadata.totalDataPoints > 0 && (
                  <View className="pt-4 border-t border-gray-200">
                    <View className="flex-row justify-between">
                      <View className="items-center">
                        <Text className="text-xs text-gray-500">נקודות מידע</Text>
                        <Text className="text-sm font-medium text-gray-900">
                          {chartMetadata.totalDataPoints}
                        </Text>
                      </View>
                      <View className="items-center">
                        <Text className="text-xs text-gray-500">חנויות</Text>
                        <Text className="text-sm font-medium text-gray-900">
                          {chartMetadata.selectedStores.length}
                        </Text>
                      </View>
                      <View className="items-center">
                        <Text className="text-xs text-gray-500">תקופה</Text>
                        <Text className="text-sm font-medium text-gray-900">
                          {`${chartMetadata.formatDate(chartMetadata.minDate.getTime())} - ${chartMetadata.formatDate(chartMetadata.maxDate.getTime())}`}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>
          ) : (
            <View className="flex-1 justify-center items-center px-8">
              <Ionicons name="analytics-outline" size={64} color="#9CA3AF" />
              <Text className="text-lg font-medium text-gray-900 mt-4 text-center">
                אין היסטוריית מחירים זמינה
              </Text>
              <Text className="text-sm text-gray-500 mt-2 text-center">
                נתוני היסטוריית מחירים אינם זמינים עבור פריט זה כרגע.
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}

