import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

const coinLogos: Record<string, any> = {
  bitcoin: require("../../assets/images/btc.png"),
  ethereum: require("../../assets/images/eth.png"),
  solana: require("../../assets/images/sol.png"),
};

export default function WalletScreen() {
  const router = useRouter();
  const { id, name, symbol, price } = useLocalSearchParams();

  console.log(id, name, symbol, price);

  const coinName = (name as string) || "Crypto";
  const coinSymbol = (symbol as string) || "";
  const logoSource = coinLogos[id as string];
  const [hideBalance, setHideBalance] = useState(false);
  const { user, token } = useAuth();
  const balance = "0.0000";

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <ScrollView>
        {/* HEADER */}
        <View className="px-5 pt-6 flex-row items-center gap-3">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 items-center justify-center"
          >
            <Ionicons name="chevron-back" size={22} color="#111827" />
          </TouchableOpacity>
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
            <Text className="text-gray-500 mt-1">
              Manage your {coinName} assets
            </Text>
          </View>
        </View>

        {/* Balance Card */}
        <View className="mx-5 mt-6 bg-blue-600 rounded-2xl p-5">
          <Text className="text-blue-100">{coinSymbol} Balance</Text>

          <View className="flex-row items-center mt-2">
            <Text className="text-white text-3xl font-bold mr-3">
              {hideBalance ? "••••••" : `${balance?.toLocaleString()}`}
            </Text>

            <TouchableOpacity onPress={() => setHideBalance(!hideBalance)}>
              <Ionicons
                name={hideBalance ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="white"
              />
            </TouchableOpacity>
          </View>

          {/* Quick Actions */}
        </View>

        {/* QUICK ACTIONS */}
        <View className="px-5 mt-8">
          <Text className="text-gray-900 font-semibold mb-4">
            Quick Actions
          </Text>

          <View className="flex flex-row  gap-x-1 gap-y-3 ">
            {/* BUY */}
            <TouchableOpacity
              className="w-[24%] bg-white border border-gray-200 rounded-xl p-4 items-center"
              onPress={() =>
                router.push(
                  `/dashboard/crypto?id=${id}&name=${name}&type=buy&symbol=${symbol}`,
                )
              }
            >
              <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mb-2">
                <Ionicons name="logo-bitcoin" size={22} color="#2563EB" />
              </View>
              <Text className="text-gray-900 font-medium text-sm text-center">
                Buy {coinSymbol}
              </Text>
            </TouchableOpacity>

            {/* SELL */}
            <TouchableOpacity
              className="w-[25%] bg-white border border-gray-200 rounded-xl p-4 items-center"
              onPress={() =>
                router.push(
                  `/dashboard/crypto?id=${id}&name=${name}&type=sell&symbol=${symbol}`,
                )
              }
            >
              <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mb-2">
                <Ionicons
                  name="swap-horizontal-outline"
                  size={22}
                  color="#2563EB"
                />
              </View>
              <Text className="text-gray-900 font-medium text-sm text-center">
                Sell {coinSymbol}
              </Text>
            </TouchableOpacity>

            {/* WITHDRAW */}
            <TouchableOpacity
              className="w-[25%] bg-white border border-gray-200 rounded-xl p-4 items-center"
              onPress={() => alert("Third party not added")}
            >
              <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mb-2">
                <Ionicons name="cash-outline" size={22} color="#2563EB" />
              </View>
              <Text className="text-gray-900 font-medium text-sm text-center">
                Transfer
              </Text>
            </TouchableOpacity>

            {/* DEPOSIT */}
            <TouchableOpacity
              className="w-[25%] bg-white border border-gray-200 rounded-xl p-4 items-center"
              onPress={() =>
                router.push(
                  `/dashboard/tradeDeposit?name=${name}&symbol=${symbol}&id=${id}`,
                )
              }
            >
              <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mb-2">
                <Ionicons name="wallet-outline" size={22} color="#2563EB" />
              </View>
              <Text className="text-gray-900 font-medium text-sm text-center">
                Deposit
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* NO TRANSACTIONS */}
        <View className="px-5 mt-10">
          <Text className="text-gray-900 font-semibold mb-4">
            Recent Transactions
          </Text>

          <View className="items-center mt-10">
            <Ionicons name="receipt-outline" size={64} color="#2563EB" />
            <Text className="text-gray-500 mt-4 text-center">
              No transactions yet for {coinName}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
