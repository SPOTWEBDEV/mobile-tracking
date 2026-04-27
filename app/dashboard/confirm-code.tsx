import { useAppTheme } from "@/hooks/theme";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ConfirmCodeScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();

  // Dynamic params
  const {
    title = "Confirm Your Action",
    description = "Please enter the 4-digit code sent to",
    target = "",
    purpose = "default", // email | withdrawal | pin 
  } = useLocalSearchParams();

  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async () => {
    if (code.length !== 4) return;

    // Example API call
    const res = await fetch("https://yourapi.com/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, purpose }),
    });

    const data = await res.json();

    if (!data.success) {
      alert("Invalid code");
      return;
    }

    alert("Verification successful ✅");
    router.back();
  };

  const resendCode = () => {
    setTimer(30);
    // Call resend API here
  };

  return (
    <View
      className="flex-1 px-6 pt-14"
      style={{ backgroundColor: colors.background }}
    >
      {/* BACK */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="flex-row items-center mb-8"
      >
        <Ionicons name="arrow-back" size={22} color={colors.text} />
        <Text className="ml-2 text-sm" style={{ color: colors.subText }}>
          Back
        </Text>
      </TouchableOpacity>

      {/* TITLE */}
      <Text
        className="text-2xl font-semibold mb-3"
        style={{ color: colors.text }}
      >
        {title}
      </Text>

      {/* DESCRIPTION */}
      <Text
        className="text-base leading-6 mb-6"
        style={{ color: colors.subText }}
      >
        {description}{" "}
        <Text style={{ color: colors.text, fontWeight: "600" }}>
          {target}
        </Text>
      </Text>

      {/* CODE INPUT */}
      <View
        className="rounded-2xl px-4 py-5 mb-6"
        style={{ backgroundColor: colors.card }}
      >
        <TextInput
          value={code}
          onChangeText={setCode}
          keyboardType="numeric"
          maxLength={4}
          placeholder="Enter Code"
          placeholderTextColor={colors.subText}
          className="text-lg tracking-widest"
          style={{ color: colors.text }}
        />
      </View>

      {/* RESEND */}
      <View className="flex-row justify-center mb-10">
        <Text style={{ color: colors.subText }}>
          Didn't get any code?{" "}
        </Text>

        {timer > 0 ? (
          <Text style={{ color: colors.subText }}>
            Resend in {timer}s
          </Text>
        ) : (
          <TouchableOpacity onPress={resendCode}>
            <Text style={{ color: colors.primary, fontWeight: "600" }}>
              Resend
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* VERIFY BUTTON */}
      <TouchableOpacity
        onPress={handleVerify}
        disabled={code.length !== 4}
        className="py-4 rounded-2xl"
        style={{
          backgroundColor:
            code.length === 4 ? colors.primary : colors.card,
        }}
      >
        <Text
          className="text-center font-semibold text-lg"
          style={{
            color:
              code.length === 4
                ? colors.primaryText
                : colors.subText,
          }}
        >
          Verify
        </Text>
      </TouchableOpacity>
    </View>
  );
}
