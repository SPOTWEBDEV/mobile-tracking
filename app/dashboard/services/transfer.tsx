import { useAppTheme } from "@/hooks/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Animated,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import ConfirmPinModal from "../../../components/clients/PinConfirmModal";
import { useAuth } from "../../context/AuthContext";

let debounceTimer: any;

export default function TransferScreen() {
  const { colors } = useAppTheme();
  const { user, token, setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [checking, setChecking] = useState(false);
  const [validUser, setValidUser] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter()
  // const 

  const fadeAnim = new Animated.Value(0);

  const fadeIn = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  /* ================= API LOGIC (UNCHANGED) ================= */

  const fetchUser = async (typedEmail: string) => {
    setReceiverName("");
    setValidUser(false);

    if (!typedEmail.includes("@")) return;

    setChecking(true);

    try {
      const res = await fetch(`https://asfast-app.com/api/api/user/transfer.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: "fetchuser",
          email: typedEmail,
        }),
      });

      const text = await res.text();
      const data = JSON.parse(text);
      setChecking(false);

      if (data.status) {
        setReceiverName(data.data.fullname);
        setValidUser(true);
        fadeIn();
      } else {
        setReceiverName("Beneficiary not found");
        setValidUser(false);
        fadeIn();
      }
    } catch {
      setChecking(false);
      Toast.show({
        type: "error",
        text1: "Network error",
      });
    }
  };

  const submitTransfer = async (pin: string) => {
    if (!validUser) return;

    const res = await fetch(`https://asfast-app.com/api/api/user/transfer.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        action: "transfer_user",
        amount,
        pin,
      }),
    });

    const text = await res.text();
    const data = JSON.parse(text);
    setShowPin(false);

    if (data.status && user) {
      Toast.show({
        type: "success",
        text1: "Transfer Successful",
      });
      setUser({ ...user, bal: data.data.new_balance });
      setEmail("");
      setAmount("");
      setReceiverName("");
      setValidUser(false);
    } else {
      Toast.show({
        type: "error",
        text1: "Transfer failed",
        text2: data.message,
      });
    }
  };

  /* ================= UI ================= */

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">

      <ScrollView>
        <View className="flex">
          {/* HEADER */}
          <View className="px-5 pt-6 flex-row items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="#111827" />
            </TouchableOpacity>
          </View>

          {/* TITLE */}
          <View className="px-5 pt-4">
            <Text className="text-2xl font-bold text-gray-900">
              Transfer Funds
            </Text>
            <Text className="text-gray-500 mt-1">
                Transfer funds to another Monitor Spirt user
            </Text>
          </View>
        </View>

   

        {/* FORM */}
        <View className="px-5 gap-y-3 mt-8 space-y-5">
          <Input
            label="Monitor Spirt User Email Or Username"
            icon="mail-outline"
            value={email}
            setValue={(text: string) => {
              setEmail(text);
              setReceiverName("");
              setValidUser(false);
            }}
            onBlur={() => fetchUser(email)}
          />

          {/* BENEFICIARY NAME */}
          <View className="h-5">
            {checking && (
              <Text className="text-sm text-gray-400">
                Checking recipient...
              </Text>
            )}

            {!checking && receiverName !== "" && (
              <Animated.Text
                style={{
                  opacity: fadeAnim,
                  color: validUser ? "#16A34A" : "#DC2626",
                  fontWeight: "600",
                }}
              >
                {receiverName}
              </Animated.Text>
            )}
          </View>

          <Input
            label="Amount Transfering To User"
            icon="cash-outline"
            value={amount}
            setValue={setAmount}
            keyboard="number-pad"
          />
        </View>

        {/* BUTTON */}
        <View className="px-5 mt-10 mb-6">
          <TouchableOpacity
            disabled={!email || !amount || !validUser}
            onPress={() => setShowPin(true)}
            className={`h-14 rounded-xl items-center justify-center ${email && amount && validUser
              ? "bg-blue-600"
              : "bg-gray-300"
              }`}
          >
            <Text className="text-white font-semibold text-lg">
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ConfirmPinModal
        visible={showPin}
        onClose={() => setShowPin(false)}
        onConfirm={submitTransfer}
      />

     
    </SafeAreaView>
  );
}

/* ---------- SAME INPUT COMPONENT FROM KYC ---------- */

function Input({ label, icon, value, setValue, keyboard, onBlur }: any) {
  return (
    <View>
      <Text className="text-gray-700 mb-1">{label}</Text>
      <View className="flex-row items-center bg-white h-14 px-4 rounded-xl border border-gray-200">
        <Ionicons name={icon} size={18} color="#9CA3AF" />
        <TextInput
          value={value}
          onChangeText={setValue}
          onBlur={onBlur}
          keyboardType={keyboard}
          className="flex-1 ml-3"
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      </View>
    </View>
  );
}
