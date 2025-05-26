import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderComponentProps {
  selectedChip: "מרחק" | "עלות" | null;
  onChipPress: (chip: "מרחק" | "עלות") => void;
  selectedOption: string;
  onDropdownPress: () => void;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({
  selectedChip,
  onChipPress,
  selectedOption,
  onDropdownPress,
}) => (
  <View className="mx-4 mt-4 mb-1 flex-row items-center justify-center gap-x-2">
    <TouchableOpacity
      className={`px-6 py-3 rounded-full border ${
        selectedChip === "מרחק"
          ? "bg-blue-500 border-blue-500"
          : "bg-white border-gray-300"
      }`}
      onPress={() => onChipPress("מרחק")}
      activeOpacity={0.8}
    >
      <Text
        className={`font-bold text-base ${
          selectedChip === "מרחק" ? "text-white" : "text-gray-700"
        }`}
      >
        מרחק
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      className={`px-6 py-3 rounded-full border ${
        selectedChip === "עלות"
          ? "bg-blue-500 border-blue-500"
          : "bg-white border-gray-300"
      }`}
      onPress={() => onChipPress("עלות")}
      activeOpacity={0.8}
    >
      <Text
        className={`font-bold text-base ${
          selectedChip === "עלות" ? "text-white" : "text-gray-700"
        }`}
      >
        עלות
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      className="px-5 py-3 rounded-full border bg-white border-gray-300 flex-row items-center"
      onPress={onDropdownPress}
      activeOpacity={0.8}
    >
      <Text className="font-bold text-base text-gray-700 ml-1">
        {selectedOption}
      </Text>
      <Ionicons name="chevron-down" size={20} color="#4B5563" />
    </TouchableOpacity>
  </View>
);

export default HeaderComponent;
