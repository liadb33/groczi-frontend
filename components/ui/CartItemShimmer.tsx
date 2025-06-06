import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

const CartItemShimmer = () => {
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
      <View className="flex-row items-center justify-between">
        {/* Product Image */}
        <Animated.View
          style={[shimmerStyle]}
          className="w-16 h-16 bg-gray-200 rounded-lg"
        />
        
        {/* Product Details */}
        <View className="flex-1 mx-4">
          <Animated.View
            style={[shimmerStyle]}
            className="h-4 bg-gray-200 rounded mb-2"
          />
          <Animated.View
            style={[shimmerStyle]}
            className="h-3 bg-gray-200 rounded w-3/4 mb-1"
          />
          <Animated.View
            style={[shimmerStyle]}
            className="h-3 bg-gray-200 rounded w-1/2"
          />
        </View>

        {/* Quantity Controls */}
        <View className="flex-row items-center">
          <Animated.View
            style={[shimmerStyle]}
            className="w-8 h-8 bg-gray-200 rounded-full mr-2"
          />
          <Animated.View
            style={[shimmerStyle]}
            className="w-8 h-6 bg-gray-200 rounded"
          />
          <Animated.View
            style={[shimmerStyle]}
            className="w-8 h-8 bg-gray-200 rounded-full ml-2"
          />
        </View>
      </View>
      
      {/* Price */}
      <View className="flex-row justify-between items-center mt-3">
        <Animated.View
          style={[shimmerStyle]}
          className="h-4 bg-gray-200 rounded w-20"
        />
        <Animated.View
          style={[shimmerStyle]}
          className="h-4 bg-gray-200 rounded w-16"
        />
      </View>
    </View>
  );
};

export default CartItemShimmer; 