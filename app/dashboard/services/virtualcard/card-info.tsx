import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useAuth } from "../../../context/AuthContext";

const API_BASE = "https://asfast-app.com/api/api";

export default function CardInfo() {
  const { token, user } = useAuth();
  const router = useRouter();
   const params = useLocalSearchParams();
  const cardholder_id = params.cardholder_id;

  const [cardholderId, setCardholderId] = useState(cardholder_id || "");
  const [fundingAmount, setFundingAmount] = useState<string>("");
  const [pin, setPin] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Submit card creation
  const createCard = async () => {
    if (!cardholderId) {
      Toast.show({ type: "error", text1: "Cardholder ID is required" });
      return;
    }

    if(Number(fundingAmount) < 3 && fundingAmount !== "") {
      Toast.show({ type: "error", text1: "Minimum funding amount is $3" });
      return;
    }

    console.log("User balance (USD):", user?.bal_usd);
    console.log("Requested funding amount:", fundingAmount);

    if(Number(fundingAmount) > Number(user?.bal_usd || "0")) {
      Toast.show({ type: "error", text1: "Insufficient funds" });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        cardholder_id: cardholderId,
        card_type: "virtual",
        card_brand: "Mastercard",
        card_currency: "USD",
        funding_amount: fundingAmount,
        pin
      };

      console.log("++++++++++++++++++++++++++++++++");
      console.log("++++++++++++++++++++++++++++++++");
      console.log("++++++++++++++++++++++++++++++++");


      console.log("Card payload:", payload);

      const res = await fetch(`${API_BASE}/user/cards.php?action=create_card`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      console.log(text, 'iiis')
      const data = JSON.parse(text);
      console.log("Card creation response:", data);

      if (!data.status) {
        if (data.data) {
          const result = data.data;
          throw new Error(result.message || "Cardholder creation faileds");
        }
        throw new Error(data.message || "Cardholder creation failed");
      }

      Toast.show({
        type: "success",
        text1: "Card created!",
        text2: "Your virtual card has been created successfully.",
      });

      setLoading(false);

      router.push('/dashboard/services/virtualcard/view');
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: err.message || "Try again",
      });
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
        <Text className="text-2xl font-bold text-gray-900">Card Information</Text>
        <Text className="text-gray-500 mt-1">
          Only Cardholder ID and PIN are needed to create your card.
        </Text>



        {/* PIN */}
        <Input label="PIN" value={pin} setValue={setPin} keyboard="number-pad" />
        <Input label="AMOUNT (USD)" value={fundingAmount} setValue={setFundingAmount} keyboard="number-pad" />

        <TouchableOpacity
          onPress={()=> createCard()}
          className={`h-14 rounded-xl items-center justify-center ${loading ? "bg-gray-400" : "bg-blue-600"}`}
          disabled={loading}
        >
          <Text className="text-white text-lg font-semibold">
            {loading ? "Creating..." : "Create Card"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- Reusable Input Component ---------- */
function Input({ label, value, setValue, keyboard }: any) {
  return (
    <View>
      <Text className="text-gray-700 mb-1">{label}</Text>
      <View className="flex-row items-center bg-white h-14 px-4 rounded-xl border border-gray-200">
        <Ionicons name="card-outline" size={18} color="#9CA3AF" />
        <TextInput
          value={value}
          onChangeText={setValue}
          keyboardType={keyboard}
          className="flex-1 ml-3"
          placeholder={label}
        />
      </View>
    </View>
  );
}
