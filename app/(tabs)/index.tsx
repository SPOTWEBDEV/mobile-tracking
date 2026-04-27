import { Ionicons } from "@expo/vector-icons";
import { router, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ImageSlider from "../../components/slide";
import { useAuth } from "../context/AuthContext";
const { width } = Dimensions.get("window");

export default function DashboardScreen() {
  const [hideBalance, setHideBalance] = useState(false);
  const [transfervisible, setTransferVisible] = useState(false);
  const [airtimevisible, setAirtimeVisible] = useState(false);
  const { user, token, refreshWallet } = useAuth();

  const balance = user?.bal;
  const usdollar = user?.bal_usd ? user.bal_usd : "0.00";



  useEffect(() => {
    refreshWallet();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-6 flex-row justify-between items-center">
          <View>
            <Text className="text-gray-500 text-sm">Welcome back</Text>
            <Text className="text-xl font-bold text-gray-900">
              {user?.firstName + " " + user?.lastName} 👋
            </Text>
          </View>

          <TouchableOpacity className="w-10 h-10 bg-white rounded-full items-center justify-center border border-gray-200">
            <Ionicons name="notifications-outline" size={20} />
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <View className="mx-5 mt-6 bg-blue-600 rounded-2xl p-5">
          <Text className="text-blue-100">Wallet Balance</Text>

          <View className="flex-row justify-between w-full items-center mt-2">
            <View>
              <Text className="text-white text-3xl font-bold mr-3">
                {hideBalance ? "••••••" : `₦${balance?.toLocaleString()}`}
              </Text>
              <Text className="text-white text-lg font-bold mr-3">
                {hideBalance ? "••••••" : `$${usdollar?.toLocaleString()}`}
              </Text>
            </View>

            <View>
              <Text className="text-white">
                {!hideBalance ? "Hidden Balance" : "Show Balance"}
              </Text>
              <TouchableOpacity onPress={() => setHideBalance(!hideBalance)}>
                <Ionicons
                  name={hideBalance ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="white"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Actions */}
          <View className="flex-row justify-between mt-6">
            <ActionButton
              icon="add-circle-outline"
              label="Deposit"
              link="/dashboard/deposit"
            />
            <ActionButton
              icon="send-outline"
              label="Transfer"
              action={() => setTransferVisible(true)}
            />
            <ActionButton
              icon="logo-bitcoin"
              label="Exchange"
              link="/(tabs)/wallets"
            />
          </View>
        </View>

        {/* Feature Grid */}
        <View className="px-5 mt-8">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Services
          </Text>

          <View className="flex-row flex-wrap justify-between">
            <Feature
              icon="phone-portrait-outline"
              label="Airtime"
              action={() => setAirtimeVisible(true)}
            />
            <Feature
              icon="gift-outline"
              label="Gift Card"
              link="/(tabs)/giftcard"
            />
            <Feature
              icon="card-outline"
              label="Virtual Card"
              link="/dashboard/services/virtualcard"
            />
            <Feature
              icon="logo-bitcoin"
              label="Crypto"
              link="/(tabs)/wallets"
            />
          </View>
        </View>

        {/* Recent Transactions */}
        <View className="px-5 mt-8 mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-semibold text-gray-900">
              Recent Transactions
            </Text>
            <TouchableOpacity>
              <Text className="text-blue-600 font-medium">View All</Text>
            </TouchableOpacity>
          </View>

          <Transacntion />

          <ImageSlider />
        </View>

        <Modal transparent animationType="slide" visible={transfervisible}>
          <View className="flex-1 justify-end bg-black/40">
            <View className="rounded-t-3xl bg-[#F9FAFB] px-6 pt-6 pb-10">
              <View className="px-5 mt-8">
                <View className="flex flex-row justify-between items-center">
                  <Text className="text-gray-900 font-semibold ">
                    Transfering To :
                  </Text>
                  <TouchableOpacity
                    onPress={() => setTransferVisible(false)}
                    className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm"
                  >
                    <Ionicons name="close-outline" size={24} color="#111827" />
                  </TouchableOpacity>
                </View>

                <View className="flex flex-row  gap-x-1 gap-y-3 mt-8">
                  <TouchableOpacity
                    onPress={() => {
                      setTransferVisible(false);
                      router.push("/dashboard/services/transfer");
                    }}
                    className="w-[50%] bg-white border border-gray-200 rounded-xl p-4 items-center"
                  >
                    <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mb-2">
                      <Ionicons
                        name="person-circle-outline"
                        size={22}
                        color="#2563EB"
                      />
                    </View>
                    <Text className="text-gray-900 font-medium text-sm text-center">
                      Transfer To Monitor Spirt User
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setTransferVisible(false);
                      router.push("/dashboard/services/transferbank");
                    }}
                    className="w-[50%] bg-white border border-gray-200 rounded-xl p-4 items-center"
                  >
                    <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mb-2">
                      <Ionicons
                        name="business-outline"
                        size={22}
                        color="#2563EB"
                      />
                    </View>
                    <Text className="text-gray-900 font-medium text-sm text-center">
                      Transfer To Bank Account
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        <Modal transparent animationType="slide" visible={airtimevisible}>
          <View className="flex-1 justify-end bg-black/40">
            <View className="rounded-t-3xl bg-[#F9FAFB] px-6 pt-6 pb-10">
              <View className="px-5 mt-8">
                <View className="flex flex-row justify-between items-center">
                  <Text className="text-gray-900 font-semibold ">
                    Buying Airtime For :
                  </Text>
                  <TouchableOpacity
                    onPress={() => setAirtimeVisible(false)}
                    className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm"
                  >
                    <Ionicons name="close-outline" size={24} color="#111827" />
                  </TouchableOpacity>
                </View>

                <View className="flex flex-row  gap-x-1 gap-y-3 mt-8">
                  <TouchableOpacity
                    onPress={() => {
                      setAirtimeVisible(false);
                      router.push("/dashboard/services/airtime");
                    }}
                    className="w-[50%] bg-white border border-gray-200 rounded-xl p-4 items-center"
                  >
                    <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mb-2">
                      <Ionicons
                        name="phone-portrait-outline"
                        size={22}
                        color="#2563EB"
                      />
                    </View>
                    <Text className="text-gray-900 font-medium text-sm text-center">
                      Purchasing Airtime
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setAirtimeVisible(false);
                      router.push("/dashboard/services/data");
                    }}
                    className="w-[50%] bg-white border border-gray-200 rounded-xl p-4 items-center"
                  >
                    <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mb-2">
                      <Ionicons
                        name="cellular-outline"
                        size={22}
                        color="#2563EB"
                      />
                    </View>
                    <Text className="text-gray-900 font-medium text-sm text-center">
                      Purchasing Data
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

