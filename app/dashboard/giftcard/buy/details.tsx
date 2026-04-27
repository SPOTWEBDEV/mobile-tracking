import { useAuth } from "@/app/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";


/* -----------------------------
   CONFIG
------------------------------ */
const API_BASE = "https://asfast-app.com/api/api/user";
const EXCHANGE_RATE = 1500;




export default function GiftCardScreen() {
    const { token, user, setUser } = useAuth(); // user balance pulled safely
    const router = useRouter();
    const params = useLocalSearchParams();

    const brandCode =
        typeof params.brand_code === "string"
            ? params.brand_code
            : params.brand_code?.[0];

    const [cardDetails, setCardDetails] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState<any>(null);

    const [amountNaria, setAmountNaria] = useState("");
    const [amountError, setAmountError] = useState("");


    /* -----------------------------
       FETCH SINGLE GIFT CARD
    ------------------------------ */
    const fetchCardDetails = async () => {
        if (!brandCode || !token) return;

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/giftcard.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    action: "singleitems",
                    brand_code: brandCode,
                }),
            });

            const text = await res.text();
            let json;

            try {
                json = JSON.parse(text);
            } catch {
                throw new Error("Invalid server response");
            }

            if (!json.status || !json.data) {
                throw new Error(json.message || "Failed to load gift card");
            }

            setCardDetails(json.data);
            console.log("Card details:", json.data);
        } catch (err: unknown) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: err instanceof Error ? err.message : "Network error",
            });
        } finally {
            setLoading(false);
        }
    };

    /* -----------------------------
       PLACE ORDER
    ------------------------------ */
    const placeOrder = async () => {
        setAmountError("");

        if (!selectedRegion || !cardDetails) return;


        const Max_price = cardDetails.brand.max_price_in_cents  
        const Min_price = cardDetails.brand.min_price_in_cents 



        const amountUsd = Number(amountNaria) / cardDetails.rate_usd;
        const priceInCents = Math.round(amountUsd * 100);

        if (priceInCents < Min_price) {
            setAmountError(`Minimum amount is ₦${(Min_price * cardDetails.rate_usd / 100).toLocaleString()}`);
            return;
        }

        if (priceInCents > Max_price) {
            setAmountError(`Maximum amount is ₦${(Max_price * cardDetails.rate_usd / 100).toLocaleString()}`);
            return;
        }







        console.log("Placing order");



        try {
            const res = await fetch(`${API_BASE}/giftcard.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    action: "order",
                    brand_code: cardDetails.brand.brand_code,
                    region: selectedRegion.code,
                    amount_naira: amountNaria,
                    email: user?.email,
                    recipient_name: `${user?.firstName} ${user?.lastName}`,

                }),
            });

            const text = await res.text()
            console.log(text)

            const data = JSON.parse(text);

            if (!data.status) {
                throw new Error(data.message || "Order failed");
            }

            if (data.status && user) {
                Toast.show({
                    type: "success",
                    text1: "Success",
                    text2: "Gift card ordered successfully",
                });

                setUser({ ...user, bal: data.data.new_balance });
                router.push('/(tabs)/giftcard')
            }

        } catch (err: unknown) {
            Toast.show({
                type: "error",
                text1: "Order Failed",
                text2: err instanceof Error ? err.message : "Network error",
            });
        }
    };

    useEffect(() => {
        fetchCardDetails();
    }, [brandCode, token]);

    /* -----------------------------
       UI
    ------------------------------ */
    return (
        <SafeAreaView className="flex-1 bg-[#F9FAFB]">
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                {/* HEADER */}
                <View className="px-5 pt-4">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm"
                    >
                        <Ionicons name="chevron-back" size={22} color="#111827" />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    contentContainerStyle={{ paddingBottom: 40 }}
                    keyboardShouldPersistTaps="handled"
                >


                    {loading ? (
                        <Text className="text-center text-gray-500 mt-10">
                            Loading gift card details...
                        </Text>
                    ) : !cardDetails ? (
                        <View className="items-center mt-10">
                            <Ionicons name="gift-outline" size={64} color="#CBD5E1" />
                            <Text className="text-gray-700 font-semibold mt-4">
                                No Gift Card Found
                            </Text>
                        </View>
                    ) : (
                        <View className="px-5 mt-6">
                            {/* BRAND IMAGE */}
                            {cardDetails.brand.image_url && (
                                <Image
                                    source={{ uri: cardDetails.brand.image_url }}
                                    className="w-40 h-20 self-center mb-4"
                                    resizeMode="contain"
                                />
                            )}

                            <Text className="text-2xl font-bold mb-2">
                                {cardDetails.brand.name} Gift Card
                            </Text>

                            <Text className="text-gray-700 mb-3">
                                {cardDetails.brand.description}
                            </Text>

                            <View className="bg-blue-50 p-3 rounded-lg mb-4">
                                <Text className="text-green-800 font-semibold">
                                    Wallet Balance: ₦{user?.bal.toLocaleString()}
                                </Text>
                                <Text className="text-blue-700">
                                    Exchange Rate: 1 USD = ₦{cardDetails.rate_usd}
                                </Text>
                            </View>

                            {/* AMOUNT */}
                            {cardDetails.brand.variable_price && (
                                <View className="mb-4">
                                    <Text className="mb-1">Enter Amount (Naira)</Text>
                                    <TextInput
                                        value={amountNaria}
                                        onChangeText={setAmountNaria}
                                        keyboardType="numeric"
                                        className="bg-white border border-gray-300 rounded-xl px-4 h-12"
                                    />

                                    {!!amountNaria && !amountError && (
                                        <Text className="text-gray-600 mt-1">
                                            ≈ ₦{(Number(amountNaria) / cardDetails.rate_usd).toFixed(4)} USD
                                        </Text>
                                    )}

                                    {!!amountError && (
                                        <Text className="text-red-600 mt-1">{amountError}</Text>
                                    )}
                                </View>
                            )}

                            {/* REGIONS */}
                            <Text className="font-semibold mb-3">Available Regions</Text>

                            <View className="flex-row flex-wrap justify-between">
                                {cardDetails.regions.map((region: any) => (
                                    <TouchableOpacity
                                        key={region.id + Math.random()}
                                        onPress={() => setSelectedRegion(region)}
                                        className={`w-[48%] mb-4 p-4 rounded-xl border ${selectedRegion?.id === region.id
                                            ? "border-blue-600"
                                            : "border-gray-200"
                                            }`}
                                    >
                                        {region.image_url && (
                                            <Image
                                                source={{ uri: region.image_url }}
                                                className="h-16"
                                                resizeMode="contain"
                                            />
                                        )}
                                        <Text className="text-center font-semibold mt-2">
                                            {region.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* ORDER BUTTON */}
                            <TouchableOpacity
                                disabled={!selectedRegion}
                                onPress={placeOrder}
                                className={`py-3 rounded-xl items-center ${selectedRegion ? "bg-blue-600" : "bg-gray-400"
                                    }`}
                            >
                                <Text className="text-white font-bold">Place Order</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
