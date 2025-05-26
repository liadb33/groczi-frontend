import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface DistancePickerModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectDistance: (distance: number) => void;
  currentDistance: number;
  minDistance?: number;
  maxDistance?: number;
  unit?: string;
}

const DistancePickerModal: React.FC<DistancePickerModalProps> = ({
  isVisible,
  onClose,
  onSelectDistance,
  currentDistance,
  minDistance = 1,
  maxDistance = 200,
  unit = "קמ"
}) => {
  // Generate array of distances based on min and max
  const distances = Array.from({ length: maxDistance - minDistance + 1 }, (_, i) => i + minDistance);

  const handleSelectDistance = (distance: number) => {
    onSelectDistance(distance);
    onClose();
  };

  const renderDistanceItem = ({ item }: { item: number }) => (
    <TouchableOpacity
      className={`p-4 border-b border-gray-100 flex-row justify-between items-center ${
        item === currentDistance ? 'bg-blue-50' : 'bg-white'
      }`}
      onPress={() => handleSelectDistance(item)}
    >
      <Text 
        className={`text-lg ${
          item === currentDistance ? 'text-blue-600 font-semibold' : 'text-gray-800'
        }`}
      >
        {item} {unit}
      </Text>
      {item === currentDistance && (
        <MaterialCommunityIcons name="check" size={24} color="#2563eb" />
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropOpacity={0.5}
      useNativeDriverForBackdrop={true}
    >
      <View className="flex-1 justify-center items-center px-4">
        <View className="bg-white rounded-2xl w-full max-w-sm" style={{ direction: 'rtl', height: '70%' }}>
          {/* Header */}
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <Text className="text-xl font-bold text-gray-800">מרחק מקסימלי לסניף</Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <MaterialCommunityIcons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Distance List */}
          <View className="flex-1">
            <FlatList
              data={distances}
              keyExtractor={(item) => item.toString()}
              renderItem={renderDistanceItem}
              showsVerticalScrollIndicator={true}
              style={{ flex: 1 }}
              getItemLayout={(data, index) => ({
                length: 56, // Approximate height of each item
                offset: 56 * index,
                index,
              })}
              initialScrollIndex={Math.max(0, currentDistance - 10)} // Start near current selection
              onScrollToIndexFailed={() => {}} // Handle potential scroll failures gracefully
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DistancePickerModal; 