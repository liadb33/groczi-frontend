import { View, Text, TouchableOpacity, Image } from "react-native";
import Map from "@/components/Map";
import GoogleTextInput from "@/components/GoogleTextInput";
import { useLocationStore } from "@/store";
import { useState } from "react";

const Location = () => {
  const { setDestinationLocation} = useLocationStore();
  const [selectedMarker, setSelectedMarker] = useState<Store | null>(null);

  // For autocomplete input
  const handlePlaceSelect = ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setDestinationLocation({ latitude, longitude, address });
  };

  

  return (
    <View className="flex-1">
      {/* Map */}
      <Map onMarkerSelect={setSelectedMarker} />

      {/* Search Bar */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 30,
          zIndex: 1000,
          paddingHorizontal: 20,
          marginTop: 2,
          marginBottom: 20,
        }}
      >
        <GoogleTextInput
          placeholder="Search for a location..."
          handlePress={handlePlaceSelect}
          enableAutoComplete={true}
        />
      </View>

      {/* Floating Info Panel */}
      {selectedMarker && (
        <View
          className="absolute left-5 right-5 bottom-5 bg-white rounded-2xl p-4 shadow-lg z-50"
          style={{ elevation: 5 }}
        >
          <View className="flex-row-reverse items-center mb-4">
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1569470451072-68314f596aec?q=80&w=2662&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              }}
              className="w-12 h-12 rounded-full bg-black ml-4"
              resizeMode="cover"
            />
            <View className="flex-1">
              <Text className="text-lg font-bold mb-1 text-right">
                {selectedMarker.StoreName}
              </Text>
              <Text className="text-base text-gray-500 text-right">
                {selectedMarker.Address}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            className="bg-blue-500 py-3 rounded-lg items-center"
            onPress={() => {
              setDestinationLocation({
                latitude: selectedMarker.Latitude ?? 0,
                longitude: selectedMarker.Longitude ?? 0,
                address: selectedMarker.Address ?? "",
              });
            }}
          >
            <Text className="text-white font-medium">ניווט</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Location;
