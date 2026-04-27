import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Keyboard,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useAuth } from "../context/AuthContext";
import ConfirmPinModal from "../../components/clients/PinConfirmModal"; // 👈 your PIN modal

export default function WithdrawAmount() {
  const [amount, setAmount] = useState("");
  const [showRequirementModal, setShowRequirementModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { user, token, setUser } = useAuth();

  const balance = Number(user?.bal ?? 0);
  const API_BASE = "https://asfast-app.com/api/api";

  /* =========================
     REQUIREMENTS
  ========================= */
  const checklist = [
    {
      label: "Add Transaction PIN",
      completed: user?.haspin == "1",
      route: "/dashboard/set-transaction-pin",
    },
    {
      label: "Complete Level 3 KYC",
      completed: Number(user?.kyc_level) === 1,
      route: "/dashboard/kyc",
    },
    {
      label: "Add Bank Account",
      completed: user?.has_bank_account === 1,
      route: "/dashboard/bank",
    },
  ];

  const allDone = checklist.every((i) => i.completed);

  /* =========================
     SHOW REQUIREMENT MODAL
  ========================= */
  useFocusEffect(
    useCallback(() => {
      setShowRequirementModal(!allDone);
      return () => setShowRequirementModal(false);
    }, [allDone])
  );

  const handleRequirementAction = () => {
    const firstMissing = checklist.find((i) => !i.completed);
    setShowRequirementModal(false);

    if (!firstMissing) return;

    setTimeout(() => {
      router.push(firstMissing.route as any);
    }, 400);
  };

  /* =========================
     START WITHDRAW FLOW
  ========================= */
  const handleWithdrawPress = () => {
    const value = Number(amount);

    if (!value || value <= 0) {
      Toast.show({ type: "error", text1: "Enter a valid amount" });
      return;
    }

    if (value > balance) {
      Toast.show({ type: "error", text1: "Insufficient balance" });
      return;
    }

    // ✅ Open PIN modal instead of input
    setShowPinModal(true);
  };

  /* =========================
     CONFIRM PIN & SUBMIT
  ========================= */
  const submitWithdraw = async (pin: string) => {
    setShowPinModal(false);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/user/withdraw.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: Number(amount),
          pin,
        }),
      });

      const text = await res.text();
      console.log(text)
      const data = JSON.parse(text);

      if (!data.status) {
        Toast.show({ type: "error", text1: data.message });
        return;
      }

      if (user) {
        setUser({
          ...user,
          bal: data.data.new_balance.toString(),
        });
      }

      Toast.show({
        type: "success",
        text1: "Withdrawal submitted",
        text2: `₦${Number(amount).toLocaleString()} deducted`,
      });

      router.push("/dashboard/transactions");
    } catch {
      Toast.show({ type: "error", text1: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      {/* =========================
          REQUIREMENT MODAL
      ========================= */}
      <Modal visible={showRequirementModal} transparent animationType="fade">
        <View className="flex-1 justify-center bg-black/60 px-6">
          <View className="bg-white rounded-2xl p-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Withdrawal Requirements
            </Text>

            {checklist.map((item, index) => (
              <View key={index} className="flex-row items-center mb-3">
                <Ionicons
                  name={
                    item.completed
                      ? "checkmark-circle"
                      : "close-circle"
                  }
                  size={20}
                  color={item.completed ? "#10B981" : "#EF4444"}
                />
                <Text
                  className={`ml-3 ${item.completed
                    ? "text-gray-900"
                    : "text-gray-500"
                    }`}
                >
                  {item.label}
                </Text>
              </View>
            ))}

            <TouchableOpacity
              onPress={handleRequirementAction}
              className="mt-5 h-12 rounded-xl bg-blue-600 items-center justify-center"
            >
              <Text className="text-white font-semibold">
                Fix Requirement
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* =========================
          MAIN CONTENT
      ========================= */}
      {!showRequirementModal && (
        <ScrollView keyboardShouldPersistTaps="handled">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="px-5 pt-6">
              {/* HEADER */}
              <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm">
                <Ionicons name="chevron-back" size={22} color="#111827" />
              </TouchableOpacity>

              <View className="pt-6">
                <Text className="text-2xl font-bold text-gray-900">
                  Withdraw
                </Text>
                <Text className="text-gray-500 mt-1">
                  Withdraw from your wallet
                </Text>
              </View>

              {/* CARD */}
              <View className=" rounded-2xl py-5 ">
                <Text className="font-medium text-gray-900">
                  Amount
                </Text>

                <TextInput
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  placeholder="Enter amount"
                  placeholderTextColor="#9CA3AF"
                  className="mt-2 rounded-xl px-4 py-4 border border-gray-200 text-gray-900"
                />

                <Text className="mt-3 text-gray-500">
                  Available balance: ₦{balance.toLocaleString()}
                </Text>

                <TouchableOpacity
                  onPress={handleWithdrawPress}
                  disabled={loading}
                  className="mt-8 h-14 rounded-xl bg-blue-600 items-center justify-center"
                >
                  <Text className="text-white font-semibold text-lg">
                    Continue
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      )}

      {/* =========================
          PIN MODAL
      ========================= */}
      <ConfirmPinModal
        visible={showPinModal}
        onClose={() => setShowPinModal(false)}
        onConfirm={submitWithdraw}
      />
    </SafeAreaView>
  );
}
