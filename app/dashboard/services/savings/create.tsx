import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../context/AuthContext";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

const API_BASE = "https://asfast-app.com/api/api";

export default function CreateSavings() {
    const { token } = useAuth();
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [targetAmount , setTargetAmount] = useState("");
    const [frequency, setFrequency] = useState("Daily");

    const createSavings = async () => {
        if (!title || !amount) {
            Toast.show({
                type: "error",
                text1: "All fields are required",
            });
            return;
        }

        console.log(targetAmount , amount)
        if (targetAmount > amount) {
            Toast.show({
                type: "error",
                text1: "Target amount must be greater than amount",
            });
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/user/savings.php?action=create`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action: "create",
                    title,
                    amount,
                    frequency,
                    target_amount:targetAmount
                }),
            });

            const data = JSON.parse(await res.text());

            if (!data.status) {
                Toast.show({ type: "error", text1: data.message });
                return;
            }

            Toast.show({
                type: "success",
                text1: "Savings created",
            });

            router.back();
        } catch {
            Toast.show({
                type: "error",
                text1: "Network error",
            });
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F9FAFB]">
            <ScrollView>
                <View className="px-5 pt-6">
                    <TouchableOpacity onPress={() => router.push('/screen')} className="w-10  h-10 rounded-full bg-white items-center justify-center shadow-sm">
                        <Ionicons name="chevron-back" size={22} color="#111827" />
                    </TouchableOpacity>
                    <Text className="text-2xl font-bold text-gray-900 mt-4">
                        Create Savings
                    </Text>
                    <Text className="text-gray-500 mt-1">
                        Set up a new savings plan
                    </Text>
                </View>

                <View className="px-5 mt-6 gap-4 space-y-5">
                    <Input label="Savings Title" value={title} setValue={setTitle} />
                    <Input
                        label="Amount"
                        value={amount}
                        setValue={setAmount}
                        keyboard="number-pad"
                    />
                    <Input
                        label="Target Amount"
                        value={targetAmount}
                        setValue={setTargetAmount}
                        keyboard="number-pad"
                    />

                    <Select
                        label="Frequency"
                        value={frequency}
                        options={["Daily", "Weekly", "Monthly"]}
                        onSelect={setFrequency}
                    />
                </View>

                <View className="px-5 mt-10 mb-6">
                    <TouchableOpacity
                        onPress={createSavings}
                        className="h-14 bg-blue-600 rounded-xl items-center justify-center"
                    >
                        <Text className="text-white font-semibold text-lg">
                            Create Savings
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

/* ---------- Reused KYC Components ---------- */

function Input({ label, value, setValue, keyboard }: any) {
    return (
        <View>
            <Text className="text-gray-700 mb-1">{label}</Text>
            <View className="bg-white h-14 px-4 rounded-xl border border-gray-200">
                <TextInput
                    value={value}
                    onChangeText={setValue}
                    keyboardType={keyboard}
                    className="flex-1"
                    placeholder={label}
                />
            </View>
        </View>
    );
}

function Select({ label, value, options, onSelect }: any) {
    const [open, setOpen] = useState(false);

    return (
        <View>
            <Text className="text-gray-700 mb-1">{label}</Text>

            <TouchableOpacity
                onPress={() => setOpen(!open)}
                className="flex-row justify-between items-center bg-white h-14 px-4 rounded-xl border border-gray-200"
            >
                <Text className="text-gray-700">{value}</Text>
                <Ionicons name="chevron-down-outline" size={18} color="#9CA3AF" />
            </TouchableOpacity>

            {open && (
                <View className="bg-white border border-gray-200 rounded-xl mt-2">
                    {options.map((opt: string) => (
                        <TouchableOpacity
                            key={opt}
                            onPress={() => {
                                onSelect(opt);
                                setOpen(false);
                            }}
                            className="px-4 py-3"
                        >
                            <Text>{opt}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
}
