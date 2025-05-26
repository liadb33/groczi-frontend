import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import { 
  Home,
  ShoppingBag,
  ShoppingCart,
  ClipboardList, 
  ArrowLeft,
  Settings
} from "lucide-react-native";

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "בית",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "עגלה",
          tabBarIcon: ({ color, size }) => (
            <ShoppingCart color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-groceries"
        options={{
          title: "מוצרים שלי",
          tabBarIcon: ({ color, size }) => (
            <ShoppingBag color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-lists"
        options={{
          title: "רשימות שלי",
          tabBarIcon: ({ color, size }) => (
            <ClipboardList color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="location" // Corresponds to specialScreen.tsx
        options={{
          // THIS IS THE IMPORTANT PART: Hides it from the tab bar
          href: null,

          // Optional: Set a title for the header if this screen should have one
          title: "מיקום",
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].background,
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.navigate('/')}
              className='ml-4 mt-1'
            >
              <ArrowLeft size={26} color={Colors[colorScheme ?? "light"].text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity className='mr-4 mt-1' onPress={() => router.navigate('../settings')}>
              <Settings size={26} color={Colors[colorScheme ?? "light"].text} />
            </TouchableOpacity>
          ),
        }}
      />
    </Tabs>
  );
}
