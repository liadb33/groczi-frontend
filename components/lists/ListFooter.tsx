import { TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";


export const ListFooter = ({ onAddList }: ListFooterProps) => {
  return (
    <TouchableOpacity
      onPress={onAddList}
      className="bg-white rounded-lg shadow-sm mx-4 my-4 p-4 flex-row items-center justify-center border border-gray-200"
      activeOpacity={0.8}
    >
      <Text className="text-base font-bold text-blue-500">
        הוסף/י רשימה חדשה
      </Text>
      
      <Ionicons
        name="add-circle-outline"
        size={24}
        color="rgb(83, 130, 166)"
        className="mr-2 ml-3"
      />
    </TouchableOpacity>
  );
};