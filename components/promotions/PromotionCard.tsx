import React from "react";
import { View, Text, TouchableOpacity, I18nManager } from "react-native";
import StoreImage from "./StoreImage";
import PromotionLineItem from "./PromotionLineItem";

export interface PromotionCardProps {
  storeName: string;
  storeAddress: string;
  storeImageUrl?: string;
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
  storeImageUrl,
  chainId,
  subChainId,
  storeId,
  promotions,
  onShowMorePress,
  onPromotionPress,
}) => {
  const isRTL = I18nManager.isRTL;
  const maxVisiblePromotions = 3;
  const visiblePromotions = promotions.slice(0, maxVisiblePromotions);

  const handlePromotionPress = (promotion: {
    promotionId: string;
    promotionName: string;
    endDate: string;
  }) => {
    if (onPromotionPress) {
      onPromotionPress({
        ...promotion,
        chainId,
        subChainId,
        storeId,
      });
    }
  };

  return (
    <View
      className="bg-white rounded-2xl shadow-sm mx-4 my-2 p-4"
      style={{
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View className={`flex-row${isRTL ? "-reverse" : ""} items-start`}>
        {/* Store Image - Right side */}
        <View className="ml-4">
          <StoreImage
            storeImageUrl={storeImageUrl}
            storeName={storeName}
            size="large"
          />
        </View>

        {/* Content Section - Left side */}
        <View className="flex-1">
          {/* Store Name */}
          <Text
            className={`text-xl font-bold text-gray-900 mb-1 ${
              isRTL ? "text-right" : "text-left"
            }`}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {storeName}
          </Text>

          {/* Store Address */}
          <Text
            className={`text-sm text-gray-600 mb-3 ${
              isRTL ? "text-right" : "text-left"
            }`}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {storeAddress}
          </Text>

          {/* Promotions List */}
          <View className="mb-3">
            {visiblePromotions.map((promotion, index) => (
              <PromotionLineItem
                key={promotion.promotionId || index}
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
              className="bg-blue-600 rounded-full py-2 px-4 self-start"
              activeOpacity={0.8}
            >
              <Text className="text-white font-medium text-sm">הצג עוד</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default PromotionCard;
