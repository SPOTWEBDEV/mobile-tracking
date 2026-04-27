import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useAuth } from "../context/AuthContext";

const API_BASE = "https://asfast-app.com/api/api";

export default function ChangePasswordScreen() {
  const { token } = useAuth();
  const router = useRouter();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "All fields are required",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Passwords do not match",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/change-password.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });

      const text = await res.text();
      const data = JSON.parse(text);

      if (!data.status) {
        Toast.show({
          type: "error",
          text1: "Change Password Failed",
          text2: data.message,
        });
        return;
      }

      Toast.show({
        type: "success",
        text1: "Password Updated",
        text2: data.message,
      });

      router.back();
    } catch {
      Toast.show({
        type: "error",
        text1: "Network Error",
        text2: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <ScrollView>
        {/* HEADER */}
        <View className="px-5 pt-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm"
          >
            <Ionicons name="chevron-back" size={22} color="#111827" />
          </TouchableOpacity>

          <Text className="text-2xl mt-4 font-bold text-gray-900">
            Change Password
          </Text>
          <Text className="text-gray-500 mt-1">
            Secure your account by updating your password
          </Text>
        </View>

        {/* FORM */}
        <View className="px-5 mt-6 space-y-5 gap-4">
          <Input
            label="Old Password"
            icon="lock-closed-outline"
            value={oldPassword}
            setValue={setOldPassword}
            secure
          />

          <Input
            label="New Password"
            icon="lock-open-outline"
            value={newPassword}
            setValue={setNewPassword}
            secure
          />

          <Input
            label="Confirm New Password"
            icon="shield-checkmark-outline"
            value={confirmPassword}
            setValue={setConfirmPassword}
            secure
          />
        </View>

        {/* BUTTON */}
        <View className="px-5 mt-10 mb-6">
          <TouchableOpacity
            onPress={handleChangePassword}
            disabled={loading}
            className={`h-14 rounded-xl items-center justify-center ${
              loading ? "bg-blue-400" : "bg-blue-600"
            }`}
          >
            <Text className="text-white font-semibold text-lg">
              {loading ? "Updating..." : "Update Password"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- Reusable Input (same as KYC) ---------- */

function Input({ label, icon, value, setValue, secure }: any) {
  return (
    <View>
      <Text className="text-gray-700 mb-1">{label}</Text>
      <View className="flex-row items-center bg-white h-14 px-4 rounded-xl border border-gray-200">
        <Ionicons name={icon} size={18} color="#9CA3AF" />
        <TextInput
          value={value}
          onChangeText={setValue}
          secureTextEntry={secure}
          className="flex-1 ml-3"
          placeholder={label}
        />
      </View>
    </View>
  );
}
