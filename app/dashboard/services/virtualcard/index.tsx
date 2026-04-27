import { useAuth } from "@/app/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";

import {
    ActivityIndicator,
    Dimensions,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const { width } = Dimensions.get("window");
const API_BASE = "https://asfast-app.com/api/api";

export default function VirtualCardScreen() {
  const { user, token } = useAuth();
  const router = useRouter();

  const mountedRef = useRef(true);

  const [loading, setLoading] = useState(false);
  const [checkingCard, setCheckingCard] = useState(true);
  const [hasCard, setHasCard] = useState<boolean | null>(null);

  const [history, setHistory] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");

  /* =============================
   SAFE FETCH HISTORY
   ============================= */
  const fetchHistory = async () => {
    if (!user || !token) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${API_BASE}/user/cards.php?action=history`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const text = await res.text();
      console.log("Raw History Response:", text); // Debug log
      const json = JSON.parse(text);

      if (!mountedRef.current) return;

      if (!json.status) throw new Error(json.message);

      setHistory(json.data || []);
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: err.message,
      });
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  /* =============================
   CHECK CARD STATUS
   ============================= */
  useEffect(() => {
    mountedRef.current = true;

    const checkCards = async () => {
      if (!user || !token) return;

      try {
        const res = await fetch(
          `${API_BASE}/user/cards.php?action=fetchcards`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();

        if (!mountedRef.current) return;

        setHasCard(
          Boolean(data.status && data.data && data.data.length > 0)
        );
      } catch {
        if (mountedRef.current) setHasCard(false);
      } finally {
        if (mountedRef.current) setCheckingCard(false);
      }
    };

    checkCards();

    return () => {
      mountedRef.current = false;
    };
  }, [user, token]);

  /* =============================
   FETCH HISTORY AFTER CARD EXISTS
   ============================= */
  useEffect(() => {
    if (hasCard === true) {
      fetchHistory();
    }
  }, [hasCard]);

  /* =============================
   FILTERING
   ============================= */
  const brandOptions = useMemo(() => {
    const brands = history
      .map((o) => o.typeofhistory)
      .filter(Boolean);

    return ["all", ...Array.from(new Set(brands))];
  }, [history]);

  const filteredOrders = useMemo(() => {
    const q = search.toLowerCase();

    return history.filter((item) => {
      const matchesSearch =
        String(item.card_id || "").toLowerCase().includes(q) ||
        String(item.typeofhistory || "").toLowerCase().includes(q) ||
        String(item.amount_in_dollar || "").toLowerCase().includes(q);

      const matchesBrand =
        selectedBrand === "all" ||
        item.typeofhistory === selectedBrand;

      return matchesSearch && matchesBrand;
    });
  }, [history, search, selectedBrand]);

  /* =============================
   LOADING SCREEN
   ============================= */
  if (checkingCard) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-[#F9FAFB]">
        <ActivityIndicator size="large" color="#0A145A" />
      </SafeAreaView>
    );
  }


  const truncateId = (id: string) => {
    if (!id) return "";
    return id.length > 11 ? id.slice(0, 11) + "..." : id;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";

    try {
      return new Date(dateString).toLocaleString("en-NG", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

   /* ======================
     CREATE CARDHOLDER
  ====================== */
  const createCardHolder = async () => {
    if (!user || user.kyc_level < 1 || !user.kyc_details) {
      Toast.show({
        type: "error",
        text1: "KYC Required",
        text2: "Please complete your KYC first",
      });
      return;
    }

    setLoading(true);

    try {
      const kyc = user.kyc_details;

      const payload = {
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
        phone: kyc.phone,
        address: {
          address:
            kyc.house_number +
            "" +
            kyc.city +
            "" +
            kyc.state +
            "" +
            kyc.country,
          city: kyc.city,
          state: kyc.state,
          country: kyc.country || "NG",
          postal_code: kyc.postal_code,
          house_no: kyc.house_number,
        },
        identity: {
          bvn: kyc.bvn,
          selfie_image: kyc.passport,
        },
        meta_data: { platform: "Monitor SpirtApp" },
      };

      console.log("Creating cardholder with payload:", payload);

      console.log("----------------------------");
      console.log("----------------------------");
      console.log("----------------------------");

      const res = await fetch(
        `${API_BASE}/user/cards.php?action=create_cardholder`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const text = await res.text();

      const data = JSON.parse(text);

      console.log("DTT:", data);

      console.log("D:", data?.data);

      const cardholderId = data?.data?.data?.cardholder_id;


      if (!data.status && !cardholderId) {
        if (data.data) {
          const result = JSON.parse(data.data);
          throw new Error(result.message || "Cardholder creation faileds");
        }
        throw new Error(data.message || "Cardholder creation failed");
      }

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Cardholder created successfully",
      });

      router.push(
        `/dashboard/services/virtualcard/card-info?cardholder_id=${cardholderId}`,
      );
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: err.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  /* =============================
   UI
   ============================= */

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <ScrollView>

        <View className="px-5 pt-2">
          <TouchableOpacity
            onPress={() => router.push("/(tabs)")}
            className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm"
          >
            <Ionicons name="chevron-back" size={22} />
          </TouchableOpacity>

          <Text className="text-2xl mt-4 font-bold">
            Virtual Dollar Card
          </Text>
          <Text className="text-gray-500 mt-1">
            Spend globally with your Monitor Spirt card
          </Text>
        </View>

        <View className="px-5 mt-10">

          {hasCard === false && (
            <TouchableOpacity onPress={createCardHolder} className="h-14 bg-blue-600 rounded-xl items-center justify-center">
              <Text className="text-white text-lg font-semibold">
                Create Virtual Card
              </Text>
            </TouchableOpacity>
          )}

          {hasCard === true && (
            <TouchableOpacity
              onPress={() =>
                router.push("/dashboard/services/virtualcard/view")
              }
              className="h-14 bg-blue-600 rounded-xl mt-3 items-center justify-center"
            >
              <Text className="text-white text-lg font-semibold">
                View My Cards
              </Text>
            </TouchableOpacity>
          )}

          {/* LIST */}
          {!loading && history.length > 0 && (
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
                <Text className="text-gray-700 mb-2">Virtual Card Method</Text>

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
                            ? "All"
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

                        {/* LEFT SIDE */}
                        <View>
                          <Text className="font-semibold text-gray-900">
                            {item.typeofhistory.toUpperCase()}
                          </Text>

                          <Text className="text-gray-500 text-xs mt-1">
                            Card Id: {truncateId(item.card_id)}
                          </Text>
                        </View>

                        {/* RIGHT SIDE */}
                        <View className="items-end">

                          {
                            (item.typeofhistory === "fund" ||
                              item.typeofhistory === "withdraw") && (
                              <Text
                                className="font-bold"
                                style={{
                                  color:
                                    item.typeofhistory === "fund"
                                      ? "green"
                                      : item.typeofhistory === "withdraw"
                                        ? "red"
                                        : "#111827",
                                }}
                              >
                                {item.typeofhistory === "fund"
                                  ? "+"
                                  : item.typeofhistory === "withdraw"
                                    ? "-"
                                    : ""}

                                ₦{item.amount_in_naira}

                                {" "}

                                {item.amount_in_dollar && (
                                  <Text className="text-gray-500">
                                    (${item.amount_in_dollar})
                                  </Text>
                                )}
                              </Text>
                            )
                          }


                          {/* Date */}
                          <Text className="text-xs mt-1 text-gray-500">
                            {formatDate(item.created_at)}
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