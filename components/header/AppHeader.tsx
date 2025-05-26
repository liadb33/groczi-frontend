import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Platform,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Settings } from "lucide-react-native";

interface AppHeaderProps {
  title: string;
  onBackPress?: () => void;
  onSettingsPress?: () => void;
  showBackButton?: boolean;
  showSettingsButton?: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  onBackPress,
  onSettingsPress,
  showBackButton = true,
  showSettingsButton = true,
}) => {
  const router = useRouter();
  const statusBarHeight = StatusBar.currentHeight || 0;

  const handleNavigateBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/');
      }
    }
  };

  const handleOpenSettings = () => {
    if (onSettingsPress) {
      onSettingsPress();
    } else {
      router.push('../settings');
    }
  };

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      <View
        className="bg-white border-b border-gray-200 mb-4"
        style={{
          paddingTop: Platform.OS === "android" ? statusBarHeight : 0,
        }}
      >
        <View className="flex-row items-center justify-between px-4 py-3">
          {showBackButton ? (
            <TouchableOpacity onPress={handleNavigateBack}>
              <Ionicons name="arrow-back" size={28} color="#08263E" />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 28 }} />
          )}
          
          <Text className="text-xl font-bold text-[#08263E]">{title}</Text>
          
          {showSettingsButton ? (
            <TouchableOpacity onPress={handleOpenSettings} className="p-1">
              <Settings color="#08263E" size={26} />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 26 }} />
          )}
        </View>
      </View>
    </>
  );
};

export default AppHeader; 