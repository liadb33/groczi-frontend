import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ActivityIndicator, TouchableOpacity, Alert, ScrollView, RefreshControl } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useGroceryStore } from '@/store';
import { PriceHistoryChart, usePriceHistoryData, STORE_COLORS } from '@/components/PriceHistoryChart';
import AppHeader from '@/components/header/AppHeader';
import CustomListModal from '@/components/grocery/CustomListModal';

type FilterMode = 'all' | 'top5' | 'single';

interface StoreListItem {
  id: string;
  name: string;
  itemCount?: number;
}

export default function PriceHistoryScreen() {
  const router = useRouter();
  const { itemCode, itemName } = useLocalSearchParams<{
    itemCode: string;
    itemName: string;
  }>();

  const { priceHistory, isLoading, fetchPriceHistory, currentItem } = useGroceryStore();
  const [refreshing, setRefreshing] = useState(false);
  const [filterMode, setFilterMode] = useState<FilterMode>('top5');
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [showStoreModal, setShowStoreModal] = useState(false);

  // Process data based on filter mode
  const getFilteredData = () => {
    if (!priceHistory || priceHistory.length === 0) return [];

    switch (filterMode) {
      case 'all':
        return priceHistory;
      case 'single':
        if (selectedStoreId) {
          return priceHistory.filter(store => store.store_id === selectedStoreId);
        }
        return [];
      case 'top5':
      default:
        return priceHistory;
    }
  };

  const filteredData = getFilteredData();
  const maxStores = filterMode === 'all' ? priceHistory?.length || 0 : 5;

  // Use the custom hook to get chart metadata
  const shouldDisableShuffling = filterMode === 'all' || filterMode === 'single';
  const chartMetadata = usePriceHistoryData(filteredData, maxStores, shouldDisableShuffling);

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

  const handleFilterModeChange = (mode: FilterMode) => {
    setFilterMode(mode);
    if (mode !== 'single') {
      setSelectedStoreId(null);
    }
  };

  const handleStoreSelect = (storeId: string) => {
    // Close modal first to prevent UI blocking
    setShowStoreModal(false);
    
    // Then update the selected store after a brief delay
    setTimeout(() => {
      setSelectedStoreId(storeId);
    }, 50);
  };

  const handleModalClose = () => {
    setShowStoreModal(false);
  };

  

  const getStoreOptions = (): StoreListItem[] => {
    if (!priceHistory) return [];
    
    return priceHistory.map(store => ({
      id: store.store_id,
      name: store.store_name,
      itemCount: store.prices?.length || 0
    }));
  };

  const getSelectedStoreName = () => {
    if (!selectedStoreId || !priceHistory) return '';
    const store = priceHistory.find(s => s.store_id === selectedStoreId);
    return store?.store_name || '';
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
                <PriceHistoryChart 
                  data={filteredData} 
                  maxStores={maxStores} 
                  disableShuffling={shouldDisableShuffling} 
                />

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

                {/* Filter Options */}
                <View className="pt-4 border-t border-gray-200 mt-4">
                  <Text className="text-sm font-medium text-gray-700 mb-3 text-center">סינון תצוגת חנויות:</Text>
                  
                  <View className="flex-row justify-center space-x-2">
                    {/* All Stores Button */}
                    <TouchableOpacity
                      className={`px-4 py-2 rounded-lg mr-2 ${
                        filterMode === 'all' ? 'bg-blue-500' : 'bg-gray-200'
                      }`}
                      onPress={() => handleFilterModeChange('all')}
                    >
                      <Text className={`text-sm font-medium ${
                        filterMode === 'all' ? 'text-white' : 'text-gray-700'
                      }`}>
                        כל החנויות
                      </Text>
                    </TouchableOpacity>

                    {/* Top 5 Random Button */}
                    <TouchableOpacity
                      className={`px-4 py-2 rounded-lg mr-2 ${
                        filterMode === 'top5' ? 'bg-blue-500' : 'bg-gray-200'
                      }`}
                      onPress={() => handleFilterModeChange('top5')}
                    >
                      <Text className={`text-sm font-medium ${
                        filterMode === 'top5' ? 'text-white' : 'text-gray-700'
                      }`}>
                        5 חנויות מובילות
                      </Text>
                    </TouchableOpacity>

                    {/* Single Store Button */}
                    <TouchableOpacity
                      className={`px-4 py-2 rounded-lg ${
                        filterMode === 'single' ? 'bg-blue-500' : 'bg-gray-200'
                      }`}
                      onPress={() => {
                        // Switch to single mode and show modal
                        handleFilterModeChange('single');
                        setShowStoreModal(true);
                      }}
                    >
                      <Text className={`text-sm font-medium ${
                        filterMode === 'single' ? 'text-white' : 'text-gray-700'
                      }`}>
                        חנות יחידה
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Selected Store Display */}
                  {filterMode === 'single' && selectedStoreId && (
                    <View className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <Text className="text-sm text-blue-700 text-center">
                        חנות נבחרת: {getSelectedStoreName()}
                      </Text>
                    </View>
                  )}

                  {/* No Store Selected Message */}
                  {filterMode === 'single' && !selectedStoreId && (
                    <View className="mt-3 p-3 bg-yellow-50 rounded-lg">
                      <Text className="text-sm text-yellow-700 text-center">
                        לא נבחרה חנות. לחץ על "חנות יחידה" כדי לבחור.
                      </Text>
                    </View>
                  )}
                </View>
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

      {/* Store Selection Modal */}
      {showStoreModal && (
        <CustomListModal
          key="store-selection-modal"
          title="בחר חנות"
          visible={showStoreModal}
          lists={getStoreOptions()}
          loading={false}
          onClose={handleModalClose}
          onSelectList={handleStoreSelect}
          itemCountLabel="מחירים"
        />
      )}
    </View>
  );
}

