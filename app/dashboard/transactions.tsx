import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  TextInput
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../../hooks/theme";
import { useAuth } from "../context/AuthContext";


type Transaction = {
  id: number;
  reference: string;
  amount: number;
  type: "deposit" | "withdrawal" | "airtime_data";
  which: string;
  status: string;
  created_at: string;
};

type TransactionScreenProps = {
  limit?: number; // optional, if not provided, fetch all
};

export default function TransactionScreen({ limit }: TransactionScreenProps) {
  const { colors } = useAppTheme();
  const { token } = useAuth();
  const router = useRouter();

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
    const matchesType =
      filterType === "all" ? true : item.type === filterType;

    const matchesSearch =
      item.reference.toLowerCase().includes(search.toLowerCase()) ||
      item.type.toLowerCase().includes(search.toLowerCase()) ||
      item.which.toLowerCase().includes(search.toLowerCase());

    return matchesType && matchesSearch;
  });


  const fetchTransactions = async () => {
    try {
      const res = await fetch(`${API_BASE}/user/transactions-history.php`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const text = await res.text()

      console.log(text)

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
    router.push(`/dashboard/transactiondetails?ref=${reference}&type=${type}`)
  };

 return (
  <SafeAreaView className="flex-1 bg-[#F9FAFB]">
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* HEADER */}
      <View className="px-5 pt-6 flex-row items-center">
        <TouchableOpacity onPress={() => router.push("/(tabs)/services")}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      {/* TITLE */}
      <View className="px-5 pt-4">
        <Text className="text-2xl font-bold text-gray-900">
          Transactions
        </Text>
        <Text className="text-gray-500 mt-1">
          View your recent activities
        </Text>
      </View>

      {/* SEARCH */}
      <View className="px-5 mt-6">
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
      <View className="px-5 mt-5 flex-row flex-wrap">
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
              className={`mr-2 mb-2 px-4 py-2 rounded-full border ${
                active
                  ? "bg-blue-600 border-blue-600"
                  : "bg-white border-gray-200"
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  active ? "text-white" : "text-gray-600"
                }`}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* CONTENT */}
      <View className="px-5 mt-6">
        {loading && (
          <ActivityIndicator color="#2563EB" />
        )}

        {!loading && filteredTransactions.length === 0 && (
          <View className="items-center mt-16">
            <Ionicons
              name="receipt-outline"
              size={48}
              color="#9CA3AF"
            />
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
                onPress={() =>
                  handlePress(item.reference, item.type)
                }
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
                        {item.type === "airtime_data"
                          ? item.which
                          : item.type}
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
    </ScrollView>
  </SafeAreaView>
);



}


