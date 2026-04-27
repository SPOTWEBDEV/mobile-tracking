import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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

interface BankAccount {
  id: number;
  bank_name: string;
  account_number: string;
  account_name: string;
}

const NIGERIAN_BANKS = [
  { bank_name: "Access Bank", bank_code: "044" },
  { bank_name: "Citibank Nigeria", bank_code: "023" },
  { bank_name: "Ecobank Nigeria", bank_code: "050" },
  { bank_name: "Fidelity Bank", bank_code: "070" },
  { bank_name: "First Bank of Nigeria", bank_code: "011" },
  { bank_name: "First City Monument Bank (FCMB)", bank_code: "214" },
  { bank_name: "Guaranty Trust Bank (GTBank)", bank_code: "058" },
  { bank_name: "Heritage Bank", bank_code: "030" },
  { bank_name: "Jaiz Bank", bank_code: "301" },
  { bank_name: "Keystone Bank", bank_code: "082" },
  { bank_name: "Polaris Bank", bank_code: "076" },
  { bank_name: "Providus Bank", bank_code: "101" },
  { bank_name: "Stanbic IBTC Bank", bank_code: "221" },
  { bank_name: "Standard Chartered Bank", bank_code: "068" },
  { bank_name: "Sterling Bank", bank_code: "232" },
  { bank_name: "Suntrust Bank Nigeria", bank_code: "100" },
  { bank_name: "Titan Bank", bank_code: "102" },
  { bank_name: "Union Bank of Nigeria", bank_code: "032" },
  { bank_name: "UBA (United Bank for Africa)", bank_code: "033" },
  { bank_name: "Unity Bank", bank_code: "215" },
  { bank_name: "Wema Bank", bank_code: "035" },
  { bank_name: "Zenith Bank", bank_code: "057" }
];

