import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Switch, Text, View } from "react-native";

export default function SecuritySettings() {
  
  const [isBiometricOn, setIsBiometricOn] = useState(false);

  // Dynamic track/thumb colors for Switch
  const trackColor = { false: "#D1D5DB", true: colors.primary };
  const thumbColor = isBiometricOn ? colors.primary : "#F3F4F6";

  return (
    <View className="mt-5 mb-2.5">
      <Text className="text-[13px] font-semibold mb-2" style={{ color: colors.subText }}>
        Security & Privacy
      </Text>

      <View className="rounded-2xl p-3" style={{ backgroundColor: colors.card }}>
        
        {/* Change Passcode */}
        <View className="flex-row items-center py-4 border-b" style={{ borderBottomColor: isDark ? "#334155" : "#E5E7EB" }}>
          <View className="flex-row items-center flex-1">
            <View className="w-9 h-9 rounded-lg items-center justify-center mr-3" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9" }}>
              <Ionicons name="lock-closed" size={20} color={colors.icon} />
            </View>
            <Text className="text-[15px] font-semibold" style={{ color: colors.text }}>
              Change Passcode
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.primary} />
        </View>

        {/* Another Change Passcode (example duplicate) */}
        <View className="flex-row items-center py-4 border-b" style={{ borderBottomColor: isDark ? "#334155" : "#E5E7EB" }}>
          <View className="flex-row items-center flex-1">
            <View className="w-9 h-9 rounded-lg items-center justify-center mr-3" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9" }}>
              <Ionicons name="lock-closed" size={20} color={colors.icon} />
            </View>
            <Text className="text-[15px] font-semibold" style={{ color: colors.text }}>
              Change Passcode
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.primary} />
        </View>

        {/* Biometrics */}
        <View className="flex-row items-center py-4 border-b" style={{ borderBottomColor: isDark ? "#334155" : "#E5E7EB" }}>
          <View className="flex-row items-center flex-1">
            <View className="w-9 h-9 rounded-lg items-center justify-center mr-3" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9" }}>
              <Ionicons name="finger-print" size={20} color="#FBBF24" />
            </View>
            <View>
              <Text className="text-[15px] font-semibold" style={{ color: colors.text }}>
                Biometrics for transactions
              </Text>
              <Text className="text-[12px]" style={{ color: colors.subText }}>
                Authenticate transactions with biometrics
              </Text>
            </View>
          </View>
          <Switch value={isBiometricOn} onValueChange={setIsBiometricOn} trackColor={trackColor} thumbColor={thumbColor} />
        </View>

        {/* Hidden Balance */}
        <View className="flex-row items-center py-4 border-b" style={{ borderBottomColor: isDark ? "#334155" : "#E5E7EB" }}>
          <View className="flex-row items-center flex-1">
            <View className="w-9 h-9 rounded-lg items-center justify-center mr-3" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9" }}>
              <Ionicons name="eye" size={20} color="#FBBF24" />
            </View>
            <Text className="text-[15px] font-semibold" style={{ color: colors.text }}>
              Hidden Balance
            </Text>
          </View>
          <Switch value={isBiometricOn} onValueChange={setIsBiometricOn} trackColor={trackColor} thumbColor={thumbColor} />
        </View>

        {/* Dark Mode */}
        <View className="flex-row items-center py-4">
          <View className="flex-row items-center flex-1">
            <View className="w-9 h-9 rounded-lg items-center justify-center mr-3" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9" }}>
              <Ionicons name="moon" size={20} color="#FBBF24" />
            </View>
            <View>
              <Text className="text-[15px] font-semibold" style={{ color: colors.text }}>
                Dark Mode
              </Text>
              <Text className="text-[12px]" style={{ color: colors.subText }}>
                Toggle app theme
              </Text>
            </View>
          </View>
          <Switch value={isDark} onValueChange={() => {}} trackColor={trackColor} thumbColor={thumbColor} />
        </View>

      </View>
    </View>
  );
}
