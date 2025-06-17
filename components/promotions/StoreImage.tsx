import React from "react";
import { View, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface StoreImageProps {
  storeImageUrl?: string;
  storeName: string;
  size?: "small" | "medium" | "large";
}

const StoreImage: React.FC<StoreImageProps> = ({
  storeImageUrl,
  storeName,
  size = "medium",
}) => {
  const sizeClasses = {
    small: "w-12 h-12",
    medium: "w-16 h-16",
    large: "w-20 h-20",
  };

  const iconSizes = {
    small: 20,
    medium: 24,
    large: 28,
  };

  return (
    <View
      className={`${sizeClasses[size]} bg-gray-100 rounded-xl justify-center items-center overflow-hidden`}
    >
      {storeImageUrl ? (
        <Image
          source={{ uri: storeImageUrl }}
          className="w-full h-full"
          resizeMode="contain"
        />
      ) : (
        <MaterialCommunityIcons
          name="store"
          size={iconSizes[size]}
          color="#666"
        />
      )}
    </View>
  );
};

export default StoreImage; 