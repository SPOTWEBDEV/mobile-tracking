import { useAppTheme } from "@/hooks/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SideMenuModal from "../../components/clients/Nav/SideMenuModal";
import { useThemeMode } from "../../hooks/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function SettingsScreen() {
  const { colors } = useAppTheme();
  const { isDark, setMode } = useThemeMode();

  const [notifications, setNotifications] = useState(false);
  const [biometrics, setBiometrics] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <ScrollView>
        {/* HEADER (KYC STYLE) */}
        <View className="px-5 pt-6">
          <Text className="text-2xl font-bold text-gray-900">Settings</Text>
          <Text className="text-gray-500 mt-1">Manage your preferences</Text>
        </View>

        {/* SETTINGS SECTION */}
        <View className="px-5 mt-6 space-y-4 flex flex-col gap-3">
          {/* PROFILE */}
          <SettingItem
            label="Profile"
            icon="person-circle-outline"
            link="/dashboard/profile"
          />

          {/* KYC */}
          <SettingItem
            label="Identity Verification (KYC)"
            icon="id-card-outline"
            link="/dashboard/kyc"
          />

          {/* BANK */}
          <SettingItem
            label="Add Bank"
            icon="card-outline"
            link="/dashboard/bank"
          />

          {/* PASSWORD */}
          <SettingItem
            label="Change Password"
            icon="key-outline"
            link="/dashboard/changepassword"
          />

          {/* DARK MODE */}
          <SettingSwitch
            label="Dark Mode"
            icon="moon-outline"
            value={isDark}
            onChange={(v) => setMode(v ? "dark" : "light")}
          />

          {/* NOTIFICATIONS */}
          <SettingSwitch
            label="Notifications"
            icon="notifications-outline"
            value={notifications}
            onChange={setNotifications}
          />
          <SettingSwitch
            label="Face ID / Touch ID"
            icon="shield-checkmark-outline"
            value={biometrics}
            onChange={setBiometrics}
          />

          {/* LOGOUT */}
          <TouchableOpacity
            onPress={logout}
            className="flex-row items-center justify-between bg-white h-14 px-4 rounded-xl border border-gray-200"
            activeOpacity={0.85}
          >
            <View className="flex-row items-center gap-3">
              <Ionicons name="log-out-outline" size={18} color="#9CA3AF" />
              <Text className="text-gray-900 font-medium">Logout</Text>
            </View>

            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <SideMenuModal visible={menuOpen} onClose={() => setMenuOpen(false)} />
    </SafeAreaView>
  );
}

/* ---------- REUSABLE COMPONENTS (KYC STYLE) ---------- */

function SettingItem({
  label,
  icon,
  link,
}: {
  label: string;
  icon: any;
  link?: string;
}) {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => link && router.push(link as any)}
      className="flex-row items-center justify-between bg-white h-14 px-4 rounded-xl border border-gray-200"
      activeOpacity={0.85}
    >
      <View className="flex-row items-center gap-3">
        <Ionicons name={icon} size={18} color="#9CA3AF" />
        <Text className="text-gray-900 font-medium">{label}</Text>
      </View>

      {link && <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />}
    </TouchableOpacity>
  );
}

function SettingSwitch({
  label,
  icon,
  value,
  onChange,
}: {
  label: string;
  icon: any;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View className="flex-row justify-between  items-center bg-white h-14 px-4 rounded-xl border border-gray-200">
      <View className="flex-row items-center gap-3">
        <Ionicons name={icon} size={18} color="#9CA3AF" />
        <Text className="text-gray-900 font-medium">{label}</Text>
      </View>

      <Switch
        className="mt-2"
        value={value}
        onValueChange={onChange}
        trackColor={{ false: "#E5E7EB", true: "#A7F3D0" }}
        thumbColor={value ? "#2563EB" : "#D1D5DB"}
      />
    </View>
  );
}
