import React from "react";
import { View, Text, TouchableOpacity, I18nManager } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PromotionItem from "./PromotionItem";

export interface PromotionCardProps {
  storeName: string;
  storeAddress: string;
  chainId: string;
  subChainId: string;
  storeId: string;
  promotions: Array<{
    promotionId: string;
    promotionName: string;
    endDate: string; // ISO format date string
  }>;
  onShowMorePress?: () => void; // Callback for הצג עוד press
  onPromotionPress?: (promotion: {
    promotionId: string;
    promotionName: string;
    endDate: string;
    chainId: string;
    subChainId: string;
    storeId: string;
  }) => void; // Callback when tapping a promotion name
}

export const PromotionCard: React.FC<PromotionCardProps> = ({
  storeName,
  storeAddress,
  chainId,
  subChainId,
  storeId,
  promotions,
  onShowMorePress,
  onPromotionPress,
}) => {
  const isRTL = I18nManager.isRTL;
  const maxVisiblePromotions = 4;
  const visiblePromotions = promotions.slice(0, maxVisiblePromotions);

  const handlePromotionPress = (promotion: { promotionName: string; endDate: string; }) => {
    // Find the full promotion data including promotionId
    const fullPromotion = promotions.find(p => p.promotionName === promotion.promotionName);
    if (fullPromotion && onPromotionPress) {
      onPromotionPress({
        ...fullPromotion,
        chainId,
        subChainId,
        storeId,
      });
    }
  };

  return (
    <View
      className="bg-white rounded-2xl shadow-sm mx-4 my-2 overflow-hidden"
      style={{
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      {/* Store Header */}
      <View
        className={`flex-row${
          isRTL ? "-reverse" : ""
        } justify-between items-center px-4 py-3 bg-white border-b border-gray-100`}
      >
        {/* Store icon, name, address */}
        <View
          className={`flex-row${isRTL ? "-reverse" : ""} items-center flex-1`}
        >
          <MaterialCommunityIcons
            name="store"
            size={20}
            color="#333"
          />
          <View className="flex-1">
            <Text
              className={`text-lg font-bold text-gray-800 mr-2 ${
                isRTL ? "text-right" : "text-left"
              }`}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {storeName}
            </Text>
            <Text
              className={`text-sm text-gray-600 mr-2 ${
                isRTL ? "text-right" : "text-left"
              }`}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {storeAddress}
            </Text>
          </View>
        </View>

        {/* Chevron left icon */}
        <MaterialCommunityIcons name="chevron-left" size={20} color="#666" />
      </View>

      {/* Promotions List */}
      <View className="px-4">
        {visiblePromotions.map((promotion, index) => (
          <PromotionItem
            key={index}
            promotion={promotion}
            isRTL={isRTL}
            onPromotionPress={handlePromotionPress}
          />
        ))}
      </View>

      {/* Show More Button */}
      {promotions.length > maxVisiblePromotions && (
        <TouchableOpacity
          onPress={onShowMorePress}
          className="-mt-3 py-3 bg-white"
          activeOpacity={0.7}
        >
          <View
            className={`flex-row${
              isRTL ? "-reverse" : ""
            } justify-center items-center`}
          >
            <Text className="text-blue-600 font-medium text-base">הצג עוד</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default PromotionCard;
