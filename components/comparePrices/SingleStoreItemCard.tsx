import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SingleStoreItemCardProps {
  item: SingleStoreEvaluation;
  isPartialMatch?: boolean;
  groceries?: CustomOptimizationItem[];
  onNavigate: (locationData: {
    latitude: number;
    longitude: number;
    address: string;
    storeId: string;
    chainId: string;
    subChainId: string;
  }) => void;
  onShowMissingItems?: (missingItems: { id: string; name: string }[]) => void;
}

const SingleStoreItemCard: React.FC<SingleStoreItemCardProps> = ({
  item,
  isPartialMatch = false,
  groceries = [],
  onNavigate,
  onShowMissingItems,
}) => {
  const handleNavigate = () => {
    onNavigate({
      latitude: item.latitude,
      longitude: item.longitude,
      address: item.address,
      storeId: item.store_id,
      chainId: item.chain_id,
      subChainId: item.sub_chain_id,
    });
  };

  const handleShowMissingItems = () => {
    if (onShowMissingItems && item.missing_items.length > 0) {
      const formatted = item.missing_items.map((code: string) => {
        const matched = groceries.find((g) => g.itemCode === code);
        return { id: code, name: matched?.itemName || code };
      });
      onShowMissingItems(formatted);
    }
  };

  return (
    <View className="bg-white mx-auto my-4 rounded-3xl shadow-xl w-[90%]">
      <View className="items-center pt-6 pb-2 relative">
        <View className="absolute left-5 top-2 bg-blue-500 rounded-full px-4 py-1 z-10">
          <Text className="text-white text-sm font-bold">
            {item.distance_to_store_km.toFixed(1)} ק"מ
          </Text>
        </View>
        <View className="w-[85%] h-28 rounded-2xl overflow-hidden mb-3">
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1540200049848-d9813ea0e120?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
        <TouchableOpacity
          className="absolute -bottom-5 left-1/2 -ml-6 bg-white rounded-full w-12 h-12 items-center justify-center shadow-md z-20"
          onPress={handleNavigate}
        >
          <Ionicons name="navigate" size={28} color="#4285F4" />
        </TouchableOpacity>
      </View>
      <View className="mt-6 mb-3 items-center px-4">
        <Text className="text-xl font-extrabold text-[#222] text-center w-full">
          {item.store_name}
        </Text>
        <Text className="text-base text-gray-500 text-center w-full">
          {item.address}
        </Text>
        <Text className="text-2xl font-extrabold text-[#111] mt-2 text-center w-full">
          ₪{item.item_cost_at_store.toFixed(2)}
        </Text>
        {isPartialMatch && item.missing_items.length > 0 && (
          <TouchableOpacity
            className="mt-1 self-stretch items-center"
            onPress={handleShowMissingItems}
          >
            <Text className="text-sm text-gray-500 text-center">
              {item.missing_items.length} מוצרים חסרים – לחץ לצפייה
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default SingleStoreItemCard; 