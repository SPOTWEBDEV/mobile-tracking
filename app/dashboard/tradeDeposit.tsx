import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function TradeDeposit() {
    const router = useRouter();
    const { id, name, symbol } = useLocalSearchParams();

    const [wallet, setWallet] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [errorVisible, setErrorVisible] = useState(false);

    useEffect(() => {
        generateWallet();
    }, []);

    const generateWallet = async () => {
        setLoading(true);
        setErrorVisible(false);

        try {
            const res = await fetch(
                "https://your-backend.com/api/wallet/generate",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ coin: symbol }),
                }
            );

            const text = await res.text();
            const data = JSON.parse(text);

            if (!data?.address || !data?.qr) {
                throw new Error("Invalid wallet response");
            }

            setWallet(data);
        } catch (e) {
            console.log(e);
            setErrorVisible(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F9FAFB]">
            {/* HEADER (KYC STYLE) */}
            <View className="px-5 pt-6">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 rounded-full bg-white border border-gray-200 items-center justify-center"
                >
                    <Ionicons name="chevron-back" size={22} color="#111827" />
                </TouchableOpacity>

                <Text className="text-2xl font-bold text-gray-900 mt-4">
                    Deposit {name}
                </Text>
                <Text className="text-gray-500 mt-1">
                    Send only {symbol} to the address below
                </Text>
            </View>

            {/* CONTENT */}
            <View className="px-5 mt-6">
                {/* LOADING */}
                {loading && (
                    <ActivityIndicator size="large" className="mt-20" />
                )}

                {/* SUCCESS – SHOW WALLET */}
                {!loading && wallet && (
                    <>
                        {/* QR CARD */}
                        <View className="bg-white border border-gray-200 rounded-2xl p-6 items-center">
                            <Image
                                source={{ uri: wallet.qr }}
                                style={{ width: 200, height: 200 }}
                            />

                            <Text className="text-gray-500 mt-4 text-sm">
                                Scan QR code to deposit {symbol}
                            </Text>
                        </View>

                        {/* ADDRESS CARD */}
                        <View className="bg-white border border-gray-200 rounded-2xl p-5 mt-5">
                            <Text className="text-gray-500 text-sm mb-1">
                                Wallet Address
                            </Text>

                            <Text className="text-gray-900 font-medium" selectable>
                                {wallet.address}
                            </Text>

                            <TouchableOpacity
                                className="mt-4 h-12 bg-[#0A145A] rounded-xl items-center justify-center"
                                onPress={() => Clipboard.setStringAsync(wallet.address)}
                            >
                                <Text className="text-white font-semibold">
                                    Copy Address
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* WARNING */}
                        <View className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-5">
                            <Text className="text-yellow-800 font-semibold">
                                Minimum Deposit: {wallet.min_deposit}
                            </Text>
                            <Text className="text-yellow-700 text-sm mt-1">
                                Deposits below this amount will not be credited.
                            </Text>
                        </View>

                        {/* NETWORK */}
                        <View className="items-center mt-6">
                            <Text className="text-gray-500">
                                Network:{" "}
                                <Text className="text-gray-900 font-semibold">
                                    {wallet.network}
                                </Text>
                            </Text>
                        </View>
                    </>
                )}

                {/* FAILED – INLINE MESSAGE */}
                {!loading && !wallet && (
                    <View className="bg-white border border-gray-200 rounded-2xl p-6 items-center mt-20">
                        <Ionicons
                            name="alert-circle-outline"
                            size={42}
                            color="#9CA3AF"
                        />

                        <Text className="text-gray-900 font-semibold mt-4">
                            Wallet Unavailable
                        </Text>

                        <Text className="text-gray-500 text-center mt-2">
                            We couldn’t generate your deposit address right now.
                            Please try again later.
                        </Text>

                        <TouchableOpacity
                            onPress={generateWallet}
                            className="mt-6 h-12 bg-[#0A145A] rounded-xl px-8 items-center justify-center"
                        >
                            <Text className="text-white font-semibold">
                                Try Again
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>


            
        </SafeAreaView>
    );
}
