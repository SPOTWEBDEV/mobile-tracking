import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { WebView } from "react-native-webview";
import { useAuth } from "../context/AuthContext";

const API_BASE = "https://asfast-app.com/api/api/user";

export default function DepositScreen() {
  const { user, setUser, token } = useAuth();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);


  const handleDeposit = async () => {
    if (!amount || Number(amount) < 100) {
      Toast.show({
        type: "error",
        text1: "Invalid Amount",
        text2: "Minimum deposit is ₦100",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/deposit-Initialize.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: Number(amount), phone: user?.kyc_details?.phone }),
      });

      const text = await res.text();

      console.log(text)
      const data = JSON.parse(text);

      if (!data.status || !data.data?.authorization_url) {
        Toast.show({
          type: "error",
          text1: "Deposit Failed",
          text2: data.message,
        });
        return;
      }

      setPaymentUrl(data.data.authorization_url);
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Deposit Failed",
        text2: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (reference: string) => {
    try {
      const res = await fetch(`${API_BASE}/deposit-status.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: user?.email, reference }),
      });

      const text = await res.text();
      const data = JSON.parse(text);

      if (data.status && user) {
        Toast.show({
          type: "success",
          text1: "Payment Verified",
          text2: data.message,
        });
        setUser({ ...user, bal: data.data.balance });
        router.push("/dashboard/transactions");
      }
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Network Error",
        text2: err.message,
      });
    } finally {
      setPaymentUrl(null);
      setAmount("");
    }
  };

  const handleWebViewNavigation = (navState: any) => {
    if (!navState.url) return;

    const url = navState.url;

    console.log(url)

    const refMatch =
      url.match(/reference=([\w-]+)/) ||
      url.match(/trxref=([\w-]+)/) ||
      url.match(/transaction_id=([\w-]+)/);

    if (refMatch?.[1]) {
      verifyPayment(refMatch[1]);
    }
  };


  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          {/* HEADER */}
          <View className="px-5 pt-6 flex-row items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="#111827" />
            </TouchableOpacity>
          </View>

          {/* TITLE */}
          <View className="px-5 pt-4">
            <Text className="text-2xl font-bold text-gray-900">
              Deposit
            </Text>
            <Text className="text-gray-500 mt-1">
              Fund your wallet securely
            </Text>
          </View>

          {/* FORM */}
          <View className="px-5 mt-6 space-y-6">
            {/* AMOUNT INPUT */}
            <View>
              <Text className="text-gray-700 mb-1">Amount (₦)</Text>
              <View className="flex-row items-center bg-white h-14 px-4 rounded-xl border border-gray-200">
                <Ionicons
                  name="cash-outline"
                  size={18}
                  color="#9CA3AF"
                />
                <TextInput
                  placeholder="Enter amount"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                  className="flex-1 ml-3 text-gray-900"
                />
              </View>
              <Text className="text-xs text-gray-500 mt-1">
                Minimum deposit is ₦100
              </Text>
            </View>
          </View>

          {/* SUBMIT BUTTON */}
          <View className="px-5 mt-10 mb-6">
            <TouchableOpacity
              onPress={handleDeposit}
              disabled={loading}
              className="h-14 bg-blue-600 rounded-xl items-center justify-center"
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-semibold text-lg">
                  Continue
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-5 pt-6 flex-row items-center">
          {/* PAYMENT WEBVIEW */}
          <Modal visible={!!paymentUrl} animationType="slide">
            <SafeAreaView className="flex-1">
              {paymentUrl && (
                <WebView
                  source={{ uri: paymentUrl }}
                  onNavigationStateChange={handleWebViewNavigation}
                  startInLoadingState
                />
              )}
            </SafeAreaView>
          </Modal>
        </View>


      </ScrollView>
    </SafeAreaView>
  );


}
