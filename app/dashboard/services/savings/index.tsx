import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../context/AuthContext";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

const API_BASE = "https://asfast-app.com/api/api";

export default function SavingsScreen() {
  const { token } = useAuth();
  const router = useRouter();
  const [savings, setSavings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSavings = async () => {
    try {
      const res = await fetch(`${API_BASE}/user/savings.php?action=fetch`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "fetch" }),
      });

      const data = JSON.parse(await res.text());

      console.log(data , 'data')

      if (!data.status) {
        Toast.show({ type: "error", text1: data.message });
        setSavings([]);
        return;
      }

      setSavings(data.data || []);
    } catch {
      Toast.show({ type: "error", text1: "Failed to load savings" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavings();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <ScrollView>

        <View className="px-5 pt-6">
          <TouchableOpacity onPress={() => router.back()} className="w-10  h-10 rounded-full bg-white items-center justify-center shadow-sm">
            <Ionicons name="chevron-back" size={22} color="#111827" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-900 mt-3">
            Savings
          </Text>
          <Text className="text-gray-500 mt-1">
            Manage your savings plans
          </Text>
        </View>

        <View className="px-5 mt-8 gap-4">
          <TouchableOpacity
            onPress={() => router.push("/dashboard/services/savings/create")}
            className="h-14 bg-blue-600 rounded-xl items-center justify-center"
          >
            <Text className="text-white font-semibold text-lg">
              Create Savings
            </Text>
          </TouchableOpacity>

          {loading && <ActivityIndicator className="mt-6" />}

          {!loading && savings.length === 0 && (
            <View className="mt-10 items-center">
              <Ionicons
                name="leaf-outline"
                size={48}
                color="#9CA3AF"
              />
              <Text className="mt-4 text-gray-700 font-semibold">
                No savings yet
              </Text>
              <Text className="text-gray-500 mt-1 text-center">
                Create a savings plan to start saving
              </Text>
            </View>
          )}

          {savings.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() =>
                router.push(
                  `/dashboard/services/savings/details?id=${item.id}`
                )
              }
              className="bg-white rounded-xl border border-gray-200 px-4 py-4 flex-row justify-between items-center"
            >
              <View>
                <Text className="font-semibold text-gray-900">
                  {item.title}
                </Text>
                <Text className="text-gray-500 mt-1">
                  ₦{Number(item.amount).toLocaleString()}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward-outline"
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
