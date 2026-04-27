import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

export default function TradeDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [coin, setCoin] = useState<any>(null);
  const [prices, setPrices] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoinDetails();
  }, []);

  const fetchCoinDetails = async () => {
    try {
      const coinRes = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}`
      );
      const coinData = await coinRes.json();

      const chartRes = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7`
      );
      const chartData = await chartRes.json();

      setCoin(coinData);
      setPrices(chartData.prices.map((p: any) => p[1]));
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 80 }} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB] px-5">
      {/* HEADER */}
      <View className="flex-row items-center py-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#2563EB" />
        </TouchableOpacity>
        <Text className="ml-4 text-lg font-semibold text-gray-900">
          {coin.name}
        </Text>
      </View>

      {/* PRICE */}
      <View className="mt-4">
        <Text className="text-3xl font-bold text-gray-900">
          ${coin.market_data.current_price.usd.toLocaleString()}
        </Text>
        <Text className="text-gray-500 mt-1">
          {coin.symbol.toUpperCase()} • USD
        </Text>
      </View>

      {/* CHART */}
      <View className="mt-6 bg-white rounded-2xl p-4">
        <LineChart
          data={{
            labels: [],
            datasets: [{ data: prices }],
          }}
          width={screenWidth - 40}
          height={220}
          withDots={false}
          withInnerLines={false}
          withOuterLines={false}
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            color: () => "#2563EB",
            strokeWidth: 2,
          }}
          bezier
        />
      </View>

      {/* ACTIONS */}
      <View className="flex-row gap-4 mt-8">
        <TouchableOpacity className="flex-1 h-14 bg-green-600 rounded-xl items-center justify-center">
          <Text className="text-white font-semibold text-lg">
            Buy
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-1 h-14 bg-red-600 rounded-xl items-center justify-center">
          <Text className="text-white font-semibold text-lg">
            Sell
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
