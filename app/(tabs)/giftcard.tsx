import { useAuth } from "@/app/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

/* -----------------------------
   CONFIG
------------------------------ */
const API_BASE = "https://asfast-app.com/api/api/user";

export default function WalletScreen() {
  const router = useRouter();
  const { token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>("all");

  /* -----------------------------
     FETCH GIFT CARD HISTORY
  ------------------------------ */
  const fetchHistory = async () => {
    
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/giftcard.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: "history",
          limit: 50,
        }),
      });

      const text = await res.text()

      console.log(text)

      const json = JSON.parse(text);

      if (!json.status) {
        throw new Error(json.message || "Failed to fetch history");
      }

      setOrders(json.data.orders || []);
    } catch (err: unknown) {
      console.log(err)
      Toast.show({
        type: "error",
        text1: "Error",
        text2: err instanceof Error ? err.message : "Network error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [token]);

  /* -----------------------------
     UNIQUE BRAND CATEGORIES
  ------------------------------ */
  const brandOptions = useMemo(() => {
    const brands = orders
      .map((o) => o.brand_code)
      .filter(Boolean);

    return ["all", ...Array.from(new Set(brands))];
  }, [orders]);

  /* -----------------------------
     FILTER LOGIC
  ------------------------------ */
  const filteredOrders = useMemo(() => {
    const q = search.toLowerCase();

    return orders.filter((item) => {
      const matchesSearch =
        item.order_ref?.toLowerCase().includes(q) ||
        item.brand_code?.toLowerCase().includes(q) ||
        item.status?.toLowerCase().includes(q);

      const matchesBrand =
        selectedBrand === "all" || item.brand_code === selectedBrand;

      return matchesSearch && matchesBrand;
    });
  }, [orders, search, selectedBrand]);

  /* -----------------------------
     UI
  ------------------------------ */
  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <ScrollView>
        {/* HEADER */}
        <View className="px-5 pt-4 gap-3">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 items-center justify-center"
          >
            <Ionicons name="chevron-back" size={22} color="#111827" />
          </TouchableOpacity>

          <View>
            <Text className="text-2xl mt-3 font-bold text-gray-900">
              Gift Card
            </Text>
            <Text className="text-gray-500 mt-1">
              Manage gift card assets
            </Text>
          </View>
        </View>

        {/* QUICK ACTIONS */}
        <View className="px-5 mt-8">
          <Text className="text-gray-900 font-semibold mb-4">
            Quick Actions
          </Text>

          <View className="flex-row justify-between mt-3">
            <TouchableOpacity
              className="w-[48%] bg-white border border-gray-200 rounded-xl p-4 items-center"
              onPress={() => router.push("/dashboard/giftcard/buy")}
            >
              <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mb-2">
                <Ionicons name="gift-outline" size={22} color="#2563EB" />
              </View>
              <Text className="text-gray-900 font-medium text-sm">Buy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/dashboard/giftcard/sell")}
              className="w-[48%] bg-white border border-gray-200 rounded-xl p-4 items-center"
            >
              <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mb-2">
                <Ionicons
                  name="swap-horizontal-outline"
                  size={22}
                  color="#2563EB"
                />
              </View>
              <Text className="text-gray-900 font-medium text-sm">Sell</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* TRANSACTIONS */}
        <View className="px-5 mt-10">
          <Text className="text-gray-900 font-semibold mb-4">
            Recent Transactions
          </Text>

          {/* LOADING */}
          {loading && (
            <View className="mt-10 items-center">
              <ActivityIndicator size="small" color="#2563EB" />
            </View>
          )}

          {/* EMPTY */}
          {!loading && orders.length === 0 && (
            <View className="items-center mt-10">
              <Ionicons name="receipt-outline" size={64} color="#CBD5E1" />
              <Text className="text-gray-500 mt-4 text-center">
                No transactions yet for Gift Card
              </Text>
            </View>
          )}

          {/* LIST */}
          {!loading && orders.length > 0 && (
            <>
              {/* SEARCH */}
              <View className="mt-6">
                <Text className="text-gray-700 mb-1">Search</Text>
                <View className="flex-row items-center bg-white h-14 px-4 rounded-xl border border-gray-200">
                  <Ionicons name="search-outline" size={18} color="#9CA3AF" />
                  <TextInput
                    placeholder="Search by reference, brand or status"
                    placeholderTextColor="#9CA3AF"
                    value={search}
                    onChangeText={setSearch}
                    className="flex-1 ml-3 text-gray-900"
                  />
                </View>
              </View>

              {/* BRAND FILTER */}
              <View className="mt-5">
                <Text className="text-gray-700 mb-2">Gift Card Brand</Text>

                <View className="flex-row flex-wrap">
                  {brandOptions.map((brand) => {
                    const active = selectedBrand === brand;

                    return (
                      <Pressable
                        key={brand}
                        onPress={() => setSelectedBrand(brand)}
                        className={`mr-2 mb-2 px-4 py-2 rounded-full border ${active
                            ? "bg-blue-600 border-blue-600"
                            : "bg-white border-gray-200"
                          }`}
                      >
                        <Text
                          className={`text-xs font-semibold ${active ? "text-white" : "text-gray-600"
                            }`}
                        >
                          {brand === "all"
                            ? "All Brands"
                            : brand.toUpperCase()}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* ORDERS */}
              <View className="mt-8">
                {filteredOrders.length === 0 ? (
                  <View className="items-center mt-10">
                    <Ionicons
                      name="receipt-outline"
                      size={64}
                      color="#CBD5E1"
                    />
                    <Text className="text-gray-500 mt-4">
                      No matching transactions
                    </Text>
                  </View>
                ) : (
                  filteredOrders.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      className="bg-white border border-gray-200 rounded-xl p-4 mb-3"
                    >
                      <View className="flex-row justify-between items-center">
                        <View>
                          <Text className="font-semibold text-gray-900">
                            {item.brand_code.toUpperCase()}
                          </Text>
                          <Text className="text-gray-500 text-xs mt-1">
                            Ref: {item.order_ref}
                          </Text>
                        </View>

                        <View className="items-end">
                          <Text className="font-bold text-gray-900">
                            {item.type === "sell" ? "+" : "-"}
                            ${item.price_in_cents / 100}
                          </Text>
                          <Text
                            className={`text-xs mt-1 ${item.status === "success" ? "text-green-600" : "text-red-600"
                              }`}
                          >
                            {item.status}
                          </Text>
                        </View>

                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
