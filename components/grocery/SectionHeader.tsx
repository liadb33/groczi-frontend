import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  showSeeAll = true,
  onSeeAllPress = () => {},
}) => {
  return (
    <View className="flex-row justify-between items-center px-4 mt-2.5 mb-4">
      <Text className="text-2xl font-bold text-gray-800">{title}</Text>
      {showSeeAll && (
        <TouchableOpacity onPress={onSeeAllPress}>
          <Text className="text-sm font-medium text-blue-600">See All</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SectionHeader; 