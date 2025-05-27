import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback,
  I18nManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PromotionItem from "./PromotionItem";

interface PromotionData {
  promotionId: string;
  promotionName: string;
  endDate: string;
}

interface PromotionListModalProps {
  title: string;
  visible: boolean;
  promotions: PromotionData[];
  storeName: string;
  chainId: string;
  subChainId: string;
  storeId: string;
  onClose: () => void;
  onSelectPromotion?: (promotion: {
    promotionId: string;
    promotionName: string;
    endDate: string;
    chainId: string;
    subChainId: string;
    storeId: string;
  }) => void;
}

const PromotionListModal: React.FC<PromotionListModalProps> = ({
  title,
  visible,
  promotions,
  storeName,
  chainId,
  subChainId,
  storeId,
  onClose,
  onSelectPromotion,
}) => {
  const isRTL = I18nManager.isRTL;

  const handlePromotionPress = (promotion: { promotionName: string; endDate: string; }) => {
    // Find the full promotion data including promotionId
    const fullPromotion = promotions.find(p => p.promotionName === promotion.promotionName);
    if (fullPromotion && onSelectPromotion) {
      onSelectPromotion({
        ...fullPromotion,
        chainId,
        subChainId,
        storeId,
      });
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Detect taps outside the modal */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/40 justify-center items-center">
          {/* Prevent taps inside modal content from closing it */}
          <TouchableWithoutFeedback onPress={() => {}}>
            <View className="w-4/5 max-h-3/4 bg-white rounded-2xl p-4 shadow-lg">
              <View
                className={`${
                  isRTL ? "flex-row-reverse" : "flex-row"
                } justify-start items-center mb-3`}
              >
                {/* Close button always first in flex-row or last in flex-row-reverse */}
                <TouchableOpacity onPress={onClose} className="px-2">
                  <Ionicons name="close" size={28} color="#3B82F6" />
                </TouchableOpacity>

                {/* Title and Store info */}
                <View
                  className={`flex-1 ${
                    isRTL ? "items-end" : "items-start"
                  } px-2`}
                >
                  <Text className="text-xl font-bold text-right mb-1">
                    {title}
                  </Text>
                  <Text className="text-sm text-gray-600 text-right">
                    {storeName}
                  </Text>
                </View>
              </View>

              {promotions.length === 0 ? (
                <Text className="text-base text-center py-4">
                  אין מבצעים זמינים עבור חנות זו
                </Text>
              ) : (
                <View className="bg-white rounded-lg p-2 max-h-96">
                  <FlatList
                    data={promotions}
                    keyExtractor={(item, index) =>
                      `${item.promotionName}-${index}`
                    }
                    nestedScrollEnabled
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <PromotionItem
                        promotion={item}
                        isRTL={isRTL}
                        onPromotionPress={handlePromotionPress}
                      />
                    )}
                  />
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default PromotionListModal;
