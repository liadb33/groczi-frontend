import { useUsersStore } from '@/store/users.store';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { router } from 'expo-router';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const login = useUsersStore(state => state.login);
  const loading = useUsersStore(state => state.loading);
  const error = useUsersStore(state => state.error);
  const user = useUsersStore(state => state.loginUser);


  const handleLogin = async () => {
    try {
      await login(username, password);
      // Check the store state after login attempt
      const currentUser = useUsersStore.getState().loginUser;
      if (currentUser) {
        router.push('./requests');
      } else {
        Alert.alert("שם משתמש או סיסמה שגויים");
      }
    } catch (err) {
      Alert.alert("שגיאה בכניסה");
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-white"
    >
      <View className="flex-1 px-6 pt-12">
        <View className="mb-6">
          <Text className="text-base font-semibold text-gray-700 mb-2">שם משתמש</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="הכנס שם משתמש"
            className="bg-gray-50 border border-gray-300 rounded-xl p-4 text-base"
            autoCapitalize="none"
            textAlign="right"
          />
        </View>

        <View className="mb-8">
          <Text className="text-base font-semibold text-gray-700 mb-2">סיסמה</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="הכנס סיסמה"
            secureTextEntry
            className="bg-gray-50 border border-gray-300 rounded-xl p-4 text-base"
            textAlign="right"
          />
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          className="bg-blue-600 rounded-xl py-4"
          activeOpacity={0.8}
        >
          <Text className="text-white text-center text-lg font-semibold">אישור</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
