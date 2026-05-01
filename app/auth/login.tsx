import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Toast from "react-native-toast-message";

const API_BASE = "https://spotwebtech.com.ng/monitor-spirit/api";

export default function RegisterScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Missing Fields",
        text2: "All required fields must be filled"
      });
      return;
    }
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/login.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          password
        }),
      });

      const text = await res.text();
      console.log("LOGIN RESPONSE:", text);

      const data = JSON.parse(text);

      if (!data.status) {
        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: data.message || "Invalid email or password"
        });
        return;
      }

      // ✅ SAVE TOKEN
      await AsyncStorage.setItem("token", data.token);

      // ✅ SAVE USER
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      Toast.show({
        type: "success",
        text1: "Login Successful",
      });

      // ✅ GO TO APP
      setTimeout(() => {
        router.replace("/(tabs)");
      }, 1000);





    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Network Error",
        text2: "Please try again"
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <SafeAreaView className="flex-1">

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 80} // adjust this number
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* your inputs */}
          {/* Header */}
          <View className="px-5 pt-4">
            {/* Back Button */}
            <TouchableOpacity onPress={() => router.push('/')} className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm">
              <Ionicons name="chevron-back" size={22} color="#111827" />
            </TouchableOpacity>


            {/* Title */}
            <Text className="text-2xl font-bold  mt-6">
              Sign In
            </Text>
            <Text className="text-gray-500 mt-1">
              Login to your  <Text className="text-blue-500 uppercase font-poppinsBold"> Monitor Spirt account</Text>
            </Text>
          </View>

          {/* Form */}
          <View className="px-5 mt-6 flex flex-col gap-3 space-y-5">


            {/* email Address */}
            <View>
              <Text className="text-gray-700 mb-1 mt-3">Email Address</Text>
              <View className="flex-row items-center bg-white rounded-xl px-4 h-14 border border-gray-200">
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#9CA3AF"
                />
                <TextInput
                  placeholder="Enter Email Address"
                  value={email}
                  onChangeText={setEmail}
                  className="flex-1 ml-3 text-gray-900"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
            {/* Password */}
            <View>
              <Text className="text-gray-700 mb-1 mt-3">Password</Text>
              <View className="flex-row items-center bg-white rounded-xl px-4 h-14 border border-gray-200">
                <Ionicons name="key-outline" size={20} color="#9CA3AF" />
                <TextInput
                  placeholder="Type Password"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  className="flex-1 ml-3 text-gray-900"
                  placeholderTextColor="#9CA3AF"
                />

                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>
            </View>


          </View>

          {/* Bottom Button */}
          <View className="px-5 mt-10 mb-6">
            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              className="h-14 bg-blue-600 rounded-xl items-center justify-center"
            >
              <Text className="text-white font-semibold text-lg">
                {loading ? "Login To  Account..." : "Login"}
              </Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
