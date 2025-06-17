import { useUsersStore } from '@/store/users.store';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const login = useUsersStore(state => state.login);
  const loading = useUsersStore(state => state.loading);
  const error = useUsersStore(state => state.error);

  const handleLogin = async () => {
    try {
      await login(username, password);
      router.push('./RequestsPage');
    } catch (err) {
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-white"
    >
      <View className="flex-1 px-6 pt-12" style={{ direction: 'rtl' }}>
        <Text className="text-3xl font-bold text-gray-900 mb-8">כניסת משתמש</Text>

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
