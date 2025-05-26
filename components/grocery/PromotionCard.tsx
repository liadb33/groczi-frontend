import { View, Text, Image, I18nManager } from "react-native";

export interface PromotionCardProps {
  storeName: string;
  promotionName: string;
  expiryDate: string;
  items: Array<{ name: string; price: string }>;
  image: string;
}

export const PromotionCard: React.FC<PromotionCardProps> = ({
  storeName,
  promotionName,
  expiryDate,
  items,
  image,
}) => {
  const isRTL = I18nManager.isRTL;

  return (
    <View
      className={`
        bg-white rounded-2xl shadow-sm overflow-hidden mx-4 my-2
        flex-row-reverse
        h-[160px]
      `}
      style={{
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      {/* Left side (image) */}
      <View className="w-[40%] h-full">
        <Image
          source={{ uri: image }}
          className="w-full h-full"
          style={{
            borderTopRightRadius: isRTL ? 0 : 16,
            borderBottomRightRadius: isRTL ? 0 : 16,
            borderTopLeftRadius: isRTL ? 16 : 0,
            borderBottomLeftRadius: isRTL ? 16 : 0,
          }}
          resizeMode="cover"
        />
      </View>

      {/* Right side (text content) */}
      <View className="flex-1 p-4 justify-start">
        {/* Store name, promotion name, expiry date */}
        <View className={`${isRTL ? "items-end" : "items-start"}`}>
          <Text
            className={`text-base font-bold ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {storeName}
          </Text>
          <Text
            className={`text-xl font-bold ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {promotionName}
          </Text>
          <Text
            className={`text-base text-gray-400 mt-0.5 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {expiryDate}
          </Text>
        </View>

        {/* Items */}
        <View className="mt-1">
          {items.slice(0, 4).map((item, idx) => (
            <View
              key={idx}
              className={`
                flex-row-reverse
                justify-between items-center mb-1
              `}
            >
              <Text className="text-base font-bold">{item.price}</Text>
              <Text
                className={`text-base flex-1 ${
                  isRTL ? "text-right mr-0 ml-1" : "text-left ml-0 mr-1"
                }`}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.name}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default PromotionCard;
