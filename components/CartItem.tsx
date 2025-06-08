import React from "react";
import { View, Text, TouchableOpacity, Image, I18nManager } from "react-native";
import { Feather } from "@expo/vector-icons";

const CartItem: React.FC<CartItemProps> = ({
  item,
  onIncrease,
  onDecrease,
  onImagePress,
  onPress,
}) => {


  const displayPrice = item.price ?? parseFloat(item.subtotal ?? "0");

  return (
    <TouchableOpacity 
      className="bg-white rounded-lg shadow-md p-3 mb-3 mx-4 flex-row justify-between"
      onPress={() => onPress?.(item)}
      activeOpacity={0.7}
    >
      {/* Left Side - Quantity Controls */}
      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={() => onDecrease(item.id)}
          className="p-1.5 rounded-full mr-2 bg-white border border-gray-300"
        >
          <Feather name="minus" size={18} color="black" />
        </TouchableOpacity>
        <Text className="font-semibold text-base w-6 text-center text-[#08263E]">
          {item.quantity}
        </Text>
        <TouchableOpacity
          onPress={() => onIncrease(item.id)}
          className="p-1.5 rounded-full ml-2 bg-blue-600"
        >
          <Feather name="plus" size={18} color="white" />
        </TouchableOpacity>
      </View>

      {/* Right Side - Product Details */}
      <View className="flex-row-reverse flex-1 items-center">
        {/* Image */}
        <View className="ml-3">
          <Image
            source={{ uri: item.imageUrl }}
            className="w-16 h-16 rounded-lg"
            resizeMode="cover"
          />
        </View>

        {/* Details */}
        <View className="flex-1 ml-2 items-start" style={{ direction: "rtl" }}>
          <Text
            className="font-bold text-base mb-1 text-[#08263E] text-left"
            numberOfLines={2}
            style={{ textAlign: "left" }}
          >
            {item.name}
          </Text>
          <Text className="text-gray-600 mb-1 text-right">
            מחיר:{" "}
            <Text className="text-blue-600 font-bold text-right">
              ₪{displayPrice}
            </Text>
          </Text>
          <Text className="text-gray-500 text-sm text-right">
            קטגוריה: {item.category}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CartItem;
