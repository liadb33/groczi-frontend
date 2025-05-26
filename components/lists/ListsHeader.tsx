import { StatusBar, Platform, View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const ListsHeader = ({
  isEditMode,
  selectedListIds,
  onToggleEditMode,
  onNavigateBack,
  onAddList,
  onDeleteSelected,
}: ListsHeaderProps) => {
  const statusBarHeight =
    Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;

  return (
    <View
      style={{
        paddingTop: statusBarHeight,
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
      }}
    >
      <View className="flex-row items-center justify-between px-4 py-3">
        {/* Left Icon: Back or Cancel */}
        <TouchableOpacity
          onPress={isEditMode ? onToggleEditMode : onNavigateBack}
          className="p-1"
        >
          <Ionicons
            name={isEditMode ? "close" : "arrow-back"}
            size={28}
            color="rgb(8, 38, 62)"
          />
        </TouchableOpacity>

        {/* Title */}
        <Text className="flex-1 text-center text-xl font-bold text-blue-950">
          {isEditMode
            ? `בחירת רשימות (${selectedListIds.length})`
            : "רשימות שלי"}
        </Text>

        {/* Right Icons: Edit/Delete or Add */}
        <View className="flex-row items-center">
          {isEditMode ? (
            <TouchableOpacity
              onPress={onDeleteSelected}
              className="p-1"
              disabled={selectedListIds.length === 0}
            >
              <Ionicons
                name="trash-outline"
                size={26}
                color={
                  selectedListIds.length > 0
                    ? "rgb(239, 68, 68)"
                    : "rgb(209, 213, 219)"
                }
              />
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity onPress={onToggleEditMode} className="p-1 mr-2">
                <Ionicons
                  name="pencil-outline"
                  size={24}
                  color="rgb(8, 38, 62)"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={onAddList} className="p-1">
                <Ionicons
                  name="add-circle-outline"
                  size={28}
                  color="rgb(8, 38, 62)"
                />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
};
