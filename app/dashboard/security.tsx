import SideMenuModal from "@/components/clients/Nav/SideMenuModal";
import { useAppTheme } from "@/hooks/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeMode } from "../../hooks/ThemeContext";


export default function SecurityScreen() {
  const { colors } = useAppTheme();
  const [notifications, setNotifications] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { mode, setMode, isDark } = useThemeMode();



  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      {/* HEADER */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <View
          className="flex-row items-center gap-3 px-4 py-2 rounded-full"
          style={{ backgroundColor: colors.card }}
        >
          <Ionicons onPress={() => setMenuOpen(true)} name="menu" size={20} color={colors.icon} />
          <Text className="font-semibold" style={{ color: colors.text }}>
            Security
          </Text>
        </View>

        <View
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.card }}
        >
          <Ionicons name="mail" size={18} color={colors.icon} />
        </View>
      </View>

      {/* SETTINGS LIST */}
      <View className="mt-6 px-6 flex flex-col  gap-3 space-y-4">
        <SettingItem link='/dashboard/changepassword' icon="person" label="Change Password" />
        <SettingItem link='/dashboard/set-pin' icon="lock-closed" label="Set Pin" />
      </View>
      <SideMenuModal
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </SafeAreaView>
  );
}


const SettingItem = ({
  icon,
  label,
  right,
  link
}: {
  icon: any;
  label: string;
  right?: React.ReactNode;
  link?: string
}) => {
  const { colors } = useAppTheme();
  const routes = useRouter()

  return (
    <TouchableOpacity
      onPress={() => routes.push(link as any)}
      activeOpacity={0.85}
      className="flex-row items-center justify-between px-4 py-4 rounded-xl"
      style={{ backgroundColor: colors.card }}
    >
      <View className="flex-row items-center gap-4">
        <View
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.iconBg }}
        >
          <Ionicons name={icon} size={18} color={colors.icon} />
        </View>

        <Text className="font-semibold" style={{ color: colors.text }}>
          {label}
        </Text>
      </View>

      {right}
    </TouchableOpacity>
  );
};
