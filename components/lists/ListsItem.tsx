import { TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";


export const ListItem = ({
  item,
  isEditMode,
  isSelected,
  onNavigate,
  onToggleSelection,
}: ListItemProps) => {
  return (
    <View className="bg-white rounded-lg shadow-sm mx-4 mb-3 overflow-hidden">
      <TouchableOpacity
        activeOpacity={isEditMode ? 1 : 0.7}
        onPress={() => onNavigate(item.id)}
        disabled={isEditMode}
        className="p-4 flex-row-reverse items-center justify-between bg-white"
      >
        {/* Checkbox (Visible in Edit Mode) */}
        {isEditMode && (
          <TouchableOpacity
            onPress={() => onToggleSelection(item.id)}
            className="ml-3 p-1"
          >
            <Ionicons
              name={isSelected ? "checkbox" : "square-outline"}
              size={24}
              color={isSelected ? "rgb(83, 130, 166)" : "rgb(209, 213, 219)"}
            />
          </TouchableOpacity>
        )}

        {/* Left Side Content */}
        <View className={`flex-1 ${isEditMode ? "mr-1" : ""}`}>
          <Text
            className="text-lg font-semibold text-blue-950 mb-1 text-right"
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text className="text-sm text-gray-500 text-right">
            {item.itemCount} פריטים
          </Text>
        </View>

        {/* Right Side Content */}
        <View className="items-end mr-2">
          <Text className="text-xs text-gray-500 mb-1 text-right">החל מ</Text>
          <Text className="text-lg font-bold text-blue-950 text-right">
            ₪{item.estimatedMinPrice}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
