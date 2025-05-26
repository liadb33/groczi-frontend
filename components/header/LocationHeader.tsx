import React from 'react';
import { View, Text, TouchableOpacity, StyleProp, ViewStyle, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Settings } from 'lucide-react-native';

const rtlStyles = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse',
  },
  textRight: {
    textAlign: 'right',
  },
  row: {
    flexDirection: 'row',
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
});

export const LocationHeader: React.FC<LocationHeaderProps> = ({
  location,
  onLocationPress = () => {},
  onQRCodePress = () => {},
  onSettingsPress = () => {},
  className = '',
  isRTL = false,
  locationLabel = 'Location',
}) => {
  return (
    <View 
      className={`flex-row justify-between items-center px-4 py-2 ${className}`}
      style={isRTL ? rtlStyles.container : {}}
    >
      <TouchableOpacity onPress={onQRCodePress}>
        <MaterialCommunityIcons name="qrcode-scan" size={28} color="#333" />
      </TouchableOpacity>
      
      <View className="flex items-center">
        <Text className="text-lg font-medium text-center">
          {locationLabel}
        </Text>
        <View 
          className="flex-row items-center" 
          style={isRTL ? rtlStyles.rowReverse : {}}
        >
          <MaterialCommunityIcons name="map-marker" size={18} color="#5180C6" />
          <Text className="text-lg font-semibold mx-1" style={isRTL ? rtlStyles.textRight : {}}>
            {location}
          </Text>
          <TouchableOpacity onPress={onLocationPress}>
            <MaterialCommunityIcons name="chevron-down" size={18} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity onPress={onSettingsPress}>
        <Settings color="#333" size={28} />
      </TouchableOpacity>
    </View>
  );
};

export default LocationHeader; 