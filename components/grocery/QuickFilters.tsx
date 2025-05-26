import { FlatList, View, StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';

const rtlStyles = StyleSheet.create({
  container: {
    direction: 'rtl',
    transform: [{ scaleX: -1 }]
  },
  item: {
    transform: [{ scaleX: -1 }]
  }
});

export const QuickFilters: React.FC<QuickFiltersProps> = ({
  filters,
  onFilterPress = () => {},
  isRTL = false,
}) => {
  return (
    <FlatList 
      data={filters}
      horizontal 
      showsHorizontalScrollIndicator={false} 
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 8, paddingTop: 4 }}
      style={isRTL ? rtlStyles.container : {}}
      renderItem={({ item }) => (
        <View style={isRTL ? rtlStyles.item : {}}>
          <Chip 
            style={{ marginRight: 8, backgroundColor: '#f1f1f1', height: 35, paddingHorizontal: 5, borderRadius: 25 }}
            onPress={() => onFilterPress(item)}
          >
            {item}
          </Chip>
        </View>
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

export default QuickFilters; 