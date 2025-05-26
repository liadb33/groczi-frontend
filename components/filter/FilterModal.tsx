import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// RTL styles
const rtlStyles = StyleSheet.create({
  container: {
    direction: 'rtl',
  },
  textRight: {
    textAlign: 'right',
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
});

// Define the props the component will accept
interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;
  selectedCategories: string[];
  toggleCategorySelection: (category: string) => void;
  priceRange: { min: number; max: number };
  // TODO: Add props for handling price range changes if a slider component is added
  selectedCompany: string;
  // TODO: Add props for handling company selection changes
  availableCategories?: string[]; // Optional: Pass available categories if dynamic
  isRTL?: boolean;
  applyButtonText?: string;
  resetButtonText?: string;
  filterTitle?: string;
}

const defaultCategories = [
  "Fruits", "Meats", "Vegetables", "Beacon", "Drinks",
  "Protein", "Beverages", "Cereal",
];

const FilterModal: React.FC<FilterModalProps> = ({
  isVisible,
  onClose,
  onApply,
  onReset,
  selectedCategories,
  toggleCategorySelection,
  priceRange,
  selectedCompany,
  availableCategories = defaultCategories, // Use default or passed categories
  isRTL = false,
  applyButtonText = "Apply",
  resetButtonText = "Reset",
  filterTitle = "Filter By",
}) => {
  const hebrewCategories = isRTL ? [
    "פירות", "בשרים", "ירקות", "בייקון", "משקאות",
    "חלבון", "שתייה", "דגנים",
  ] : defaultCategories;

  const categories = isRTL ? hebrewCategories : availableCategories;

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      swipeDirection="down"
      onSwipeComplete={({ swipingDirection }) => {
        if (swipingDirection === "down") {
          onClose();
        }
      }}
      style={{ margin: 0, justifyContent: "flex-end" }}
      propagateSwipe={true}
      backdropOpacity={0.5}
      useNativeDriverForBackdrop={true} // Note: May need adjustment based on content complexity
      statusBarTranslucent={true}
      swipeThreshold={20} // Lower threshold for easier swipe down
    >
      <View 
        className="bg-white rounded-t-3xl p-6"
        style={{ maxHeight: "80%", ...(isRTL ? rtlStyles.container : {}) }} // Limit height
      >
        {/* Drag Handle */}
        <View className="w-10 h-1 bg-gray-300 rounded-full self-center mb-4" />

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Filter By Header */}
          <View className="relative flex-row justify-center items-center mb-8" 
                style={isRTL ? rtlStyles.rowReverse : {}}>
            <Text className="text-2xl font-bold text-gray-800">{filterTitle}</Text>
            <TouchableOpacity 
              className="absolute right-0" 
              style={isRTL ? { right: 'auto', left: 0 } : {}}
              onPress={onReset}
            >
              <Text className="text-blue-500 text-base">{resetButtonText}</Text>
            </TouchableOpacity>
          </View>

          {/* Categories Section */}
          <Text className="text-xl font-bold text-gray-800 mb-4" 
                style={isRTL ? rtlStyles.textRight : {}}>
            {isRTL ? "קטגוריות" : "Categories"}
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                className={`py-3 px-5 rounded-full ${
                  selectedCategories.includes(category)
                    ? "bg-blue-500"
                    : "bg-gray-100"
                }`}
                onPress={() => toggleCategorySelection(category)}
              >
                <Text
                  className={`${
                    selectedCategories.includes(category)
                      ? "text-white"
                      : "text-gray-800"
                  } font-medium`}
                  style={isRTL ? rtlStyles.textRight : {}}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Food Creation Companies Section */}
          <Text className="text-xl font-bold text-gray-800 mb-4"
                style={isRTL ? rtlStyles.textRight : {}}>
            {isRTL ? "חברות יצרניות מזון" : "Food Creation Companies"}
          </Text>
          {/* TODO: Replace with a proper dropdown/selection component */}
          <View className="mb-8 p-4 bg-gray-100 rounded-xl">
            <Text className="text-gray-500 text-center">
              {isRTL ? "בחר חברה מהרשימה" : "Select a company from the list"}
            </Text>
          </View>

          {/* Price Range Section */}
          <Text className="text-xl font-bold text-gray-800 mb-4"
                style={isRTL ? rtlStyles.textRight : {}}>
            {isRTL ? "טווח מחירים" : "Price Range"}
          </Text>
          <View className="mb-8">
            {/* Price range slider would go here */}
            <View className="flex-row justify-between">
              <Text className="text-gray-600">${priceRange.min}</Text>
              <Text className="text-gray-600">${priceRange.max}</Text>
            </View>
          </View>

          {/* Apply Button */}
          <TouchableOpacity
            className="bg-blue-500 py-4 rounded-xl mb-4"
            onPress={onApply}
          >
            <Text className="text-white text-center font-bold text-lg">
              {applyButtonText}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default FilterModal; 