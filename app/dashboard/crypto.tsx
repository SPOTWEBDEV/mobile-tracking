import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
const coinLogos: Record<string, any> = {
  bitcoin: require("../../assets/images/btc.png"),
  ethereum: require("../../assets/images/eth.png"),
  solana: require("../../assets/images/sol.png"),
};

export default function TradeScreen() {
  const router = useRouter();
  const { user, token } = useAuth();
  const { id, name, symbol, price, type } = useLocalSearchParams();

  console.log(id, name, symbol, price, "t");

  const coinName = (name as string) || "Crypto";
  const coinSymbol = (symbol as string) || "";
  const logoSource = coinLogos[id as string];

  const [amount, setAmount] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <ScrollView>
        {/* HEADER */}
        <View className="px-5 pt-6 flex flex-row items-center gap-3">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 items-center justify-center"
          >
            <Ionicons name="chevron-back" size={22} color="#111827" />
          </TouchableOpacity>

          <Text className="text-2xl font-bold text-gray-900 ">Trade Coins</Text>
        </View>

        {/* TABS */}
        <View className="px-5 pt-6 flex-row items-center gap-3">
          {logoSource && (
            <Image
              source={logoSource}
              className="w-10 h-10 rounded-full"
              resizeMode="contain"
            />
          )}
          <View>
            <Text className="text-2xl font-bold text-gray-900">
              {coinName} Wallet
            </Text>
            <Text className="text-gray-500 mt-1 capitalize">
              {type} {name} coin
            </Text>
          </View>
        </View>

        {/* TRADE CARD */}
        <View className="px-5 mt-6">
          <View className="bg-white border border-gray-200 rounded-xl p-5">
            {/* WALLET BALANCE */}
            <Text className="text-gray-400 text-center">
              Wallet Balance: ₦{user?.bal}
            </Text>

            {/* AMOUNT INPUT */}
            <View className="mt-6">
              <Text className="text-gray-700 mb-1">Amount (USD)</Text>

              <View className="flex-row  items-center bg-white h-14 px-4 rounded-xl border border-gray-200">
                <Text className="text-gray-500 mr-2 font-medium">$</Text>
                <TextInput
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  className="flex-1 text-lg mb-3"
                />
              </View>
            </View>

            {/* CONVERSION */}
            <View className="items-center mt-6">
              <Text className="text-gray-500">= NGN 0.00</Text>
              <Text className="text-gray-400 mt-1 text-sm">
                0.00000000 {coinSymbol}
              </Text>
            </View>

            {/* LIMIT */}
            <Text className="text-center text-gray-400 mt-6 text-sm">
              Max daily amount – USD 0.00
            </Text>
          </View>
        </View>

        {/* ACTION BUTTON */}
        <View className="px-5 mt-10 mb-6">
          <TouchableOpacity
            onPress={() => alert("Third party not added")}
            className={`h-14 ${type == "sell" ? "bg-red-600" : "bg-green-600"} rounded-xl items-center justify-center`}
          >
            <Text className="text-white uppercase font-semibold px-5 text-lg">
              {type}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
