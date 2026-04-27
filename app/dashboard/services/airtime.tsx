import { Ionicons } from "@expo/vector-icons";
import * as Contacts from "expo-contacts";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useAuth } from "../../context/AuthContext";

const amounts = [
  { value: 50 },
  { value: 100 },
  { value: 200 },
  { value: 500 },
  { value: 1000 },
  { value: 2000 },
];

type Network = {
  id: string;
  name: string;
};

/* ---------------- NETWORK META ---------------- */
const NETWORK_META: Record<
  string,
  { id: string, label: string; logo: any }
> = {
  mtn: {
    id: 'mtn',
    label: "MTN",
    logo: require("../../../assets/images/networks/mtn.png"),
  },
  glo: {
    id: 'glo',
    label: "GLO",
    logo: require("../../../assets/images/networks/glo.png"),
  },
  airtel: {
    id: 'airtel',
    label: "AIRTEL",
    logo: require("../../../assets/images/networks/airtel.png"),
  },
  "9mobile": {
    id: '9mobile',
    label: "9MOBILE",
    logo: require("../../../assets/images/networks/9mobile.png"),
  },
};

const API_BASE = "https://asfast-app.com/api/api";

export default function AirtimeScreen() {
  
  const router = useRouter();
  const { token, user, setUser } = useAuth();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [contacts, setContacts] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [networks, setNetworks] = useState<Network[]>([]);
  const [network, setNetwork] = useState<Network | null>(null);


  // --------------------------
  // Fetch contacts and show modal
  // --------------------------
  const openContactsModal = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "Cannot access contacts");
      return;
    }

    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers],
    });

    if (data.length > 0) {
      setContacts(data);
      setModalVisible(true);
    } else {
      Alert.alert("No contacts found");
    }
  };

  const normalizeNetwork = (name: string) =>
    name.toLowerCase().replace(/\s+/g, "");

  const detectNetwork = async () => {
    console.log(phoneNumber);

    if (phoneNumber.length >= 10) {

      if (phoneNumber.startsWith('+234')) {
        setPhoneNumber(phoneNumber.replace('+234', '0'));
      }

      console.log('Networks', NETWORK_META);
      setNetworks(Object.values(NETWORK_META).map(net => ({ id: net.id, name: net.label })));


    } else {
      Toast.show({ type: "error", text1: "Invalid phone number" });
    }

  };

  // --------------------------
  // Airtime purchase
  // --------------------------
  const buyAirtime = async (amount: number) => {
    if (!phoneNumber) {
      Toast.show({ type: "error", text1: "Enter phone number" });
      return;
    }

    if (amount < 50 || amount > 500000) {
      Toast.show({
        type: "error",
        text1: "Amount must be between ₦50 and ₦500,000",
      });
      return;
    }

    if (!network) {
      Toast.show({ type: "error", text1: "Select a network" });
      return;
    }

    console.log("Buying airtime", { phoneNumber, amount, network });
    console.log(network.id);


    try {

      const res = await fetch(`${API_BASE}/user/airtime.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: "topup",
          phone: phoneNumber,
          amount: amount,
          network: network.id,
        }),
      });
      const text = await res.text();
      console.log("Airtime response:", text);
      const data = JSON.parse(text);
      console.log("Detect response:", data);

      if (data.status && user) {
        Toast.show({
          type: "success",
          text1: "Airtime purchased!",
          text2: `₦${amount.toLocaleString()} sent to ${phoneNumber}`,
        });
        setCustomAmount("");
        setUser({ ...user, bal: data.data.new_balance });
        router.push('/dashboard/transactions')
      } else {
        Toast.show({
          type: "error",
          text1: "Purchase failed",
          text2: data.message,
        });
      }
    } catch (e) {
      console.error("Airtime purchase error:", e);
      Toast.show({ type: "error", text1: "Network error" });
    }
  };

  return (
  <SafeAreaView className="flex-1 bg-[#F9FAFB]">
    <ScrollView showsVerticalScrollIndicator={false}>

      {/* HEADER */}
      <View className="flex-row items-center px-5 pt-6 mb-6">
        <Ionicons
          onPress={() => router.back()}
          name="arrow-back"
          size={22}
          color="#111827"
        />
        <Text className="ml-4 text-lg font-semibold text-gray-900">
          Airtime
        </Text>
      </View>

      {/* PHONE INPUT */}
      <View className="mx-5 bg-white rounded-2xl p-4 border border-gray-200 mb-5">
        <Text className="text-sm text-gray-500 mb-2">
          Phone Number
        </Text>

        <View className="flex-row items-center">
          <Text className="mr-2 text-gray-700">🇳🇬 +234</Text>

          <TextInput
            placeholder="8012345678"
            keyboardType="phone-pad"
            className="flex-1 text-gray-900 text-base"
            placeholderTextColor="#9CA3AF"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            onBlur={detectNetwork}
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
              const meta = NETWORK_META[net.id];
              const active = network?.id === net.id;

              return (
                <TouchableOpacity
                  key={net.id}
                  onPress={() => setNetwork(net)}
                  className={`w-[48%] mb-4 rounded-xl p-4 flex-row items-center border
                    ${active ? "bg-blue-600 border-blue-600" : "bg-white border-gray-200"}
                  `}
                >
                  <Image
                    source={meta.logo}
                    style={{ width: 36, height: 36, marginRight: 10 }}
                  />
                  <Text
                    className={`font-semibold ${
                      active ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {meta.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* AMOUNTS */}
      <View className="px-5 mb-6">
        <Text className="text-sm text-gray-500 mb-3">
          Select Amount
        </Text>

        <View className="flex-row flex-wrap justify-between">
          {amounts.map((item) => (
            <TouchableOpacity
              key={item.value}
              onPress={() => setCustomAmount(item.value as any)}
              className="w-[48%] bg-white border border-gray-200 rounded-xl p-4 mb-4"
            >
              <Text className="text-gray-900 font-semibold text-lg">
                ₦{item.value.toLocaleString()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* CUSTOM AMOUNT */}
      <View className="mx-5 bg-white border border-gray-200 rounded-2xl p-4 mb-10">
        <Text className="text-sm text-gray-500 mb-2">
          Custom Amount
        </Text>

        <View className="flex-row items-center">
          <Text className="text-gray-900 mr-2">₦</Text>

          <TextInput
            placeholder="50 - 500,000"
            keyboardType="numeric"
            className="flex-1 text-gray-900 text-base"
            placeholderTextColor="#9CA3AF"
            value={customAmount ? String(customAmount) : ""}
            onChangeText={setCustomAmount}
          />
        </View>

        <TouchableOpacity
          onPress={() => buyAirtime(Number(customAmount))}
          className="mt-5 bg-blue-600 rounded-xl py-4 items-center"
        >
          <Text className="text-white font-semibold text-base">
            Pay Airtime
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>

    {/* CONTACTS MODAL — unchanged logic */}
    {/* keep your existing modal code */}
  </SafeAreaView>
);

}
