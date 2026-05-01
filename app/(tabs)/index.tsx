import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  const [tracking, setTracking] = useState(false);

  return (
    <View className="flex-1 bg-[#F9FAFB] px-5 pt-14">

      {/* Header */}
      <View className="flex-row justify-between items-center">
        <Text className="text-2xl font-bold text-gray-900">
          Dashboard
        </Text>

        <Ionicons name="person-circle-outline" size={30} color="#1A4DBE" />
      </View>

      {/* Map Placeholder */}
      <View className="mt-6 h-64 bg-white rounded-2xl items-center justify-center shadow-sm">
        <Text className="text-gray-400">Map Loading...</Text>
      </View>

      {/* Status Card */}
      <View className="mt-6 p-5 bg-white rounded-2xl shadow-sm">
        <Text className="text-gray-500">Tracking Status</Text>

        <Text className={`mt-2 font-bold text-lg ${
          tracking ? "text-green-600" : "text-red-500"
        }`}>
          {tracking ? "Active" : "Stopped"}
        </Text>
      </View>

      {/* Actions */}
      <TouchableOpacity
        onPress={() => setTracking(true)}
        className="mt-6 bg-[#1A4DBE] py-4 rounded-xl"
      >
        <Text className="text-white text-center font-semibold">
          Start Tracking
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setTracking(false)}
        className="mt-4 border border-gray-300 py-4 rounded-xl"
      >
        <Text className="text-center text-gray-700">
          Stop Tracking
        </Text>
      </TouchableOpacity>

      {/* Device Section */}
      <View className="mt-8">
        <Text className="text-gray-900 font-semibold mb-2">
          Connected Devices
        </Text>

        <View className="bg-white p-4 rounded-xl">
          <Text className="text-gray-500">
            No device connected yet
          </Text>
        </View>
      </View>

    </View>
  );
}