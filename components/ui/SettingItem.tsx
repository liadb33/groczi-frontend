import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Props for the settings item component
export interface SettingItemProps {
  title: string;
  value?: string;
  showChevron?: boolean;
  customRight?: React.ReactNode;
  onPress?: () => void;
}

// Reusable setting item component
export const SettingItem: React.FC<SettingItemProps> = ({ 
  title, 
  value, 
  showChevron = true, 
  customRight = null,
  onPress = () => {}
}) => (
  <TouchableOpacity 
    className="bg-white rounded-xl p-4 mb-3 flex-row justify-between items-center"
    onPress={onPress}
  >
    <Text className="text-gray-800 text-lg font-medium">{title}</Text>
    <View className="flex-row items-center">
      {value && <Text className="text-gray-500 mr-2">{value}</Text>}
      {customRight}
      {showChevron && (
        <MaterialCommunityIcons name="chevron-left" size={24} color="#475569" />
      )}
    </View>
  </TouchableOpacity>
);

export default SettingItem; 