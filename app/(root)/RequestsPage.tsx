import React, { useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useRequestsStore } from '@/store/request.store';

export default function RequestsPage() {
  const { requests, fetchAllRequests, loading, error } = useRequestsStore();

  useEffect(() => {
    fetchAllRequests();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center px-4">
        <Text className="text-red-600 text-center">{error}</Text>
      </View>
    );
  }

  if (requests.length === 0) {
    return (
      <View className="flex-1 justify-center items-center px-4">
        <Text className="text-gray-600">אין בקשות להצגה</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={requests}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <View className="bg-white rounded-xl p-4 mb-4 shadow">
          <Text className="font-bold text-lg mb-1">{item.reqSubject}</Text>
          <Text className="text-gray-700 mb-1">{item.reqBody}</Text>
          <Text className="text-sm text-gray-500">
            סטטוס: {item.reqStatus}
          </Text>
          <Text className="text-sm text-gray-400 mt-2">
            נוצר ב: {new Date(item.createdAt).toLocaleString('he-IL')}
          </Text>
        </View>
      )}
    />
  );
}