import React from 'react';
import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="settings"
        options={{
          title: "Settings",
          headerShown: true,
          headerBackTitle: "Back",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="RequestsPage"
        options={{
          title: "Requests",
          headerShown: true,
          headerBackTitle: "Back",
          headerTitleAlign: "center",
        }}
      />

      <Stack.Screen
        name="LoginPage"
        options={{
          title: "Login",
          headerShown: true,
          headerBackTitle: "Back",
          headerTitleAlign: "center",
        }}
      />
      {/* <Stack.Screen name = "location" options={{
                title: "Location",
                headerShown: true,
                headerBackTitle: "Back",
                headerTitleAlign: 'center',
            }}
            /> */}
      <Stack.Screen
        name="groceryInfo"
        options={{
          title: "Grocery Info",
          headerShown: false,
          headerBackTitle: "Back",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="comparePrices"
        options={{
          title: "Compare Prices",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="groceryResults"
        options={{
          title: "Grocery Results",
          headerShown: false,
          headerBackTitle: "Back",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen name="barcodeScanner" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
