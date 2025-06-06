import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface PromotionLineItemProps {
  promotion: {
    promotionId: string;
    promotionName: string;
    endDate: string;
  };
  isRTL: boolean;
  onPromotionPress?: (promotion: {
    promotionId: string;
    promotionName: string;
    endDate: string;
  }) => void;
}

const PromotionLineItem: React.FC<PromotionLineItemProps> = ({
  promotion,
  isRTL,
  onPromotionPress,
}) => {
  return (
    <TouchableOpacity
      className="py-1"
      onPress={() => onPromotionPress && onPromotionPress(promotion)}
      activeOpacity={0.7}
    >
      <View className={`flex-row${isRTL ? "-reverse" : ""} items-center`}>
        {/* Bullet point */}
        <View 
          className={`w-1.5 h-1.5 bg-blue-400 rounded-full ml-2`} 
        />
        <Text
          className={`text-sm text-gray-700 flex-1 ${
            isRTL ? "text-right" : "text-left"
          }`}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {promotion.promotionName}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default PromotionLineItem; 