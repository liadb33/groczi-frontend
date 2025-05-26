import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export interface Category {
  id: number;
  name: string;
  icon: string;
}

export interface CategoryListProps {
  categories: Category[];
  onCategoryPress?: (category: Category) => void;
  isRTL?: boolean;
}

const rtlStyles = StyleSheet.create({
  container: {
    direction: 'rtl',
    transform: [{ scaleX: -1 }]
  },
  item: {
    transform: [{ scaleX: -1 }]
  },
  text: {
    textAlign: 'right'
  }
});

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  onCategoryPress = () => {},
  isRTL = false,
}) => {
  const renderItem = ({ item }: { item: Category }) => (
    <View style={isRTL ? rtlStyles.item : {}}>
      <TouchableOpacity 
        className="w-20 items-center mr-4"
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
          style={isRTL ? rtlStyles.text : {}}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="mb-5">
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
        }}
        style={isRTL ? rtlStyles.container : {}}
      />
    </View>
  );
};

export default CategoryList; 