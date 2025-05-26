import { View, Modal, Text, TextInput, TouchableOpacity } from "react-native";


export const AddListModal = ({
  visible,
  onClose,
  onSave,
  listName,
  onChangeListName,
}: AddListModalProps) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
      >
        <View className="bg-white rounded-lg p-6 w-[80%] shadow-lg">
          <Text className="text-lg font-semibold text-blue-950 mb-4 text-right">
            הוסף/י רשימה חדשה
          </Text>

          <TextInput
            value={listName}
            onChangeText={onChangeListName}
            className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-base text-right"
            placeholder="הכנס/י שם לרשימה"
            autoFocus={true}
          />

          <View className="flex-row-reverse justify-end">
            <TouchableOpacity onPress={onClose} className="px-4 py-2 ml-2">
              <Text className="text-gray-600 font-medium text-right">ביטול</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onSave}
              className="px-4 py-2 bg-blue-500 rounded-lg"
            >
              <Text className="text-white font-medium text-right">אישור</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
