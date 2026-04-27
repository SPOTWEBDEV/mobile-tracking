import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Feature component
const Feature = ({
  text,
  available,
  active,
}: {
  text: string;
  available: boolean;
  active: boolean;
}) => {
  return (
    <View className="flex-row items-center mt-2">
      <Ionicons
        name={available ? "checkmark-circle" : "close-circle"}
        size={18}
        color={available ? "#16A34A" : "#DC2626"}
      />

      <Text
        className={`ml-2 ${
          active ? "text-white" : "text-gray-700"
        }`}
      >
        {text}
      </Text>
    </View>
  );
};

export default function Pricing() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState("basic");

  const changePlan = (plan: string) => {
    setSelectedPlan(plan);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <ScrollView>
        <View className="flex-1 bg-white px-6 pt-16 pb-10">

          {/* Title */}
          <Text className="text-2xl font-bold text-gray-900">
            Choose a Plan
          </Text>

          {/* FREE PLAN */}
          <TouchableOpacity
            onPress={() => changePlan("free")}
            className={`mt-6 p-5 rounded-2xl ${
              selectedPlan === "free" ? "bg-blue-600" : "bg-gray-100"
            }`}
          >
            <Text
              className={`text-lg font-semibold ${
                selectedPlan === "free" ? "text-white" : "text-gray-900"
              }`}
            >
              Free
            </Text>

            <Feature text="Basic tracking" available={true} active={selectedPlan === "free"} />
            <Feature text="Real-time tracking" available={false} active={selectedPlan === "free"} />
            <Feature text="Location history" available={false} active={selectedPlan === "free"} />
            <Feature text="Alerts" available={false} active={selectedPlan === "free"} />
          </TouchableOpacity>

          {/* BASIC PLAN */}
          <TouchableOpacity
            onPress={() => changePlan("basic")}
            className={`mt-4 p-5 rounded-2xl ${
              selectedPlan === "basic" ? "bg-blue-600" : "bg-gray-100"
            }`}
          >
            <Text
              className={`text-lg font-semibold ${
                selectedPlan === "basic" ? "text-white" : "text-gray-900"
              }`}
            >
              Basic
            </Text>

            <Feature text="Basic tracking" available={true} active={selectedPlan === "basic"} />
            <Feature text="Real-time tracking" available={true} active={selectedPlan === "basic"} />
            <Feature text="Location history" available={false} active={selectedPlan === "basic"} />
            <Feature text="Alerts" available={false} active={selectedPlan === "basic"} />
          </TouchableOpacity>

          {/* PREMIUM PLAN */}
          <TouchableOpacity
            onPress={() => changePlan("premium")}
            className={`mt-4 p-5 rounded-2xl ${
              selectedPlan === "premium" ? "bg-blue-600" : "bg-gray-100"
            }`}
          >
            <Text
              className={`text-lg font-semibold ${
                selectedPlan === "premium" ? "text-white" : "text-gray-900"
              }`}
            >
              Premium
            </Text>

            <Feature text="Basic tracking" available={true} active={selectedPlan === "premium"} />
            <Feature text="Real-time tracking" available={true} active={selectedPlan === "premium"} />
            <Feature text="Location history" available={true} active={selectedPlan === "premium"} />
            <Feature text="Alerts" available={true} active={selectedPlan === "premium"} />
          </TouchableOpacity>

          {/* CONTINUE BUTTON */}
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/auth/register",
                params: { plan: selectedPlan }, // pass plan
              })
            }
            className="mt-10 bg-blue-600 py-4 rounded-xl"
          >
            <Text className="text-white text-center font-semibold">
              Continue
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}