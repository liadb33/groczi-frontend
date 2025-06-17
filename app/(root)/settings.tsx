import  { useState } from 'react';
import { View, Text, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import SettingItem from '@/components/ui/SettingItem';
import DistancePickerModal from '@/components/ui/DistancePickerModal';
import { useSettingsStore } from '@/store';

export default function SettingsScreen() {
  // Notification toggle state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // Distance selection modal state
  const [isDistanceModalVisible, setIsDistanceModalVisible] = useState(false);
  const [isTotalDistanceModalVisible, setIsTotalDistanceModalVisible] = useState(false);
  const [isMaxStoresModalVisible, setIsMaxStoresModalVisible] = useState(false);
  
  // Connect to the settings store
  const { maxStoreDistance, setMaxStoreDistance, maxTravelDistance, setMaxTravelDistance, maxStores, setMaxStores } = useSettingsStore();
  

  // Select a new maximum store distance
  const handleSelectDistance = (distance: number) => setMaxStoreDistance(distance);
  // Select a new total distance
  const handleSelectTotalDistance = (distance: number) => setMaxTravelDistance(distance);
  // Select a new maximum number of stores
  const handleSelectMaxStores = (stores: number) => setMaxStores(stores);;


  return (
    <SafeAreaView className="flex-1 bg-white" style={{ direction: 'rtl' }}>
      {/* Settings list */}
      <ScrollView className="flex-1 px-4">
        {/* Language setting with value */}
        <SettingItem 
          title="שפה" 
          value="עברית" 
        />
        
        {/* Address management */}
        <SettingItem 
          title="ניהול כתובות" 
          value=""
        />
        
        {/* Notifications with toggle */}
        <SettingItem 
          title="התראות" 
          showChevron={false}
          value=""
          customRight={
            <Switch
              trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
              thumbColor={notificationsEnabled ? '#3b82f6' : '#f3f4f6'}
              ios_backgroundColor="#d1d5db"
              onValueChange={() => setNotificationsEnabled(previousState => !previousState)}
              value={notificationsEnabled}
            />
          }
        />
        
        {/* Maximum store distance */}
        <SettingItem 
          title="מרחק מקסימלי לסניף" 
          value={`${maxStoreDistance} ק"מ`}
          onPress={() => setIsDistanceModalVisible(true)}
        />
        
        {/* Total distance */}
        <SettingItem 
          title="מרחק כולל" 
          value={`${maxTravelDistance} ק"מ`}
          onPress={() => setIsTotalDistanceModalVisible(true)}
        />
        
        {/* Maximum number of stores */}
        <SettingItem 
          title="מספר חנויות מקסימלי" 
          value={`${maxStores} חנויות`}
          onPress={() => setIsMaxStoresModalVisible(true)}
        />
        
        {/* Location tracking */}
        <SettingItem 
          title="מעקב מיקום" 
          value=""
        />
        
        {/* Terms of use */}
        <SettingItem 
          title="תנאי שימוש" 
          value=""
        />
        
        {/* About Groczi */}
        <SettingItem 
          title="אודות Groczi" 
          value=""
        />

        <SettingItem
          title="כניסת משתמש" 
          value=""
          onPress={() => router.push('/LoginPage')}
        />

        
        {/* App version */}
        <View className="py-10 items-center">
          <Text className="text-gray-500">גרסה 1.0</Text>
        </View>
      </ScrollView>

      {/* Distance selection modal */}
      <DistancePickerModal
        isVisible={isDistanceModalVisible}
        onClose={() => setIsDistanceModalVisible(false)}
        onSelectDistance={handleSelectDistance}
        currentDistance={maxStoreDistance}
        minDistance={1}
        maxDistance={200}
        unit="קמ"
      />

      {/* Total distance selection modal */}
      <DistancePickerModal
        isVisible={isTotalDistanceModalVisible}
        onClose={() => setIsTotalDistanceModalVisible(false)}
        onSelectDistance={handleSelectTotalDistance}
        currentDistance={maxTravelDistance}
        minDistance={1}
        maxDistance={200}
        unit="קמ"
      />

      {/* Maximum number of stores selection modal */}
      <DistancePickerModal
        isVisible={isMaxStoresModalVisible}
        onClose={() =>  setIsMaxStoresModalVisible(false)}
        onSelectDistance={handleSelectMaxStores}
        currentDistance={maxStores}
        minDistance={1}
        maxDistance={50} // Adjust as needed
        unit="חנויות"
      />
    </SafeAreaView>
  );
}
