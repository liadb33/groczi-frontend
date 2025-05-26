import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

const GrocerySavedCard: React.FC<GrocerySavedCardProps> = ({ 
  item, 
  onAddToCart, 
  onImagePress 
}) => {
  // Ensure quantity is properly formatted as a string
  const formattedQuantity = item.quantity.toString() + " " + item.unitQty;
  
  return (
    <View className="flex-row-reverse bg-white p-4 rounded-lg mb-2 shadow-sm border border-gray-100">
      {/* Right: Image */}
      <TouchableOpacity onPress={() => onImagePress(item)}>
        <Image
          source={{ uri: item.imageUrl }}
          className="w-20 h-20 rounded-lg"
          resizeMode="cover"
        />
      </TouchableOpacity>

      {/* Center: Item details */}
      <View className="flex-1 justify-center mr-4">
        <Text className="text-lg font-bold text-right">{item.itemName}</Text>
        <Text className="text-gray-500 text-right">
          כמות: {formattedQuantity}
        </Text>
        <Text className="text-gray-500 text-right">
          קטגוריה: {item.category}
        </Text>
      </View>

      {/* Left: Price and Add to Cart */}
      <View className="items-start justify-between">
        <Text className="text-lg font-bold">₪{item.price}</Text>
        <TouchableOpacity
          className="bg-blue-600 px-4 py-2 rounded-full"
          onPress={() => onAddToCart(item)}
        >
          <Text className="text-white font-medium">הוסף לעגלה</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GrocerySavedCard; 