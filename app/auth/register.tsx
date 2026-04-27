import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
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

const API_BASE = "https://asfast-app.com/api/api";

export default function RegisterScreen() {
  const { plan } = useLocalSearchParams();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter()
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [referral, setReferral] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);


  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      alert("All required fields must be filled");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const nameParts = username.trim().split(" ");
    if (nameParts.length < 2) {
      alert("Please enter your full name");
      return;
    }

    const first_name = nameParts[0];
    const last_name = nameParts.slice(1).join(" ");

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/register.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          first_name,
          last_name,
          email,
          password,
          referral_code: referral,
        }),
      });

      const text = await res.text();
      console.log("REGISTER RESPONSE:", text);

      const data = JSON.parse(text);

      if (!data.status) {
        alert(data.message || "Registration failed");
        return;
      }

      // ✅ SUCCESS → Go to OTP screen
      router.push({
        pathname: "/auth/verify-email",
        params: {
          email: email,
        },
      });

    } catch (error) {
      console.log(error);
      alert("Network error. Please try again");
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
              Create account
            </Text>
            <Text className="text-gray-500 mt-1">
              Create your Monitor Spirt account to get started in minutes!
            </Text>
          </View>

          {/* Form */}
          <View className="px-5 mt-6 flex flex-col gap-3 space-y-5">
            {/* Username */}
            <View>
              <Text className="text-gray-700 mb-1 mt-3">Username</Text>
              <View className="flex-row items-center bg-white rounded-xl px-4 h-14 border border-gray-200">
                <Ionicons name="person-outline" size={20} color="#9CA3AF" />
                <TextInput
                  placeholder="Enter Username"
                  value={username}
                  onChangeText={setUserName}
                  className="flex-1 ml-3 text-gray-900"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* email Number */}
            <View>
              <Text className="text-gray-700 mb-1 mt-3">Email Number</Text>
              <View className="flex-row items-center bg-white rounded-xl px-4 h-14 border border-gray-200">
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#9CA3AF"
                />
                <TextInput
                  placeholder="Enter Email Number"
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

            {/* Confirm Password */}
            <View>
              <Text className="text-gray-700 mb-1 mt-3">Confirm Password</Text>
              <View className="flex-row items-center bg-white rounded-xl px-4 h-14 border border-gray-200">
                <Ionicons name="key-outline" size={20} color="#9CA3AF" />
                <TextInput
                  placeholder="Re-type Password"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  className="flex-1 ml-3 text-gray-900"
                  placeholderTextColor="#9CA3AF"
                />

                <TouchableOpacity
                  onPress={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  <Ionicons
                    name={
                      showConfirmPassword
                        ? "eye-off-outline"
                        : "eye-outline"
                    }
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
              onPress={handleRegister}
              disabled={loading}
              className="h-14 bg-blue-600 rounded-xl items-center justify-center"
            >
              <Text className="text-white font-semibold text-lg">
                {loading ? "Creating Account..." : "Create Account"}
              </Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>


    </SafeAreaView>
  );
}
