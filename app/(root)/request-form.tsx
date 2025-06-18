import { useRequestsStore } from '@/store/request.store';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';

type RequestFormProps = {
    itemId?: string;
};

export default function RequestForm({ itemId: propItemId }: RequestFormProps) {
    const [itemId, setItemId] = useState(propItemId || '');
    const [reqSubject, setReqSubject] = useState('');
    const [reqBody, setReqBody] = useState('');

    const createRequest = useRequestsStore(state => state.createRequest);
    const loading = useRequestsStore(state => state.loading);
    const error = useRequestsStore(state => state.error);
    const successForm = useRequestsStore(state => state.success);
    const router = useRouter();

    useEffect(() => {
        if (propItemId) setItemId(propItemId);
    }, [propItemId]);

    const handleSubmit = async () => {
        if (!itemId || !reqSubject) {
            Alert.alert('שגיאה', 'אנא מלא את כל השדות החיוניים');
            return;
        }
        try {
            await createRequest(itemId, "test-for-now", reqSubject, reqBody);
            if (successForm) {
                Alert.alert('הצלחה', 'הבקשה נוצרה בהצלחה');
                router.back();
            }
            else {
                Alert.alert('שגיאה', 'לא הצלחנו לשלוח את הבקשה');
            }
        } catch {
            Alert.alert('שגיאה', error || 'לא הצלחנו ליצור את הבקשה');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="flex-1 bg-white"
        >
            <View className="flex-1 px-6 pt-12" style={{ direction: 'rtl' }}>
                <Text className="text-3xl font-bold text-gray-900 mb-8">יצירת בקשה חדשה</Text>

                <View className="mb-6">
                    <Text className="text-base font-semibold text-gray-700 mb-2">קוד פריט</Text>
                    <TextInput
                        value={itemId}
                        onChangeText={setItemId}
                        placeholder="הכנס קוד פריט"
                        className="bg-gray-50 border border-gray-300 rounded-xl p-4 text-base"
                        autoCapitalize="none"
                        textAlign="right"
                        editable={!propItemId}
                    />
                </View>

                <View className="mb-6">
                    <Text className="text-base font-semibold text-gray-700 mb-2">נושא הבקשה</Text>
                    <TextInput
                        value={reqSubject}
                        onChangeText={setReqSubject}
                        placeholder="הכנס נושא"
                        className="bg-gray-50 border border-gray-300 rounded-xl p-4 text-base"
                        textAlign="right"
                    />
                </View>

                <View className="mb-8">
                    <Text className="text-base font-semibold text-gray-700 mb-2">תוכן הבקשה (אופציונלי)</Text>
                    <TextInput
                        value={reqBody}
                        onChangeText={setReqBody}
                        placeholder="הכנס תוכן"
                        className="bg-gray-50 border border-gray-300 rounded-xl p-4 text-base"
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        textAlign="right"
                    />
                </View>

                <TouchableOpacity
                    onPress={handleSubmit}
                    className="bg-blue-600 rounded-xl py-4"
                    activeOpacity={0.8}
                    disabled={loading}
                >
                    <Text className="text-white text-center text-lg font-semibold">שלח בקשה</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}
