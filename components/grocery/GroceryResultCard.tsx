import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export const GroceryResultCard: React.FC<GroceryResultCardProps> = ({
  itemCode,
  name,
  category,
  weight,
  price,
  discount,
  image,
  bookmarked,
  onPress = () => {},
  onAddToCart = () => {},
  onToggleBookmark = () => {},
  addToCartText = "הוסף לעגלה", // Hebrew example, change as needed
  categoryLabel = "קטגוריה", // Hebrew example, change as needed
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="flex-1 mx-5 my-3"
    >
      <View
        className="bg-white rounded-2xl mb-2 overflow-hidden shadow-sm"
        style={{
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        {/* Image section */}
        <View className="relative">
          <Image
            source={{ uri: image }}
            className="h-[120px] bg-[#E6F0FB]"
            resizeMode="cover"
            style={{ borderTopLeftRadius: 18, borderTopRightRadius: 18 }}
          />

          {/* Discount Badge - now on the left */}
          <View className="absolute top-3 left-3 bg-green-500 px-2 py-0.5 rounded-md">
            <Text className="text-white text-xs font-bold">{discount}</Text>
          </View>

          {/* Bookmark Icon - now on the right */}
          <View className="absolute top-3 right-3 rounded-full w-8 h-8">
            <TouchableOpacity
              className="flex items-center justify-center w-full h-full bg-white rounded-full shadow-sm"
              onPress={onToggleBookmark}
            >
              {bookmarked ? (
                <MaterialCommunityIcons
                  name="bookmark"
                  size={22}
                  color="#FF6F00"
                />
              ) : (
                <MaterialCommunityIcons
                  name="bookmark-outline"
                  size={22}
                  color="#FF6F00"
                />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Details section */}
        <View className="p-2">
          {/* Title and Price Row */}
          <View className="flex-row-reverse justify-between items-center">
            {/* Title (Right) */}
            <Text
              className="text-xl font-extrabold text-[#20232A] text-right"
              numberOfLines={2}
            >
              {name}
            </Text>
            {/* Price (Left) */}
            <Text className="text-xl font-extrabold text-[#20232A]">
              {price}
            </Text>
          </View>

          {/* Category and Weight */}
          <View className="flex-row-reverse mt-1">
            <Text className="text-sm text-gray-500">
              {categoryLabel}: {category} · {weight}
            </Text>
          </View>

          {/* Add to Cart Button - aligned right */}
          <TouchableOpacity className="mt-2 self-end" onPress={onAddToCart}>
            <Text className="text-blue-600 text-base font-semibold">
              {addToCartText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default GroceryResultCard;
