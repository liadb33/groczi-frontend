import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

const ShimmerCard = () => {
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
    <View
      className="bg-white rounded-2xl shadow-sm mx-4 my-2 p-4"
      style={{
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      {/* Store header shimmer */}
      <View className="flex-row-reverse items-center mb-3">
        <Animated.View
          style={[shimmerStyle]}
          className="w-12 h-12 bg-gray-200 rounded-full mr-3"
        />
        <View className="flex-1">
          <Animated.View
            style={[shimmerStyle]}
            className="h-4 bg-gray-200 rounded mb-1"
          />
          <Animated.View
            style={[shimmerStyle]}
            className="h-3 bg-gray-200 rounded w-3/4"
          />
        </View>
      </View>

      {/* Promotions shimmer */}
      <View className="space-y-2">
        {[1, 2, 3].map((item) => (
          <View key={item} className="flex-row-reverse items-center justify-between py-2">
            <View className="flex-1">
              <Animated.View
                style={[shimmerStyle]}
                className="h-3 bg-gray-200 rounded mb-1"
              />
              <Animated.View
                style={[shimmerStyle]}
                className="h-3 bg-gray-200 rounded w-2/3"
              />
            </View>
            <Animated.View
              style={[shimmerStyle]}
              className="w-16 h-6 bg-gray-200 rounded ml-2"
            />
          </View>
        ))}
      </View>

      {/* Show more button shimmer */}
      <Animated.View
        style={[shimmerStyle]}
        className="h-8 bg-gray-200 rounded mt-3 w-20 self-center"
      />
    </View>
  );
};

export default ShimmerCard; 