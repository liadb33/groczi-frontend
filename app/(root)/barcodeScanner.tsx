import React, { useState, useEffect } from "react";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

const BarcodeScannerScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    // Navigate to groceryInfo with the scanned barcode as itemCode
    router.push({
      pathname: "./groceryInfo",
      params: { id: data },
    });
  };

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('./index');
    }
  };

  // Loading state while permission is being requested
  if (!permission) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar style="dark" />
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-600">מבקש הרשאות מצלמה...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Permission denied
  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar style="dark" />
        <View className="flex-1 justify-center items-center px-6">
          <View className="items-center">
            <Ionicons name="camera-outline" size={80} color="#ef4444" />
            <Text className="text-xl font-bold text-gray-800 text-center mt-4 mb-2">
              נדרשת הרשאת מצלמה
            </Text>
            <Text className="text-gray-600 text-center mb-6">
              כדי לסרוק ברקוד, נדרשת גישה למצלמה
            </Text>
            <TouchableOpacity
              className="bg-blue-500 px-6 py-3 rounded-full"
              onPress={requestPermission}
            >
              <Text className="text-white font-bold">אפשר גישה למצלמה</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="mt-4 px-6 py-3"
              onPress={handleGoBack}
            >
              <Text className="text-blue-500 font-bold">חזור</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
      <StatusBar style="light" />
      
      {/* Camera View */}
      <View className="flex-1 relative">
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["ean13", "ean8", "upc_a", "code128", "code39"],
          }}
        />

        {/* Header with back button */}
        <View className="absolute top-4 left-0 right-0 flex-row justify-between items-center px-4 z-10">
          <TouchableOpacity
            className="bg-black/50 p-2 rounded-full"
            onPress={handleGoBack}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-bold">סריקת ברקוד</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Scanning overlay */}
        <View className="absolute inset-0 justify-center items-center">
          <View className="relative">
            {/* Scanning frame */}
            <View className="w-64 h-64 border-2 border-white rounded-lg">
              {/* Corner indicators */}
              <View className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-blue-500" />
              <View className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-blue-500" />
              <View className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-blue-500" />
              <View className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-blue-500" />
            </View>
            
            {/* Instructions */}
            <Text className="text-white text-center mt-6 px-4">
              מרכז את הברקוד בתוך המסגרת
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default BarcodeScannerScreen;
