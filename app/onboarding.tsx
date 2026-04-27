import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const slides = [
    { title: "Track Devices", desc: "Monitor location in real-time" },
    { title: "Stay Secure", desc: "Only with permission access" },
    { title: "Easy Control", desc: "Start and stop anytime" },
  ];

  const next = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      router.replace("/pricing");
    }
  };

  return (
    <View className="flex-1 bg-white justify-center px-6">
      <Text className="text-3xl font-bold text-gray-900 text-center">
        {slides[step].title}
      </Text>

      <Text className="text-gray-500 mt-4 text-center">
        {slides[step].desc}
      </Text>

      <TouchableOpacity
        onPress={next}
        className="mt-10 bg-blue-600 py-4 rounded-xl"
      >
        <Text className="text-white text-center">
          {step === 2 ? "Continue" : "Next"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}