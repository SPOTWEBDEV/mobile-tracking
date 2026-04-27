import { useAuth } from "@/app/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";


const API_BASE = "https://asfast-app.com/api/api";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasStoredUser, setHasStoredUser] = useState(false);

  /* =====================
     LOAD STORED USER
  ===================== */
  useEffect(() => {
    (async () => {
      const storedUser = await SecureStore.getItemAsync("user");
      const storedToken = await SecureStore.getItemAsync("token");

      if (storedUser && !storedToken) {
        const user = JSON.parse(storedUser);
        setEmail(user.email);
        setHasStoredUser(true);
      }
    })();
  }, []);

  /* =====================
     LOGIN HANDLER (UNCHANGED)
  ===================== */
  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Email and password required",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const text = await res.text();
      const data = JSON.parse(text);

      if (!data.status) {
        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: data.message,
        });
        return;
      }

      await login(data.data.token, data.data.user);

      if (data.data.user.email_verified == 0) {
        router.replace("/auth/verify-email");
        return;
      }

      if (data.data.user.haspin == 0) {
        router.replace("/auth/set-transaction-pin");
        return;
      }

      Toast.show({
        type: "success",
        text1: "Welcome back 👋",
        text2: data.data.user.firstName,
      });

      router.replace("/(tabs)");
    } catch {
      Toast.show({
        type: "error",
        text1: "Network Error",
        text2: "Unable to connect to server",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10 }}
        >
          <TouchableOpacity onPress={() => router.push('/screen')} className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm">
            <Ionicons name="chevron-back" size={22} color="#111827" />
          </TouchableOpacity>
          {/* HEADER */}
          <Text className="text-2xl mt-5 font-bold text-gray-900">
            Welcome Back
          </Text>
          <Text className="text-gray-500 mt-1">
            Login to continue
          </Text>

          {/* STORED USER */}
          {hasStoredUser && (
            <View className="mt-8 bg-white p-4 rounded-xl border border-gray-200">
              <Text className="text-gray-700 font-semibold">
                Signed in as
              </Text>
              <Text className="text-gray-900 mt-1">{email}</Text>
            </View>
          )}

          {/* EMAIL */}
          {!hasStoredUser && (
            <View className="mt-8">
              <Text className="text-gray-700 mb-1">Email Address</Text>
              <View className="bg-white h-14 px-4 rounded-xl border border-gray-200 justify-center">
                <TextInput
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  className="text-base"
                />
              </View>
            </View>
          )}

          {/* PASSWORD */}
          <View className="mt-6">
            <Text className="text-gray-700 mb-1">Password</Text>
            <View className="flex-row items-center bg-white h-14 px-4 rounded-xl border border-gray-200">
              <TextInput
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secure}
                className="flex-1 text-base"
              />
              <TouchableOpacity onPress={() => setSecure(!secure)}>
                <Ionicons
                  name={secure ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* LOGIN BUTTON */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            className={`mt-10 h-14 rounded-xl justify-center ${loading ? "bg-gray-400" : "bg-blue-600"
              }`}
          >
            <Text className="text-white text-center font-semibold text-base">
              {loading ? "Logging in..." : "Log In"}
            </Text>
          </TouchableOpacity>

          {/* SWITCH ACCOUNT */}
          {hasStoredUser && (
            <TouchableOpacity
              className="mt-6"
              onPress={async () => {
                await SecureStore.deleteItemAsync("user");
                setHasStoredUser(false);
                setEmail("");
                setPassword("");
              }}
            >
              <Text className="text-center text-gray-600">
                Not you?{" "}
                <Text className="font-semibold text-gray-900">
                  Switch account
                </Text>
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
