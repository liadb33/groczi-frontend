import { View, Text, TouchableOpacity, Image, Linking, Platform, ScrollView } from "react-native";
import Map from "@/components/location/Map";
import GoogleTextInput from "@/components/ui/GoogleTextInput";
import { useLocationStore, useStores } from "@/store";
import { useState, useMemo } from "react";

const Location = () => {
  const { setDestinationLocation} = useLocationStore();
  const [selectedMarker, setSelectedMarker] = useState<Store | null>(null);
  const [showWebsiteStores, setShowWebsiteStores] = useState(false);
  
  // Get stores data
  const { stores } = useStores();
  
  // Filter website stores (those starting with "אתר" and without coordinates)
  const websiteStores = useMemo(() => {
    return stores.filter(store => 
      store.StoreName?.startsWith("אתר") && 
      (store.Latitude === null || store.Longitude === null)
    );
  }, [stores]);

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

  // Function to open system navigation chooser
  const openNavigationChooser = (latitude: number, longitude: number, address: string) => {
    // Use the platform-specific Google Maps URL that will trigger the system chooser
    const googleMapsUrl = Platform.OS === 'ios' 
      ? `comgooglemaps://?daddr=${latitude},${longitude}&directionsmode=driving`
      : `google.navigation:q=${latitude},${longitude}`;
    
    // This will directly open the system navigation chooser
    Linking.openURL(googleMapsUrl).catch(error => {
      console.error('Error opening navigation:', error);
    });
  };

  // Function to handle website store press
  const handleWebsiteStorePress = (store: Store) => {
    // You can customize this based on how you want to handle website stores
    console.log('Website store pressed:', store.StoreName);
    // You could add logic here to open their website or show more details
  };

  return (
    <View className="flex-1">
      {/* Map */}
      <Map onMarkerSelect={setSelectedMarker} />

      {/* Search Bar */}
      <View className="absolute top-0 left-0 right-8 z-50 px-5 mt-0.5 mb-5">
        <GoogleTextInput
          placeholder="Search for a location..."
          handlePress={handlePlaceSelect}
          enableAutoComplete={true}
        />
      </View>

      {/* Website Stores Button - positioned below map's GPS button */}
      {websiteStores.length > 0 && (
        <TouchableOpacity
          className="absolute top-20 right-3 z-40 bg-white rounded-lg w-12 h-12 justify-center items-center shadow-lg border border-gray-300"
          style={{ elevation: 5 }}
          onPress={() => setShowWebsiteStores(!showWebsiteStores)}
          activeOpacity={0.7}
        >
          <Text className="text-lg">🌐</Text>
          {websiteStores.length > 0 && (
            <View className="absolute -top-1.5 -right-1.5 bg-red-500 rounded-xl min-w-5 h-5 justify-center items-center px-1 border-2 border-white">
              <Text className="text-white text-xs font-bold leading-3">
                {websiteStores.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      )}

      {/* Website Stores Floating Panel */}
      {showWebsiteStores && websiteStores.length > 0 && (
        <View
          className="absolute bottom-52 left-10 right-10 z-40 bg-white rounded-2xl p-5 shadow-xl"
          style={{ maxHeight: 280, elevation: 8 }}
        >
          {/* Panel Header */}
          <View className="flex-row justify-between  mb-4">
            <Text className="text-lg font-bold text-gray-800">אתרי קנייה מקוונים</Text>
                                <TouchableOpacity
                      onPress={() => setShowWebsiteStores(false)}
                      className="p-1"
                    >
                      <Text className="text-xl text-gray-500">✕</Text>
                    </TouchableOpacity>
          </View>
          
                      {/* Stores List */}
            <ScrollView 
              showsVerticalScrollIndicator={false}
              className="max-h-56"
            >
                          {websiteStores.map((store, index) => (
                <TouchableOpacity
                  key={`${store.ChainId}-${store.SubChainId}-${store.StoreId}`}
                  className={`flex-row items-center py-3 px-2 rounded-lg ${
                    index < websiteStores.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                  onPress={() => handleWebsiteStorePress(store)}
                  activeOpacity={0.7}
                >
                <Image
                  source={{
                    uri: store.subchains?.imageUrl || "https://images.unsplash.com/photo-1569470451072-68314f596aec?q=80&w=2662&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  }}
                  className="w-12 h-12 rounded-full bg-gray-200 ml-4"
                  resizeMode="contain"
                />
                <View className="flex-1">
                  <Text className="font-semibold text-base text-gray-800 text-right mb-1">
                    {store.StoreName}
                  </Text>
                  <View className="flex-row justify-end items-center">
                    <Text className="text-sm text-blue-600 text-right mr-1">אתר מקוון</Text>
                                          <Text className="text-xs">🔗</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          {/* Panel Footer */}
          <View className="mt-3 pt-3 border-t border-gray-200">
            <Text className="text-xs text-gray-500 text-center">
              לחץ על חנות לפתיחת האתר
            </Text>
          </View>
        </View>
      )}

      {/* Floating Info Panel */}
      {selectedMarker && (
        <View
          className="absolute left-5 right-5 bottom-5 bg-white rounded-2xl p-4 shadow-lg z-50"
          style={{ elevation: 5 }}
        >
          <View className="flex-row-reverse items-center mb-4">
            <Image
              source={{
                uri: selectedMarker.subchains?.imageUrl || "https://images.unsplash.com/photo-1569470451072-68314f596aec?q=80&w=2662&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              }}
              className="w-12 h-12 rounded-full ml-4"
              resizeMode="contain"
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
              if (selectedMarker?.Latitude && selectedMarker?.Longitude) {
                openNavigationChooser(
                  selectedMarker.Latitude,
                  selectedMarker.Longitude,
                  selectedMarker.Address ?? ""
                );
              }
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