/* =====================
   Reusable Components
===================== */

function ActionButton({ icon, label, link, action }: any) {
  const router = useRouter();

  const handleClick = (link: string, action?: () => void) => {
    if (action) {
      action();
    } else {
      router.push(link as any);
    }
  };

  return (
    <TouchableOpacity
      onPress={() => handleClick(link, action)}
      className="items-center"
    >
      <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
        <Ionicons name={icon} size={22} color="white" />
      </View>
      <Text className="text-white text-sm mt-2">{label}</Text>
    </TouchableOpacity>
  );
}

function Feature({ icon, label, link, action }: any) {
  const router = useRouter();

  const handleClick = (link: string, action?: () => void) => {
    if (action) {
      action();
    } else {
      router.push(link as any);
    }
  };
  return (
    <TouchableOpacity
      onPress={() => handleClick(link, action)}
      className="w-[48%] bg-white rounded-2xl p-5 mb-4 border border-gray-200"
    >
      <Ionicons name={icon} size={26} color="#2563EB" />
      <Text className="mt-3 font-medium text-gray-900">{label}</Text>
    </TouchableOpacity>
  );
}

const Transacntion = () => {
  const { user, token } = useAuth();
  type Transaction = {
    id: number;
    reference: string;
    amount: number;
    type: "deposit" | "withdrawal" | "airtime_data";
    which: string;
    status: string;
    created_at: string;
  };
  const router = useRouter();

  type TransactionScreenProps = {
    limit?: number; // optional, if not provided, fetch all
  };
  const API_BASE = "https://asfast-app.com/api/api";

  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<
    "all" | "deposit" | "withdrawal" | "airtime_data"
  >("all");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter((item) => {
    const matchesType = filterType === "all" ? true : item.type === filterType;

    console.log(item)

    const matchesSearch =
      item.reference.toLowerCase().includes(search.toLowerCase()) ||
      item.type.toLowerCase().includes(search.toLowerCase())
    // item.which.toLowerCase().includes(search.toLowerCase());

    return matchesType && matchesSearch;
  });

  const fetchTransactions = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/user/transactions-history.php?limit=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const text = await res.text();

      console.log(text);

      const data = JSON.parse(text);
      if (data.status) {
        setTransactions(data.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePress = (reference: string, type: string) => {
    router.push(`/dashboard/transactiondetails?ref=${reference}&type=${type}`);
  };

  return (
    <>
      {/* SEARCH */}
      <View className="mt-6">
        <Text className="text-gray-700 mb-1">Search</Text>
        <View className="flex-row items-center bg-white h-14 px-4 rounded-xl border border-gray-200">
          <Ionicons name="search-outline" size={18} color="#9CA3AF" />
          <TextInput
            placeholder="Search by reference, type or name"
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
            className="flex-1 ml-3 text-gray-900"
          />
        </View>
      </View>

      {/* FILTER */}
      <View className="mt-5 flex-row flex-wrap">
        {[
          { label: "All", value: "all" },
          { label: "Deposit", value: "deposit" },
          { label: "Withdrawal", value: "withdrawal" },
          { label: "Airtime", value: "airtime_data" },
        ].map((item) => {
          const active = filterType === item.value;
          return (
            <Pressable
              key={item.value}
              onPress={() => setFilterType(item.value as any)}
              className={`mr-2 mb-2 px-4 py-2 rounded-full border ${active
                  ? "bg-blue-600 border-blue-600"
                  : "bg-white border-gray-200"
                }`}
            >
              <Text
                className={`text-xs font-semibold ${active ? "text-white" : "text-gray-600"
                  }`}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* CONTENT */}
      <View className="mt-6">
        {loading && <ActivityIndicator color="#2563EB" />}

        {!loading && filteredTransactions.length === 0 && (
          <View className="items-center mt-16">
            <Ionicons name="receipt-outline" size={48} color="#9CA3AF" />
            <Text className="mt-3 text-sm text-gray-500">
              No transactions found
            </Text>
          </View>
        )}

        {!loading &&
          filteredTransactions.map((item) => {
            const isDeposit = item.type === "deposit";

            return (
              <Pressable
                key={item.reference}
                onPress={() => handlePress(item.reference, item.type)}
                className="mb-4 p-4 bg-white rounded-xl border border-gray-200"
              >
                <View className="flex-row items-center justify-between">
                  {/* LEFT */}
                  <View className="flex-row items-center">
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center mr-3"
                      style={{
                        backgroundColor: isDeposit
                          ? "rgba(16,185,129,0.15)"
                          : "rgba(248,113,113,0.15)",
                      }}
                    >
                      <Ionicons
                        name={isDeposit ? "arrow-down" : "arrow-up"}
                        size={18}
                        color={isDeposit ? "#10B981" : "#F87171"}
                      />
                    </View>

                    <View>
                      <Text className="font-semibold text-gray-900 capitalize">
                        {item.type === "airtime_data" ? item.which : item.type}
                      </Text>
                      <Text className="text-xs text-gray-500 mt-1">
                        {new Date(item.created_at).toLocaleString()}
                      </Text>
                    </View>
                  </View>

                  {/* RIGHT */}
                  <View className="items-end">
                    <Text
                      className="font-bold"
                      style={{
                        color: isDeposit ? "#10B981" : "#F87171",
                      }}
                    >
                      {isDeposit ? "+" : "-"}₦
                      {Number(item.amount).toLocaleString()}
                    </Text>
                    <Text className="text-xs text-gray-500 mt-1 capitalize">
                      {item.status}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
      </View>
    </>
  );
};
