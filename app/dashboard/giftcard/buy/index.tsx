import { useAuth } from "@/app/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const API_BASE = "https://asfast-app.com/api/api/user";

export default function GiftCardScreen() {
  const { token } = useAuth();
  const router = useRouter();

  const [giftCards, setGiftCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [cardDetails, setCardDetails] = useState<any>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // -----------------------------
  // Fetch all gift cards
  // -----------------------------
  const fetchGiftcard = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/giftcard.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: "catalog" }),
      });

      const text = await res.text()
     

      const data = JSON.parse(text);

       console.log(data)

      if (!data.status) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: data.message || "Failed to load gift cards",
        });
        return;
      }

      setGiftCards(data.data);
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Network Error",
        text2: err instanceof Error ? err.message : "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchGiftcard();
  }, [token]);

  

 

  const filteredCards = giftCards.filter((card: any) =>
    card.brand_code?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      {/* HEADER */}
      <View className="px-5 pt-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm"
        >
          <Ionicons name="chevron-back" size={22} color="#111827" />
        </TouchableOpacity>
        <Text className="text-2xl mt-5 font-bold text-gray-900">
          Trade Gift Cards
        </Text>
        <Text className="text-gray-500 mt-1">
          Select a gift card to start trading
        </Text>
      </View>

      {/* SEARCH */}
      <View className="px-5 mt-6">
        <Text className="text-gray-700 mb-1">Search Gift Card</Text>
        <View className="flex-row items-center bg-white h-14 px-4 rounded-xl border border-gray-200">
          <Ionicons name="search-outline" size={18} color="#9CA3AF" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search for a card"
            className="flex-1 ml-3"
          />
        </View>
      </View>

      {/* TABS */}
      <View className="px-5 mt-6 flex-row gap-3">
        {["ALL", "RECENT PURCHASED BY ME"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`px-5 py-3 rounded-xl border ${
              activeTab === tab
                ? "bg-blue-600 border-blue-600"
                : "bg-white border-gray-200"
            }`}
          >
            <Text
              className={`font-semibold ${
                activeTab === tab ? "text-white" : "text-gray-700"
              }`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* CONTENT */}
      {loading ? (
        <Text className="text-center text-gray-500 mt-6">
          Loading gift cards...
        </Text>
      ) : filteredCards.length === 0 ? (
        <View className="items-center mt-10">
          <Ionicons name="gift-outline" size={64} color="#CBD5E1" />
          <Text className="text-gray-700 font-semibold mt-4">
            No Gift Cards Found
          </Text>
          <Text className="text-gray-500 text-center mt-1">
            Gift cards will appear here once available
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredCards}
          keyExtractor={(item: any) => item.brand_code}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20 }}
          showsVerticalScrollIndicator={false}
          initialNumToRender={6}
          maxToRenderPerBatch={6}
          windowSize={7}
          removeClippedSubviews
          renderItem={({ item }) => (
            <TouchableOpacity
              className="w-[48%] bg-white mb-4 rounded-xl border border-gray-200 p-4"
              onPress={() => router.push({ pathname: "/dashboard/giftcard/buy/details", params: { brand_code: item.brand_code } })}
              
            >
              <View className="h-40 mb-3 items-center justify-center">
                {item.image_url ? (
                  <Image
                    source={{ uri: item.image_url }}
                    resizeMode="contain"
                    style={{ width: "100%", height: "100%" }}
                  />
                ) : (
                  <Ionicons name="card-outline" size={40} color="#9CA3AF" />
                )}
              </View>
              <Text className="text-gray-900 font-semibold text-center">
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      
    </SafeAreaView>
  );
}
