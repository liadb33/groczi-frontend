import React from 'react';
import { View, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SwipeListView, RowMap } from 'react-native-swipe-list-view';

// Get screen width for swipe calculations
const SCREEN_WIDTH = Dimensions.get("window").width;

// Generic type for items to be swiped
type SwipeableItem = {
  id: string;
};

interface SwipeDeleteItemProps<T extends SwipeableItem> {
  data: T[];
  renderItem: (item: T) => React.ReactElement;
  onDelete: (id: string) => void;
  keyExtractor?: (item: T) => string;
  contentContainerStyle?: object;
  isRTL?: boolean;
  ListFooterComponent?: React.ReactElement | null;
}

function SwipeDeleteItem<T extends SwipeableItem>({
  data,
  renderItem,
  onDelete,
  keyExtractor = (item) => item.id,
  contentContainerStyle = {},
  isRTL = false,
  ListFooterComponent = null,
}: SwipeDeleteItemProps<T>) {
  
  // Render the hidden delete button
  const renderHiddenItem = (
    data: { item: T },
    rowMap: RowMap<T>
  ) => (
    <View className="flex-1 flex-row justify-end items-center pr-4 mb-4">
      <View className="rounded-lg w-[75px] h-full flex justify-center items-center">
        <Ionicons name="trash-outline" size={28} color="red" />
      </View>
    </View>
  );

  // Handler for when a row is swiped open
  const onRowOpen = (rowKey: string) => {
    // Add a short delay to allow the animation to complete visually
    setTimeout(() => {
      onDelete(rowKey);
    }, 300); // 300ms delay for animation
  };

  return (
    <SwipeListView
      data={data}
      renderItem={({ item }) => renderItem(item)}
      renderHiddenItem={renderHiddenItem}
      rightOpenValue={-SCREEN_WIDTH} // Only need to swipe 75 units to trigger delete
      disableRightSwipe={isRTL} // Disable right swipe in LTR mode
      disableLeftSwipe={isRTL} // Disable left swipe in RTL mode
      leftOpenValue={isRTL ? SCREEN_WIDTH : 0} // Use left open value in RTL mode
      keyExtractor={keyExtractor}
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={false}
      onRowOpen={onRowOpen}
      previewRowKey={""}
      closeOnRowOpen={false}
      friction={8}
      tension={10}
      ListFooterComponent={ListFooterComponent}
    />
  );
}

export default SwipeDeleteItem; 