export default function BankScreen() {
  const { token } = useAuth();
  const router = useRouter();

  const [banks, setBanks] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [bankName, setBankName] = useState("");
  const [showbankForm, setShowBankForm] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [bankList, setBankList] = useState<any[]>([]);
  const [selectedBank, setSelectedBank] = useState<any>(null);

  /* ================= FETCH BANK ================= */
  const fetchBank = async () => {
    console.log("fetching bank info");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/user/bank.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: "fetch" }),
      });

      const text = await res.text();
      console.log("Bank fetch response:", text);
      const data = JSON.parse(text);

      if (data.status && data.data) {
        setBanks(data.data); // array of banks
      }
    } catch {
      Toast.show({ type: "error", text1: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  const deleteBank = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/user/bank.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: "delete",
          bank_id: id,
        }),
      });

      const data = await res.json();

      if (!data.status) {
        Toast.show({
          type: "error",
          text1: "Delete Failed",
          text2: data.message,
        });
        return;
      }

      Toast.show({ type: "success", text1: "Bank Deleted" });

      // ✨ INSTANTLY REMOVE FROM UI WITHOUT REFRESH
      setBanks((prev) => prev.filter((bank) => bank.id !== id));
    } catch {
      Toast.show({ type: "error", text1: "Network error" });
    }
  };

  useEffect(() => {
    fetchBank();
  }, []);

  /* ================= SAVE BANK ================= */
  const saveBank = async () => {
    if (selectedBank?.bank_name === "" || accountNumber === "" || accountName === "") {
      Toast.show({
        type: "error",
        text1: "Bank Setup Failed",
        text2: "All fields are required is must",
      });
      return;
    }

    setLoading(true);

    console.log('payload',{
      bank_name: selectedBank?.bank_name,
      bank_code: selectedBank?.bank_code,
      account_number: accountNumber,
      account_name: accountName,
    })

    try {
      const res = await fetch(`${API_BASE}/user/bank.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: "add",
          bank_name: selectedBank?.bank_name,
          bank_code: selectedBank?.bank_code,
          account_number: accountNumber,
          account_name: accountName,
        }),
      });

      const text = await res.text();
      console.log("Bank save response:", text);
      const data = JSON.parse(text);

      if (!data.status) {
        Toast.show({
          type: "error",
          text1: "Bank Setup Failed",
          text2: data.message,
        });
        return;
      }

      Toast.show({
        type: "success",
        text1: "Bank Added Successfully",
      });

      setShowBankForm(!showbankForm);
      fetchBank(); // refresh bank list
      setBankName("");
      setAccountNumber("");
      setAccountName("");
    } catch (error) {
      console.log("Bank save error:", error);
      Toast.show({ type: "error", text1: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F9FAFB]">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <ScrollView>
        <View className="px-5 pt-2 mt-4 flex flex-row justify-between items-center relative">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm"
          >
            <Ionicons name="chevron-back" size={22} color="#111827" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowBankForm(!showbankForm)}
            className=" bg-blue-600 w-10 h-10 rounded-full items-center justify-center shadow-xl"
          >
            {showbankForm ? (
              <Ionicons name="eye-outline" size={24} color="white" />
            ) : (
              <Ionicons name="add" size={30} color="white" />
            )}
          </TouchableOpacity>
        </View>

        {/* HEADER — SAME AS KYC */}
        <View className="px-5 pt-2">
          <Text className="text-2xl mt-4 font-bold text-gray-900">
            Bank Information
          </Text>
          <Text className="text-gray-500 mt-1">
            This bank account will be used for withdrawals / transfer
          </Text>
        </View>

        {/* CONTENT */}
        <View className="px-5 gap-3 mt-6 space-y-5">
          {!showbankForm && (
            <View>
              {banks.length > 0 &&
                banks.map((item, index) => (
                  <View
                    key={index}
                    className="bg-white rounded-xl border border-gray-200 p-5 mb-3 flex-row justify-between"
                  >
                    <View className="flex-1">
                      <Info label="Bank Name" value={item.bank_name} />
                      <Info
                        label="Account Number"
                        value={item.account_number}
                      />
                      <Info label="Account Name" value={item.account_name} />
                    </View>

                    <TouchableOpacity onPress={() => deleteBank(item.id)}>
                      <Ionicons
                        name="trash-outline"
                        size={24}
                        color="#EF4444"
                      />
                    </TouchableOpacity>
                  </View>
                ))}
            </View>
          )}

          {/* ADD BANK FORM */}
          {showbankForm && (
            <>
              <Select
                label="Select Bank"
                value={selectedBank?.bank_code || ""}
                options={NIGERIAN_BANKS.map(b => ({
                  id: b.bank_code,
                  name: b.bank_name
                }))}
                onSelect={(code: string) => {
                  const bank = NIGERIAN_BANKS.find(b => b.bank_code === code);
                  setSelectedBank(bank);
                }}
              />

              <Input
                label="Account Number"
                icon="card-outline"
                value={accountNumber}
                setValue={setAccountNumber}
                keyboard="number-pad"
              />

              <Input
                label="Account Name"
                icon="person-outline"
                value={accountName}
                setValue={setAccountName}
              />

              <TouchableOpacity
                onPress={saveBank}
                disabled={loading}
                className="h-14 bg-blue-600 rounded-xl items-center justify-center mt-6"
              >
                <Text className="text-white font-semibold text-lg">
                  Save Bank
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= INFO ROW (KYC STYLE) ================= */
function Info({ label, value }: any) {
  return (
    <View className="mb-4">
      <Text className="text-gray-700 mb-1">{label}</Text>
      <Text className="text-gray-900 font-semibold">{value}</Text>
    </View>
  );
}

/* ================= INPUT (SAME AS KYC) ================= */
function Input({ label, icon, value, setValue, keyboard }: any) {
  return (
    <View>
      <Text className="text-gray-700 mb-1">{label}</Text>
      <View className="flex-row items-center bg-white h-14 px-4 rounded-xl border border-gray-200">
        <Ionicons name={icon} size={18} color="#9CA3AF" />
        <TextInput
          value={value}
          onChangeText={setValue}
          keyboardType={keyboard}
          className="flex-1 ml-3"
          placeholder={label}
        />
      </View>
    </View>
  );
}


function Select({ label, value, options, onSelect }: any) {
  const [open, setOpen] = useState(false);

  const selected = options.find((opt: any) => opt.id === value);

  return (
    <View>
      <Text className="text-gray-700 mb-1">{label}</Text>

      <TouchableOpacity
        onPress={() => setOpen(!open)}
        className="flex-row justify-between items-center bg-white h-14 px-4 rounded-xl border border-gray-200"
      >
        <Text className="text-gray-800">
          {selected?.name || "Select Bank"}
        </Text>

        <Ionicons name="chevron-down-outline" size={20} color="#9CA3AF" />
      </TouchableOpacity>

      {open && (
        <View className="w-full bg-white rounded-xl border border-gray-200 z-50 shadow-lg max-h-fit">
          {options.map((opt: any, index: number) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                onSelect(opt.id);
                setOpen(false);
              }}
              className="px-4 py-4 border-b border-gray-100 flex-row items-center justify-between"
            >
              <Text className="text-gray-800">{opt.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}