import React from 'react';
import { View, Text, TouchableOpacity, Platform, StatusBar } from 'react-native';

interface OptimizationTypeDropdownProps {
  isVisible: boolean;
  options: { value: string; label: string }[];
  selectedOption: string;
  onSelectOption: (option: string) => void;
  onClose: () => void;
  statusBarHeight?: number;
}

const OptimizationTypeDropdown: React.FC<OptimizationTypeDropdownProps> = ({
  isVisible,
  options,
  selectedOption,
  onSelectOption,
  onClose,
  statusBarHeight = StatusBar.currentHeight || 0,
}) => {
  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <TouchableOpacity
        className="absolute inset-0 z-40"
        activeOpacity={1}
        onPress={onClose}
      />
      
      {/* Dropdown Menu */}
      <View
        className="absolute z-50 bg-white border border-gray-200 rounded-xl shadow-lg"
        style={{
          top: statusBarHeight + (Platform.OS === 'ios' ? 65 : 130),
          width: 130,
          right: 40,
        }}
      >
        {options.map((option, index) => (
          <React.Fragment key={option.value}>
            <TouchableOpacity
              onPress={() => onSelectOption(option.value)}
              className="px-4 py-3 items-center"
            >
              <Text className="text-base text-gray-800">{option.label}</Text>
            </TouchableOpacity>
            {index < options.length - 1 && (
              <View className="h-[1px] bg-gray-200 mx-2" />
            )}
          </React.Fragment>
        ))}
      </View>
    </>
  );
};

export default OptimizationTypeDropdown; 