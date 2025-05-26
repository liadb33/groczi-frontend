import {
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  StyleSheet,
} from "react-native";
import React, { useState } from 'react';
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Search } from "lucide-react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const googlePlacesApiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

const rtlStyles = StyleSheet.create({
  container: {
    direction: 'rtl',
  },
  textInput: {
    textAlign: 'right',
  },
  row: {
    flexDirection: 'row-reverse',
  },
});

const GoogleTextInput = ({
  initialLocation,
  containerStyle,
  textInputBackgroundColor,
  placeholder, 
  enableAutoComplete = false,
  handlePress,
  renderRightButton,
  isRTL = false,
}: GoogleInputProps) => {
  const [searchText, setSearchText] = useState('');

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        className={`px-4 mt-2 mb-3 ${containerStyle}`}
      >
        <View className="rounded-full bg-white shadow-sm">
          {enableAutoComplete ? (
            <GooglePlacesAutocomplete
              fetchDetails={true}
              placeholder={placeholder ?? "Search..."}
              debounce={200}
              styles={{
                container: {
                  flex: 0,
                  ...(isRTL ? rtlStyles.container : {}),
                },
                textInputContainer: {
                  backgroundColor: "white",
                  flexDirection: isRTL ? "row-reverse" : "row",
                  alignItems: "center",
                  borderRadius: 28,
                  paddingHorizontal: 10,
                  height: 50,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                  elevation: 1,
                },
                textInput: {
                  backgroundColor: "transparent",
                  fontSize: 16,
                  fontWeight: "500",
                  color: "#000",
                  marginTop: 5,
                  paddingLeft: isRTL ? 35 : 10,
                  paddingRight: isRTL ? 10 : 35,
                  flex: 1,
                  height: 45,
                  textAlign: isRTL ? 'right' : 'left',
                },
                listView: {
                  backgroundColor: "white",
                  position: "relative",
                  top: 5,
                  borderRadius: 8,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                  zIndex: 99,
                },
                row: {
                  padding: 15,
                  ...(isRTL ? rtlStyles.row : {}),
                },
              }}
              onPress={(data, details = null) => {
                handlePress({
                  latitude: details?.geometry?.location.lat!,
                  longitude: details?.geometry?.location.lng!,
                  address: data.description,
                });
              }}
              query={{
                key: googlePlacesApiKey,
                language: isRTL ? "he" : "en",
                components: "country:il",
              }}
              renderLeftButton={() => (
                <View className="justify-center items-center ml-1">
                  <Search size={22} color="#5382A6" />
                </View>
              )}
              renderRightButton={renderRightButton}
              textInputProps={{
                placeholderTextColor: "gray",
                placeholder: initialLocation ?? placeholder ?? "Search...",
              }}
              onFail={(error) => console.error(error)}
            />
          ) : (
            <View style={{ 
              flexDirection: isRTL ? 'row-reverse' : 'row', 
              alignItems: 'center',
              backgroundColor: "white",
              borderRadius: 28,
              paddingHorizontal: 10,
              height: 50,
            }}>
              <View className="justify-center items-center ml-1">
                <Search size={22} color="#5382A6" />
              </View>
              <TextInput
                placeholder={placeholder ?? "Search..."}
                value={searchText}
                onChangeText={(text) => {
                  setSearchText(text);
                  // Only pass the text as the address since we don't have latitude/longitude
                  handlePress({
                    latitude: 0,
                    longitude: 0,   
                    address: text,
                  });
                }}
                style={{
                  backgroundColor: "transparent",
                  fontSize: 16,
                  fontWeight: "500",
                  color: "#000",
                  marginTop: 5,
                  paddingLeft: isRTL ? 35 : 10,
                  paddingRight: isRTL ? 10 : 35,
                  flex: 1,
                  height: 45,
                  textAlign: isRTL ? 'right' : 'left',
                }}
                placeholderTextColor="gray"
              />
              {renderRightButton && renderRightButton()}
            </View>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default GoogleTextInput;
