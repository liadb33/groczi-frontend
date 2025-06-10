import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCategoryStore } from '@/store';
import { router } from 'expo-router';

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
  onApply?: () => void; // Make optional since we'll handle navigation internally
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

const FilterModal: React.FC<FilterModalProps> = ({
  isVisible,
  onClose,
  onApply,
  onReset,
  selectedCategories,
  toggleCategorySelection,
  priceRange,
  selectedCompany,
  availableCategories, // Optional override, otherwise use store
  isRTL = false,
  applyButtonText = "Apply",
  resetButtonText = "Reset",
  filterTitle = "Filter By",
}) => {
  const { categories: storeCategories, fetchCategories } = useCategoryStore();
  
  // Fetch categories when modal becomes visible
  useEffect(() => {
    if (isVisible) {
      fetchCategories();
    }
  }, [isVisible, fetchCategories]);
  
  const categories = availableCategories || storeCategories;

  // Handle apply button press
  const handleApply = () => {
    if (selectedCategories.length > 0) {
      // Navigate to groceryResults with selected categories
      router.push({
        pathname: "../groceryResults",
        params: { 
          categories: selectedCategories.join("|"), // Use pipe separator as expected by API
          isMultiCategory: "true" // Flag to indicate multi-category mode
        },
      });
      onClose(); // Close the modal
    } else {
      // If no categories selected, just call the original onApply if provided
      onApply?.();
    }
  };

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
          <View className="flex-row flex-wrap mb-8" style={{ gap: 8 }}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                className={`py-2 px-3 rounded-xl mb-2 ${
                  selectedCategories.includes(category)
                    ? "bg-blue-500"
                    : "bg-gray-100"
                }`}
                style={{ 
                  flexShrink: 1,
                  minWidth: '45%',
                  maxWidth: '100%'
                }}
                onPress={() => toggleCategorySelection(category)}
              >
                <Text
                  className={`${
                    selectedCategories.includes(category)
                      ? "text-white"
                      : "text-gray-800"
                  } font-medium text-sm`}
                  style={{ 
                    textAlign: "left",
                    lineHeight: 18
                  }}
                  numberOfLines={2}
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

          {/* Apply Button */}
          <TouchableOpacity
            className={`py-4 rounded-xl mb-4 ${
              selectedCategories.length > 0 ? "bg-blue-500" : "bg-gray-300"
            }`}
            onPress={handleApply}
            disabled={selectedCategories.length === 0}
          >
            <Text className={`text-center font-bold text-lg ${
              selectedCategories.length > 0 ? "text-white" : "text-gray-500"
            }`}>
              {selectedCategories.length > 0 
                ? `${applyButtonText} (${selectedCategories.length})`
                : applyButtonText
              }
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default FilterModal; 