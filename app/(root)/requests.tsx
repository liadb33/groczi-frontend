import React, { useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useRequestsStore } from '@/store/request.store';
import Request from '@/components/ui/Request';

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
      keyExtractor={item => item.id.toString()}
      contentContainerStyle={{ paddingVertical: 16 }}
      renderItem={({ item }) => <Request item={item} />}
    />
  );
}