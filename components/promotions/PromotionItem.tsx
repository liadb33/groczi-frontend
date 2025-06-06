import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Clock } from "lucide-react-native";

interface PromotionItemProps {
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

const PromotionItem: React.FC<PromotionItemProps> = ({ 
  promotion, 
  isRTL, 
  onPromotionPress 
}) => {
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("he-IL", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };

  return (
    <View
      className={`flex-row${
        isRTL ? "-reverse" : ""
      } justify-between items-center py-2 border-b border-gray-100`}
    >
      {/* Promotion name tappable */}
      <TouchableOpacity
        className={`flex-1`}
        onPress={() =>
          onPromotionPress && onPromotionPress(promotion)
        }
        activeOpacity={0.7}
      >
        <Text
          className={`text-base font-medium text-gray-800 ${
            isRTL ? "text-right mr-3" : "text-left ml-3"
          }`}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {promotion.promotionName}
        </Text>
      </TouchableOpacity>

      {/* Watch icon and expiry date */}
      <View
        className={`flex-row${isRTL ? "-reverse" : ""} items-center ${
          isRTL ? "ml-4" : "mr-4"
        }`}
      >
        <Text className="text-s  text-gray-600 font-bold">
          {formatDate(promotion.endDate)}
        </Text>
        <Clock
          size={16}
          color="#666"
          style={{ marginRight: isRTL ? 0 : 4, marginLeft: isRTL ? 4 : 0 }}
        />
      </View>
    </View>
  );
};

export default PromotionItem; 