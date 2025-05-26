import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ListItem {
  id: string;
  name: string;
  itemCount?: number;
}

interface AddGroceryToListModalProps {
  title: string;
  visible: boolean;
  lists: ListItem[];
  loading: boolean;
  onClose: () => void;
  onSelectList: (listId: string) => void;
}

const CustomListModal: React.FC<AddGroceryToListModalProps> = ({
  title,
  visible,
  lists,
  loading,
  onClose,
  onSelectList,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Detect taps outside the modal */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/40 justify-center items-center">
          {/* TouchableWithoutFeedback will catch taps on this background */}

          {/* Prevent taps inside modal content from closing it */}
          <TouchableWithoutFeedback onPress={() => {}}>
            <View className="w-4/5 max-h-1/2 bg-white rounded-2xl p-4 shadow-lg">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-xl font-bold text-center flex-1 ">
                  {title}
                </Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={28} color="#3B82F6" />
                </TouchableOpacity>
              </View>

              {loading ? (
                <View className="py-4 items-center">
                  <ActivityIndicator size="large" color="#5382A6" />
                </View>
              ) : lists.length === 0 ? (
                <Text className="text-base text-center py-4">
                  לא נמצאו רשימות. צור רשימה חדשה תחילה.
                </Text>
              ) : (
                <FlatList
                  data={lists}
                  keyExtractor={(item) => item.id}
                  style={{ maxHeight: 240 }}
                  nestedScrollEnabled
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      className="bg-white rounded-lg p-4 mb-3 flex-row-reverse items-center shadow-sm"
                      onPress={() => onSelectList?.(item.id)}
                    >
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-right mb-1">
                          {item.name}
                        </Text>
                        {item.itemCount !== undefined && (
                          <Text className="text-sm text-gray-500 text-right">
                            {item.itemCount} פריטים
                          </Text>
                        )}
                      </View>
                      <Ionicons name="chevron-back" size={24} color="#3B82F6" />
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CustomListModal;
