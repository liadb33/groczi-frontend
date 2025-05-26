import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

interface LoadingComponentProps {
  text?: string; // Optional prop for custom loading text
}

const LoadingComponent: React.FC<LoadingComponentProps> = ({ text }) => (
  <View className="flex-1 justify-center items-center py-20">
    <ActivityIndicator size="large" color="#2563EB" />
    {text ? (
      <Text className="text-gray-600 mt-4 text-lg text-center">
        {text}
      </Text>
    ) : null}
  </View>
);

export default LoadingComponent;
