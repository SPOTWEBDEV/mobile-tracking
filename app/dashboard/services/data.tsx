import { Ionicons } from "@expo/vector-icons";
import * as Contacts from "expo-contacts";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useAppTheme } from "../../../hooks/theme";
import { useAuth } from "../../context/AuthContext";

const NETWORK_META: Record<string, { id: string; label: string; logo: any; variation: string }> = {
  mtn: { id: "mtn", label: "MTN", logo: require("../../../assets/images/networks/mtn.png"), variation: "01" },
  glo: { id: "glo", label: "GLO", logo: require("../../../assets/images/networks/glo.png"), variation: "02" },
  airtel: { id: "airtel", label: "AIRTEL", logo: require("../../../assets/images/networks/airtel.png"), variation: "04" },
  "9mobile": { id: "9mobile", label: "9MOBILE", logo: require("../../../assets/images/networks/9mobile.png"), variation: "03" },
};

const API_BASE = "https://asfast-app.com/api/api";

export default function BuyDataScreen() {
  const { isDark, colors } = useAppTheme();
  const { user, token, setUser } = useAuth();
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [network, setNetwork] = useState<any>(null);
  const [networks, setNetworks] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [loadingBuy, setLoadingBuy] = useState(false);

  // ------------------ Contacts ------------------
  const openContactsModal = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== "granted") {
      Toast.show({ type: "error", text1: "Permission denied" });
      return;
    }

    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers],
    });

    if (data.length > 0) {
      setContacts(data);
      setModalVisible(true);
    } else {
      Toast.show({ type: "error", text1: "No contacts found" });
    }
  };

  // ------------------ Detect Network ------------------
  const detectNetwork = async (phone: string) => {
    let normalized = phone;
    if (phone.startsWith("+234")) normalized = phone.replace("+234", "0");
    setPhoneNumber(normalized);

    if (normalized.length >= 10) {
      setNetworks(Object.values(NETWORK_META));
    } else {
      setNetworks([]);
    }
  };

  // ------------------ Fetch Plans ------------------
  const fetchPlans = async (net: any) => {
    setLoadingPlans(true);
    setSelectedPlan(null);

    console.log('jjjj', net.variation)

    try {
      const res = await fetch(`${API_BASE}/user/data.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: "fetch_plans", variation: net.variation }),
      });
      const text = await res.text()
      console.log(text)
      const json = JSON.parse(text);
      if (json.status) setPlans(json.data);
      else Toast.show({ type: "error", text1: "Failed to fetch plans", text2: json.message });
    } catch (e) {
      console.log(e);
      Toast.show({ type: "error", text1: "Network error" });
    } finally {
      setLoadingPlans(false);
    }
  };

  // ------------------ Select Network ------------------
  const onSelectNetwork = (net: any) => {
    setNetwork(net);
    fetchPlans(net);
  };

  // ------------------ Buy Data ------------------
  const buyDataPlan = async () => {
    if (!selectedPlan || !phoneNumber) {
      Toast.show({ type: "error", text1: "Select plan & enter phone number" });
      return;
    }

    setLoadingBuy(true);
    const reference = "ASF_" + Math.floor(Math.random() * 1000000);

    console.log('selectedPlan.plan' , selectedPlan.plan)
    

    try {
      const res = await fetch(`${API_BASE}/user/data.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: "buy_data",
          network: network.id,
          epincode: selectedPlan.epincode,
          plan: selectedPlan.plan,
          phone: phoneNumber,
          price: selectedPlan.price_api,
        }),
      });

      const text = await res.text()
      console.log('buying' , text)
      const data = JSON.parse(text);

      if (data.status &&  user) {
        Toast.show({
          type: "success",
          text1: "Data purchased successfully",
          text2: `₦${selectedPlan.price_api} sent to ${phoneNumber}`,
        });
        setSelectedPlan(null);
        setPhoneNumber("");
        setPlans([]);
        setUser({ ...user, bal: data.data.new_balance });
        router.push('/dashboard/transactions')
      } else {
        Toast.show({ type: "error", text1: "Purchase failed", text2: data.message });
      }
    } catch (e) {
      console.log(e);
      Toast.show({ type: "error", text1: "Network error" });
    } finally {
      setLoadingBuy(false);
    }
  };

  return (
  <SafeAreaView className="flex-1 bg-[#F9FAFB]">
    <ScrollView showsVerticalScrollIndicator={false}>

      {/* HEADER */}
      <View className="flex-row items-center px-5 pt-6 mb-6">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>

        <Text className="ml-4 text-lg font-semibold text-gray-900">
          Buy Data
        </Text>
      </View>

      {/* PHONE INPUT */}
      <View className="mx-5 mb-6">
        <Text className="text-sm text-gray-500 mb-2">
          Phone Number
        </Text>

        <View className="flex-row items-center bg-white border border-gray-200 rounded-2xl px-4 h-14">
          <Text className="mr-2 text-gray-700">🇳🇬 +234</Text>

          <TextInput
            placeholder="8012345678"
            keyboardType="phone-pad"
            className="flex-1 text-gray-900"
            placeholderTextColor="#9CA3AF"
            value={phoneNumber}
            onChangeText={(text) => detectNetwork(text)}
          />

          <Ionicons
            name="person-circle-outline"
            size={28}
            color="#2563EB"
            onPress={openContactsModal}
          />
        </View>
      </View>

      {/* NETWORKS */}
      {networks.length > 0 && (
        <View className="px-5 mb-6">
          <Text className="text-sm text-gray-500 mb-3">
            Select Network
          </Text>

          <View className="flex-row flex-wrap justify-between">
            {networks.map((net) => {
              const active = network?.id === net.id;

              return (
                <TouchableOpacity
                  key={net.id}
                  onPress={() => onSelectNetwork(net)}
                  className={`w-[48%] mb-4 rounded-xl p-4 flex-row items-center border
                    ${active ? "bg-blue-600 border-blue-600" : "bg-white border-gray-200"}
                  `}
                >
                  <Image
                    source={NETWORK_META[net.id].logo}
                    style={{ width: 36, height: 36, marginRight: 10 }}
                    resizeMode="contain"
                  />

                  <Text
                    className={`font-semibold ${
                      active ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {net.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* PLANS */}
      <View className="px-5 mb-6">
        {loadingPlans ? (
          <ActivityIndicator />
        ) : (
          plans.length > 0 && (
            <>
              <Text className="text-sm text-gray-500 mb-3">
                Select Plan
              </Text>

              {plans.map((plan) => {
                const active = selectedPlan?.epincode === plan.epincode;

                return (
                  <TouchableOpacity
                    key={plan.epincode}
                    onPress={() => setSelectedPlan(plan)}
                    className={`mb-3 p-4 rounded-xl border
                      ${active ? "bg-blue-600 border-blue-600" : "bg-white border-gray-200"}
                    `}
                  >
                    <Text
                      className={`font-semibold ${
                        active ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {plan.plan}
                    </Text>

                    <Text
                      className={`text-sm mt-1 ${
                        active ? "text-blue-100" : "text-gray-500"
                      }`}
                    >
                      ₦{plan.price_api}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </>
          )
        )}
      </View>

      {/* BUY BUTTON */}
      <View className="px-5 mb-10">
        <TouchableOpacity
          onPress={buyDataPlan}
          disabled={loadingBuy}
          className="h-14 bg-blue-600 rounded-xl items-center justify-center"
        >
          {loadingBuy ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold text-base">
              Buy Data
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>

    {/* CONTACTS MODAL — unchanged */}
    <Modal visible={modalVisible} animationType="slide" transparent>
      <View className="flex-1 bg-black/50 justify-center">
        <View className="bg-white mx-5 rounded-2xl max-h-[70%] p-4">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Select Contact
          </Text>

          <FlatList
            data={contacts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const number = item.phoneNumbers?.[0]?.number ?? "";
              if (!number) return null;

              return (
                <TouchableOpacity
                  className="py-3 border-b border-gray-200"
                  onPress={() => {
                    setPhoneNumber(number);
                    detectNetwork(number);
                    setModalVisible(false);
                  }}
                >
                  <Text className="text-gray-900">
                    {item.name} — {number}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />

          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            className="mt-3 self-end"
          >
            <Text className="text-blue-600 font-semibold">
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  </SafeAreaView>
);

}
