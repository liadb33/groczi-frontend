import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, I18nManager, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"; // Using Expo's vector icons
import { router, useLocalSearchParams } from "expo-router"; // For back navigation
import FloatingEyeMenu from "@/components/ui/FloatingEyeMenu"; // Import the new component
import { LinearGradient } from "expo-linear-gradient"; // Import LinearGradient from expo-linear-gradient
import { useBookmarkStore, useCartStore, useGroceryStore, useListDetailsStore, useListStore } from "@/store";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/utils/toastConfig/toastConfig";
import CustomListModal from "@/components/grocery/CustomListModal";
import { PLACEHOLDER_IMAGE } from "@/constants/Placeholders";

const GroceryInfoScreen = () => {
  const { id: itemCode } = useLocalSearchParams<{ id: string }>();
  const {
    currentItem,
    itemStores,
    fetchItemDetail,
    fetchItemStores,
    isLoading,
    minPrice,
  } = useGroceryStore();
  const { addToCart, cartItems } = useCartStore();
  const { addToBookmarks, removeFromBookmarks, bookmarks } = useBookmarkStore();
  const { addItem, fetchList, id: currentListId, items, updateItemQuantity } = useListDetailsStore();
  const [pendingAddItemCode, setPendingAddItemCode] = useState<string | null>(
    null
  );
  const { lists, isLoading: listsLoading, fetchAllLists } = useListStore();
  const [isAddToListModalVisible, setAddToListModalVisible] = useState(false);
  
  // Enable RTL layout
  useEffect(() => {
    if (!I18nManager.isRTL) I18nManager.forceRTL(true);
  }, []);

  // --- Fetch Item Detail and Stores ---
  useEffect(() => {
    if (itemCode) {
      fetchItemDetail(itemCode);
      fetchItemStores(itemCode);
    }
  }, [itemCode]);

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('./index');
    }
  };

  const handleAddToCart = async () => {
    if (currentItem?.itemCode) {
      await addToCart(currentItem.itemCode);
      setPendingAddItemCode(currentItem.itemCode);
    }
  };

  useEffect(() => {
    if (pendingAddItemCode) {
      const found = cartItems.find(
        (item) => item.itemCode === pendingAddItemCode
      );
      if (found) {
        Toast.show({
          text1: found.quantity > 1 ? "המוצר כבר בעגלה" : "המוצר נוסף לעגלה",
          text2:
            found.quantity > 1 ? `כמות נוכחית: ${found.quantity}` : undefined,
          type: found.quantity > 1 ? "info" : "success",
          position: "bottom",
        });
        setPendingAddItemCode(null); // Reset for next add
      }
    }
  }, [cartItems, pendingAddItemCode]);

  // Define actions for the new menu buttons
  const handleHeartPress = () => {
    if (currentItem?.itemCode && !bookmarks.some(bookmark => bookmark.itemCode === currentItem.itemCode)) {
        addToBookmarks(currentItem.itemCode);
        Toast.show({
          text1: "המוצר נוסף למוצרים שלי",
          type: "error",
          position: "bottom",
        });
    } else {
      Toast.show({
        text1: "המוצר נמצא במוצרים שלי",
        type: "success",
        position: "bottom",
      });
    }
  };

  const openAddToListModal = () => {
    fetchAllLists(); // fetch the lists from your backend/store
    setAddToListModalVisible(true);
  };

  const closeAddToListModal = () => {
    setAddToListModalVisible(false);
  };


  // Add item to list
  const handleSelectList = async (listId: string) => {
    if (!currentItem?.itemCode) return;

    // First, set the active list by fetching it
    await fetchList(listId);

    // Check if item already exists in that list (from useListDetailsStore.items)
    const existingItem = items.find(
      (item) => item.itemCode === currentItem.itemCode
    );
    if (existingItem) {
      // Item already exists, increase quantity by 1
      await updateItemQuantity(currentItem.itemCode, 1);
      Toast.show({
        type: "info",
        text1: "כמות המוצר עודכנה",
        text2: `כמות נוכחית: ${existingItem.quantity + 1}`, // assuming quantity is a field
        position: "bottom",
      });
    } else {
      // Item does not exist, add new item with quantity 1
      await addItem(currentItem.itemCode, 1);
      Toast.show({
        type: "success",
        text1: "המוצר נוסף לרשימה",
        position: "bottom",
      });
    }
    setAddToListModalVisible(false);
    await fetchAllLists(); 
  };



  const handlePlusPress = () => openAddToListModal();
  const handleStarPress = () => console.log("⭐");

  if (isLoading || !currentItem) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#5382A6" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Image Header */}
        <View className="relative h-64 w-full bg-gray-50">
          <Image
            source={{
              uri: currentItem.imageUrl ?? PLACEHOLDER_IMAGE,
            }}
            className="w-full h-full rounded-t-3xl"
            resizeMode="contain"
          />
          <TouchableOpacity
            className="absolute top-4 right-4 bg-black/40 p-2 rounded-full"
            onPress={handleGoBack}
          >
            <Ionicons name="arrow-forward" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* White Container with Layered Effect */}
        <View className="bg-white rounded-t-3xl -mt-6 relative z-10 pb-20">
          {/* Basic Info */}
          <View className="px-4 pt-6 pb-5 border-b border-gray-200">
            <Text className="text-sm text-gray-500 mb-1 text-right">
              יצרן: {currentItem.manufacturerName || "לא ידוע"}
            </Text>
            <View className="flex-row-reverse justify-between items-start">
              <Text className="text-2xl font-bold text-gray-800 flex-1 ml-2 text-right">
                {currentItem.itemName}
              </Text>
              <View className="items-start">
                <Text className="text-xs text-gray-500 text-right ml-2">
                  החל מ-
                </Text>
                <Text className="text-xl font-bold text-gray-800">
                  ₪{minPrice}
                </Text>
              </View>
            </View>
            <View className="flex-row-reverse items-center mt-1">
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={16}
                color="#888"
              />
              <Text className="text-sm text-gray-600 text-right ml-1">
                {currentItem.itemName}
              </Text>
            </View>
          </View>

          {/* Add to Cart */}
          <TouchableOpacity
            className="mx-4 my-6 rounded-full shadow-lg bg-blue-500"
            onPress={handleAddToCart}
          >
            <View className="py-4 items-center justify-center">
              <Text className="text-white text-lg font-bold">הוסף לעגלה</Text>
            </View>
          </TouchableOpacity>

          {/* Stores List */}
          <View className="px-4">
            {itemStores.map((store) => (
              <View
                key={`${store.ChainId}-${store.SubChainId}-${store.StoreId}`}
                className="flex-row-reverse items-center bg-white p-4 rounded-xl mb-3 shadow-sm border border-gray-50"
              >
                {/* Store Logo - Right Side (RTL) */}
                <Image
                  source={{
                    uri: store.subchains?.imageUrl ?? PLACEHOLDER_IMAGE,
                  }}
                  className="w-12 h-12 rounded-lg bg-gray-100"
                  resizeMode="cover"
                />
                
                {/* Store Info - Middle */}
                <View className="flex-1 mx-3">
                  <Text className="text-base font-bold text-gray-900 text-right mb-1">
                    {store.StoreName}
                  </Text>
                  <Text className="text-sm text-gray-500 text-right mb-1">
                    {store.Address}, {store.City}
                  </Text>
                  <Text className="text-sm text-blue-500 text-right">
                    2 ק"מ ממך
                  </Text>
                </View>
                
                {/* Price - Left Side (RTL) */}
                <Text className="text-lg font-bold text-gray-900">
                  ₪{store.itemPrice}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <CustomListModal
          title="בחר רשימה להוספת הפריט אליה"
          visible={isAddToListModalVisible}
          lists={lists}
          loading={listsLoading}
          onClose={closeAddToListModal}
          onSelectList={handleSelectList}
        />
      </ScrollView>

      <FloatingEyeMenu
        onHeartPress={handleHeartPress}
        onPlusPress={handlePlusPress}
        onStarPress={handleStarPress}
      />

      <Toast config={toastConfig} />
    </SafeAreaView>
  );
};

export default GroceryInfoScreen;
