import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

const GroceryResultCardShimmer = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    shimmerAnimation.start();

    return () => shimmerAnimation.stop();
  }, [animatedValue]);

  const shimmerStyle = {
    opacity: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.7],
    }),
  };

  return (
    <View className="my-3">
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
        <View className="relative bg-[#E6F0FB]" style={{ borderTopLeftRadius: 18, borderTopRightRadius: 18 }}>
          <Animated.View
            style={[shimmerStyle]}
            className="h-[120px] w-full bg-gray-200"
          />
          
          {/* Bookmark Icon */}
          <View className="absolute top-3 right-3 rounded-full w-8 h-8">
            <Animated.View
              style={[shimmerStyle]}
              className="flex items-center justify-center w-full h-full bg-gray-200 rounded-full"
            />
          </View>
        </View>

        {/* Details section */}
        <View className="p-2">
          {/* Title and Price Row */}
          <View className="flex-row-reverse justify-between items-center">
            {/* Title (Right) */}
            <Animated.View
              style={[shimmerStyle]}
              className="h-5 bg-gray-200 rounded flex-1 mr-2"
            />
            {/* Price (Left) */}
            <Animated.View
              style={[shimmerStyle]}
              className="h-5 bg-gray-200 rounded w-16"
            />
          </View>

          {/* Category and Weight */}
          <View className="flex-row-reverse mt-1">
            <Animated.View
              style={[shimmerStyle]}
              className="h-3 bg-gray-200 rounded w-3/4"
            />
          </View>

          {/* Add to Cart Button - aligned right */}
          <View className="mt-2 self-end">
            <Animated.View
              style={[shimmerStyle]}
              className="h-4 bg-gray-200 rounded w-20"
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default GroceryResultCardShimmer; 