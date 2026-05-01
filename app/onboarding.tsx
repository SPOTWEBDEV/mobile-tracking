import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const slides = [
    {
      title: "Security Awareness",
      icon: "shield-checkmark",
      desc: [
        "Your safety comes first. This app helps you monitor devices responsibly.",
        "Always ensure tracking is done with full consent and for valid reasons.",
      ],
    },
    {
      title: "Use Responsibly",
      icon: "warning",
      desc: [
        "This platform is built for safety — not misuse.",
        "Do not use it for scams, stalking, or harmful activities.",
      ],
    },
    {
      title: "24/7 Support",
      icon: "headset",
      desc: [
        "Our support team is always available to help you anytime.",
        "Get assistance with setup, issues, or security concerns.",
      ],
    },
  ];

  const animateSlide = (nextStep: number) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    setStep(nextStep);
  };

  const next = () => {
    if (step < slides.length - 1) {
      animateSlide(step + 1);
    } else {
      router.replace("/auth/login");
    }
  };

  const skip = () => {
    router.replace("/auth/login");
  };

  return (
    <View className="flex-1 bg-white justify-center px-6">
      {/* Skip Button */}
      <TouchableOpacity
        onPress={skip}
        className="absolute top-16 right-6"
      >
        <Text className="text-gray-500">Skip</Text>
      </TouchableOpacity>

      {/* Animated Content */}
      <Animated.View style={{ opacity: fadeAnim }}>
        {/* Icon */}
        <View className="items-center mb-6">
          <View className="bg-blue-100 p-6 rounded-full">
            <Ionicons
              name={slides[step].icon as any}
              size={40}
              color="#2563EB"
            />
          </View>
        </View>

        {/* Title */}
        <Text className="text-3xl font-bold text-gray-900 text-center">
          {slides[step].title}
        </Text>

        {/* Description */}
        <View className="mt-4">
          {slides[step].desc.map((paragraph, index) => (
            <Text
              key={index}
              className="text-gray-500 text-center mt-2 leading-6"
            >
              {paragraph}
            </Text>
          ))}
        </View>
      </Animated.View>

      {/* Dots Indicator */}
      <View className="flex-row justify-center mt-10">
        {slides.map((_, index) => (
          <View
            key={index}
            className={`h-2 mx-1 rounded-full ${
              step === index ? "bg-blue-600 w-6" : "bg-gray-300 w-2"
            }`}
          />
        ))}
      </View>

      {/* Next Button */}
      <TouchableOpacity
        onPress={next}
        className="mt-10 bg-blue-600 py-4 rounded-xl"
      >
        <Text className="text-white text-center font-semibold">
          {step === slides.length - 1 ? "Continue" : "Next"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}