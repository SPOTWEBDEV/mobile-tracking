import { useAuth } from "@/app/context/AuthContext";
import { useAppTheme } from "@/hooks/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
};

const menuItems = [
  { icon: "home", label: "Home", route: "/(tabs)/" },
  { icon: "gift", label: "Gift Card", route: "/dashboard/services/giftcard" },
  { icon: "card", label: "Virtual Card", route: "/dashboard/services/virtualcard" },
  { icon: "grid", label: "Services", route: "/(tabs)/services" },
  { icon: "swap-horizontal", label: "Trade", route: "/(tabs)/trade" },
  { icon: "wallet", label: "Wallet", route: "/(tabs)/wallet" },
  { icon: "people", label: "Referral", route: "/dashboard/refferal" },
  { icon: "shield-checkmark", label: "KYC", route: "/dashboard/kyc" },
  { icon: "business", label: "Bank Account", route: "/dashboard/bank" },
  { icon: "lock-closed", label: "Change Password", route: "/dashboard/changepassword" },
];

export default function SideMenuModal({
  visible,
  onClose,
}: Props) {
  const { colors } = useAppTheme();
  const router = useRouter();
  const {user} = useAuth()

  return (
    <Modal transparent animationType="slide" visible={visible}>
      {/* BACKDROP */}
      <Pressable
        className="flex-1"
        style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        onPress={onClose}
      />

      {/* SIDE MENU */}
      <View
        className="absolute left-0 top-0 bottom-0 w-[85%]"
        style={{ backgroundColor: colors.background }}
      >
        {/* HEADER */}
        <View className="px-5 pt-4 pb-4 border-b border-gray-200">
          <TouchableOpacity
            onPress={onClose}
            className="self-end flex-row items-center space-x-2 mb-4"
          >
            <Ionicons name="close" size={20} color="#EF4444" />
            <Text style={{ color: "#EF4444", fontWeight: "600" }}>Close</Text>
          </TouchableOpacity>

          <Text className="text-xl font-bold mb-2" style={{ color: colors.text }}>
            {user?.firstName} {user?.lastName}
          </Text>

          <View className="flex-row items-center justify-between">
            <Text style={{ color: colors.subText }}>
              User level: {user?.kyc_level}
            </Text>
          </View>
        </View>

        {/* SCROLLABLE MENU */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
        >
          {menuItems.map((item) => (
            <MenuItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              onPress={() => {
                onClose();
                router.push(item.route as any);
              }}
            />
          ))}

          {/* LOGOUT */}
          <TouchableOpacity className="flex-row items-center mt-6 gap-3">
            <Ionicons name="log-out" size={20} color={colors.subText} />
            <Text style={{ color: colors.subText, fontWeight: "600" }}>
              Log out
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* FOOTER */}
        <Text
          className="absolute bottom-6 self-center text-xs"
          style={{ color: colors.subText }}
        >
          LIVE v4.2.8 Build: 2 – (iOS)
        </Text>
      </View>
    </Modal>
  );
}

/* ======================
   MENU ITEM
====================== */
const MenuItem = ({
  icon,
  label,
  onPress,
}: {
  icon: any;
  label: string;
  onPress: () => void;
}) => {
  const { colors } = useAppTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center px-4 py-4 rounded-xl mb-3 gap-3"
      style={{ backgroundColor: colors.card }}
    >
      <Ionicons name={icon} size={20} color={colors.icon} />
      <Text style={{ color: colors.text, fontWeight: "600" }}>{label}</Text>
    </TouchableOpacity>
  );
};
