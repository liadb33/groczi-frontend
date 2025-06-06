import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

const ListItemShimmer = () => {
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
    <View className="bg-white rounded-2xl p-4 mx-4 my-2 shadow-sm">
      <View className="flex-row-reverse items-center justify-between">
        {/* List Icon */}
        <Animated.View
          style={[shimmerStyle]}
          className="w-12 h-12 bg-gray-200 rounded-full"
        />
        
        {/* List Details */}
        <View className="flex-1 mr-4">
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
            className="h-3 bg-gray-200 rounded w-1/2"
          />
        </View>

        {/* Arrow Icon */}
        <Animated.View
          style={[shimmerStyle]}
          className="w-6 h-6 bg-gray-200 rounded"
        />
      </View>
    </View>
  );
};

export default ListItemShimmer; 