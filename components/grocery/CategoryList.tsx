import React from 'react';
import { View, Text, FlatList, TouchableOpacity, I18nManager } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export interface CategoryListProps {
  categories: Category[];
  onCategoryPress?: (category: Category) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  onCategoryPress = () => {},
}) => {
  const renderItem = ({ item }: { item: Category }) => (
    <TouchableOpacity 
      className="w-20 items-center mx-2"
      onPress={() => onCategoryPress(item)}
    >
      <View 
        className="w-[60px] h-[60px] rounded-full bg-blue-50 justify-center items-center mb-1"
      >
        <MaterialCommunityIcons 
          name={item.icon as any} 
          size={28} 
          color="#5180C6" 
        />
      </View>
      <Text 
        className="text-sm font-medium text-gray-800 text-center"
        numberOfLines={2}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="mb-5">
      <View style={{ direction: 'ltr' }}>
        <FlatList
          data={categories}
          renderItem={renderItem}
          inverted={I18nManager.isRTL}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
          }}
          scrollEnabled={true}
          bounces={true}
        />
      </View>
    </View>
  );
};

export default CategoryList; 