import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

const GroceryCardShimmer = () => {
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
    <View className="bg-white rounded-2xl p-4 mx-2 my-2 shadow-sm">
      <View className="flex-row items-center">
        {/* Product Image */}
        <Animated.View
          style={[shimmerStyle]}
          className="w-20 h-20 bg-gray-200 rounded-lg"
        />
        
        {/* Product Details */}
        <View className="flex-1 mx-4">
          <Animated.View
            style={[shimmerStyle]}
            className="h-4 bg-gray-200 rounded mb-2"
          />
          <Animated.View
            style={[shimmerStyle]}
            className="h-3 bg-gray-200 rounded w-2/3 mb-1"
          />
          <Animated.View
            style={[shimmerStyle]}
            className="h-3 bg-gray-200 rounded w-1/2 mb-2"
          />
          
          {/* Price and Add Button Row */}
          <View className="flex-row justify-between items-center">
            <Animated.View
              style={[shimmerStyle]}
              className="h-4 bg-gray-200 rounded w-16"
            />
            <Animated.View
              style={[shimmerStyle]}
              className="w-20 h-8 bg-gray-200 rounded-full"
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default GroceryCardShimmer; 