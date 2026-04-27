import { useAppTheme } from "@/hooks/theme";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
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

export default function TransferScreen() {
  const { colors } = useAppTheme();
  const { user, token, setUser } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [validUser, setValidUser] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [paymentAccount, setPaymentAccount] = useState(""); // selected bank id or special option
  const [banks, setBanks] = useState<any[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(true);
  const API_BASE = "https://asfast-app.com/api/api";

  const fadeAnim = new Animated.Value(0);

  /* ================== FETCH BANK ACCOUNTS ================== */
  useFocusEffect(
    useCallback(() => {
      const fetchBanks = async () => {
        if (!token) return;

        try {
          const res = await fetch(`${API_BASE}/user/bank.php`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ action: "fetch" }),
          });

          const data = await res.json();
          console.log("Fetched banks:", data);

          if (data.status && data.data) {
            setBanks([
              ...data.data,
              { id: "add_new", account_name: "Add another payment account" },
            ]);
            setPaymentAccount(data.data[0]?.id || "add_new");
          } else {
            setBanks([
              { id: "add_new", account_name: "Add another payment account" },
            ]);
            setPaymentAccount("add_new");
          }
        } catch {
          setBanks([
            { id: "add_new", account_name: "Add another payment account" },
          ]);
          setPaymentAccount("add_new");
        } finally {
          setLoadingBanks(false);
        }
      };

      fetchBanks();
    }, [token]),
  );

  /* ================== TRANSFER LOGIC ================== */
  const submitTransfer = async (pin: string) => {

    if (!amount || !paymentAccount || paymentAccount === "add_new") {
      Toast.show({
        type: "error",
        text1: "Invalid transfer details",
        text2: "Please enter amount and select a valid bank account",
      });
      return;
    }

    if (Number(amount) > Number(user?.bal)) {
      Toast.show({
        type: "error",
        text1: "Insufficient balance",
        text2: "You do not have enough funds to complete this transfer",
      });
      return;
    }

    console.log("Submitting transfer with:", { amount, paymentAccount, pin });


    const res = await fetch(`${API_BASE}/user/transfer.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        action: "transfer_bank",
        amount,
        pin,
        bank_id: paymentAccount,
      }),
    });

    const text = await res.text();
    console.log("Transfer response:", text);
    const data = JSON.parse(text);
    setShowPin(false);

    if (data.status && user) {
      Toast.show({ type: "success", text1: "Transfer Successful" });
      setUser({ ...user, bal: data.data.new_balance });
      setAmount("");
      setValidUser(false);
    } else {
      Toast.show({
        type: "error",
        text1: "Transfer failed",
        text2: data.message,
      });
    }
  };

  /* ================== UI ================== */
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
              Transfer funds to any bank account
            </Text>
          </View>
        </View>

        {/* FORM */}
        <View className="px-5 gap-y-3 mt-6 space-y-5">
          <Input
            label="Amount"
            icon="cash-outline"
            value={amount}
            setValue={setAmount}
            keyboard="number-pad"
          />

          {/* BANK SELECT */}
          {loadingBanks ? (
            <ActivityIndicator size="small" color="#0A145A" />
          ) : (
            <Select
              label="Payment Account"
              value={paymentAccount}
              options={banks}
              onSelect={(val: string) => {
                setPaymentAccount(val);
                if (val === "add_new") {
                  router.push("/dashboard/bank"); // navigate to add bank page
                }
              }}
            />
          )}
        </View>

        {/* BUTTON */}
        <View className="px-5 mt-10 mb-6">
          <TouchableOpacity
            onPress={() => setShowPin(true)}
            className={`h-14 rounded-xl items-center justify-center ${amount ? "bg-blue-600" : "bg-gray-300"
              }`}
          >
            <Text className="text-white font-semibold text-lg">Continue</Text>
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

/* ---------------- INPUT ---------------- */
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

/* ---------------- SELECT ---------------- */
function Select({ label, value, options, onSelect }: any) {
  const [open, setOpen] = useState(false);

  const selected = options.find((opt: any) => opt.id === value);

  return (
    <View>
      <Text className="text-gray-700 mb-1 mt-2">{label}</Text>

      {/* SELECT BOX */}
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        className="flex-row justify-between items-center bg-white h-14 px-4 rounded-xl border border-gray-200"
      >
        <View className="flex-row items-center gap-x-2">
          <Ionicons
            name={
              selected?.id === "add_new"
                ? "add-circle-outline"
                : "business-outline"
            }
            size={18}
            color={selected?.id === "add_new" ? "#2563EB" : "#6B7280"}
          />

          <Text className="text-gray-800">
            {selected?.account_name || "Select payment account"}
          </Text>
        </View>

        <Ionicons name="chevron-down-outline" size={20} color="#9CA3AF" />
      </TouchableOpacity>

      {/* DROPDOWN */}
      {open && (
        <View className="w-full bg-white rounded-xl border border-gray-200 z-50 shadow-lg ">
          {options.map((opt: any, index: number) => {
            const isAddNew = opt.id === "add_new";

            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  onSelect(opt.id);
                  setOpen(false);
                }}
                className={`flex-row items-center px-4 py-4 ${index !== options.length - 1
                  ? "border-1  border-gray-500"
                  : ""
                  }`}
              >
                <Ionicons
                  name={isAddNew ? "add-circle-outline" : "business-outline"}
                  size={20}
                  color={isAddNew ? "#2563EB" : "#6B7280"}
                />

                <View className="ml-3">
                  <Text
                    className={`font-medium ${isAddNew ? "text-blue-600" : "text-gray-900"
                      }`}
                  >
                    {opt.account_name}
                  </Text>

                  {!isAddNew && opt.bank_name && (
                    <Text className="text-xs text-gray-500 mt-0.5">
                      {opt.bank_name}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}
