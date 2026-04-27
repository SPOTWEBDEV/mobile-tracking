import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Trade() {
  const router = useRouter();

  // YOUR STATIC COIN LIST
  const coins = [
    {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      price: 62000,
      change_24h: 2.5,
      logo: require("../../assets/images/btc.png"),
    },
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      price: 2800,
      change_24h: -1.3,
      logo: require("../../assets/images/eth.png"),
    },
    {
      id: "solana",
      name: "Solana",
      symbol: "SOL",
      price: 150,
      change_24h: 3.1,
      logo: require("../../assets/images/sol.png"),
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB] px-5">

      {/* TITLE */}
      <View className="mb-4 mt-5">
        <Text className="text-2xl font-bold text-gray-900">Crypto Market</Text>
        <Text className="text-gray-500 mt-1">Tap a coin to view details</Text>
      </View>

      {/* COIN LIST */}
      <FlatList
        data={coins}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isUp = item.change_24h >= 0;

          return (
            <TouchableOpacity
              onPress={() =>
                router.push(
                  `/dashboard/wallet?id=${item.id}&name=${item.name}&symbol=${item.symbol}&price=${item.price}`
                )
              }
              className="bg-white rounded-2xl px-4 py-4 mb-4 flex-row items-center justify-between"
            >
              <View className="flex-row items-center">
                <Image source={item.logo} className="w-10 h-10 mr-3" />
                <View>
                  <Text className="font-semibold text-gray-900">{item.name}</Text>
                  <Text className="text-gray-500 text-sm uppercase">
                    {item.symbol}
                  </Text>
                </View>
              </View>

              <View className="items-end">
                <Text className="text-gray-900 font-medium">
                  ${item.price.toLocaleString()}
                </Text>

                <View className="flex-row items-center mt-1">
                  <Ionicons
                    name={isUp ? "arrow-up" : "arrow-down"}
                    size={14}
                    color={isUp ? "#16A34A" : "#DC2626"}
                  />
                  <Text
                    className={`ml-1 text-sm ${
                      isUp ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {item.change_24h.toFixed(2)}%
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}
