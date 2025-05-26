import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';

// Import components
import SwipeDeleteItem from '@/components/SwipeDeleteItem';
import { AddListModal } from '@/components/lists/AddListModal';
import { ListFooter } from '@/components/lists/ListFooter';
import { ListsHeader } from '@/components/lists/ListsHeader';
import { ListItem } from '@/components/lists/ListsItem';
import { useListStore } from '@/store';


export default function MyListsScreen() {
  const router = useRouter();

  // State Management
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedListIds, setSelectedListIds] = useState<string[]>([]);
  
  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newListName, setNewListName] = useState("");

  // List Store
  const { lists, fetchAllLists, addNewList, removeLists, isLoading } = useListStore();

  useEffect(() => {
    fetchAllLists();
  }, []);

  // --- Handlers ---
  const handleNavigateBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("./index"); // Navigate to the root path
    }
  };

  const handleToggleEditMode = () => {
    setIsEditMode((prev) => {
      if (prev) {
        setSelectedListIds([]); // Clear selections when exiting edit mode
      }
      return !prev;
    });
  };

  const handleAddList = () => {
    setNewListName(""); // Reset the input field
    setIsModalVisible(true);
  };

  const handleCreateNewList = async () => {
    const trimmedName = newListName.trim();

    if (!trimmedName) {
      Alert.alert("Error", "List name cannot be empty", [{ text: "OK" }]);
      return;
    }

    const isDuplicate = lists.some(
      (list) => list.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (isDuplicate) {
      Alert.alert(
        "Duplicate List Name",
        "A list with this name already exists.",
        [{ text: "OK" }]
      );
      return;
    }

    await addNewList(trimmedName);
    setIsModalVisible(false);
  };

  const handleDeleteList = useCallback(
    async (listId: string) => {
      await removeLists([listId]);
    },
    [removeLists]
  );

  const handleToggleSelection = (listId: string) => {
    setSelectedListIds((prev) =>
      prev.includes(listId)
        ? prev.filter((id) => id !== listId)
        : [...prev, listId]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedListIds.length === 0) return;

    Alert.alert(
      "מחיקת רשימות נבחרות?",
      `האם אתה בטוח שברצונך למחוק ${selectedListIds.length} רשימה(ות)? פעולה זו אינה ניתנת לביטול.`,
      [
        { text: "בטל", style: "cancel" },
        {
          text: "מחק",
          style: "destructive",
          onPress: async () => {
            await removeLists(selectedListIds);
            setIsEditMode(false);
            setSelectedListIds([]);
          },
        },
      ]
    );

  };
  //console.log(lists);

  const handleNavigateToList = (listId: string) => {
    if (isEditMode) return; // Don't navigate in edit mode
    console.log(`Navigating to list details: ${listId}`);
    // Find the list to get its name
    const selectedList = lists.find(list => list.id === listId);
    router.push({
      pathname: "../listInfo",
      params: { id: listId, name: selectedList?.name || 'רשימת קניות' }
    });
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#5382A6" />
      </View>
    );
  }
  

  // --- Main Return ---
  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />

      <ListsHeader
        isEditMode={isEditMode}
        selectedListIds={selectedListIds}
        onToggleEditMode={handleToggleEditMode}
        onNavigateBack={handleNavigateBack}
        onAddList={handleAddList}
        onDeleteSelected={handleDeleteSelected}
      />

      <SwipeDeleteItem
        data={lists}
        renderItem={(item) => (
          <ListItem
            item={item}
            isEditMode={isEditMode}
            isSelected={selectedListIds.includes(item.id)}
            onNavigate={handleNavigateToList}
            onToggleSelection={handleToggleSelection}
          />
        )}
        onDelete={handleDeleteList}
        contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
        ListFooterComponent={<ListFooter onAddList={handleAddList} />}
      />

      <AddListModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleCreateNewList}
        listName={newListName}
        onChangeListName={setNewListName}
      />
    </View>
  );
}