import React, { useEffect, useState } from "react";
import { ScrollView, Text, View ,TouchableOpacity  } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../context/AuthContext";
import Toast from "react-native-toast-message";
import { useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const API_BASE = "https://asfast-app.com/api/api";

export default function SavingsDetails() {
    const { id } = useLocalSearchParams();
    const { token } = useAuth();
    const [saving, setSaving] = useState<any>(null);
    const router = useRouter()

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await fetch(`${API_BASE}/user/savings.php?action=single&id=${id}`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ action: "details", id }),
                });

                const data = JSON.parse(await res.text());

                console.log(data)

                if (!data.status) {
                    Toast.show({ type: "error", text1: data.message });
                    return;
                }

                setSaving(data.data);
            } catch {
                Toast.show({ type: "error", text1: "Failed to load details" });
            }
        };

        fetchDetails();
    }, []);

    if (!saving) return null;

    return (
        <SafeAreaView className="flex-1 bg-[#F9FAFB]">
            <ScrollView>
                <View className="px-5 pt-6">
                    <TouchableOpacity onPress={() => router.back()} className="w-10  h-10 rounded-full bg-white items-center justify-center shadow-sm">
                        <Ionicons name="chevron-back" size={22} color="#111827" />
                    </TouchableOpacity>
                    <Text className="text-2xl mt-4 font-bold text-gray-900 capitalize">
                        {saving.title}
                    </Text>
                    <Text className="text-gray-500 mt-1">
                        Savings details
                    </Text>
                </View>

                <View className="px-5 mt-6 gap-4">
                    <Detail label="Balance" value={`₦${saving.amount}`} />
                    <Detail label="Target Amount" value={`₦${saving.target_amount}`} />
                    <Detail label="Status" value={saving.status} />
                    <Detail label="Date" value={saving.created_at} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function Detail({ label, value }: any) {
    return (
        <View>
            <Text className="text-gray-500 mb-1">{label}</Text>
            <View className="bg-white h-14 px-4 rounded-xl border border-gray-200 justify-center">
                <Text className="font-semibold capitalize">{value}</Text>
            </View>
        </View>
    );
}
