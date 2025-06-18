import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRequestsStore } from '@/store/request.store';
import { useRouter } from 'expo-router';

type RequestProps = {
    item: {
        id: number;
        reqSubject: string;
        reqBody: string;
        reqStatus: string;
        createdAt: string;
    };
};

export default function Request({ item }: RequestProps) {
    const deleteRequest = useRequestsStore(state => state.deleteRequest);
    const updateRequestStatus = useRequestsStore(state => state.updateRequestStatus);
    const error = useRequestsStore(state => state.error);

    const router = useRouter();

    const handleUpdateRequestStatus = async () => {
        try {
            // Try different common status values
            await updateRequestStatus(item.id, 'טופל');
            // No alerts and no navigation - just stay on the page
            // The component will re-render automatically when the store updates
        } catch {
            // Only show error if something actually fails
            console.error('Failed to update request status');
        }
    };
    return (
        <View className="bg-white rounded-xl p-4 mb-4 shadow-md mx-4 flex-row-reverse items-center justify-between" style={{ direction: 'rtl' }}>
            <View className="flex-1 mr-4">
                <Text className="text-lg font-bold text-gray-900 mb-1">{item.reqSubject}</Text>
                <Text className="text-gray-700 mb-2">{item.reqBody}</Text>
                <Text className="text-sm text-gray-500">סטטוס: {item.reqStatus}</Text>
                <Text className="text-xs text-gray-400 mt-1">
                    נוצר ב: {new Date(item.createdAt).toLocaleString('he-IL')}
                </Text>
            </View>

            <View className="flex-row space-x-3">
                <TouchableOpacity
                    onPress={handleUpdateRequestStatus}
                    className="bg-green-500 px-4 py-2 rounded-lg"
                    activeOpacity={0.7}
                >
                    <Text className="text-white font-semibold text-sm">סיום</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => deleteRequest(item.id)}
                    className="bg-red-500 px-4 py-2 rounded-lg"
                    activeOpacity={0.7}>
                    <Text className="text-white font-semibold text-sm">מחיקה</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}