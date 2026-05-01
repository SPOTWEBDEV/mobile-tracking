import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";
import { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const API_BASE = "https://spotwebtech.com.ng/monitor-spirit/api";

export default function Devices() {
  const [code, setCode] = useState("");
  const [myCode, setMyCode] = useState("");
  const [devices, setDevices] = useState([]);
  const [deviceId, setDeviceId] = useState("");

  // 🔥 INIT
  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const token = await AsyncStorage.getItem("token");
    const userData = await AsyncStorage.getItem("user");

    if (!userData) return;

    const user = JSON.parse(userData);

    console.log("USER DATA:", user);

    console.log("DEVICE INFO:", user.device);

    // 🔥 FIX: ensure correct field exists
    const {device_id} = user.device;

    if (!device_id) {
      console.log("❌ device_id missing in user object");
      return;
    }

    console.log("✅ Device ID:", device_id);

    setDeviceId(device_id);

    // 🔥 FIX: use device_id directly (NOT state)
    const res = await fetch(`${API_BASE}/generate-code.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ device_id }), // ✅ FIXED
    });

    const data = await res.json();

    console.log("CODE RESPONSE:", data);

    if (data.status) {
      setMyCode(data.code);
    }

    fetchDevices();
  };

  // 📥 load devices
  const fetchDevices = async () => {
    const token = await AsyncStorage.getItem("token");

    const res = await fetch(`${API_BASE}/list.php`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (data.status) setDevices(data.devices);
  };

  // 📋 copy
  const copyCode = async () => {
    await Clipboard.setStringAsync(myCode);
    Toast.show({ type: "success", text1: "Copied" });
  };

  // 🔗 connect
  const handleConnect = async () => {
    if (!code) {
      Toast.show({ type: "error", text1: "Enter Code" });
      return;
    }

    const token = await AsyncStorage.getItem("token");

    const res = await fetch(`${API_BASE}/link.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ code }),
    });

    const text = await res.text();
    console.log("LINK RESPONSE:", text);
    const data = JSON.parse(text);

    if (!data.status) {
      Toast.show({ type: "error", text1: data.message });
      return;
    }

    Toast.show({ type: "success", text1: "Device Linked 🎉" });

    setCode("");
    fetchDevices();
  };

  return (
    <View className="flex-1 bg-white px-5 pt-14">

      <Text className="text-xl font-bold">Devices</Text>

      {/* CODE */}
      <View className="mt-6 bg-[#1A4DBE] p-5 rounded-2xl">
        <Text className="text-white">Your Link Code</Text>

        <View className="flex-row justify-between mt-2">
          <Text className="text-white text-2xl font-bold">{myCode}</Text>

          <TouchableOpacity onPress={copyCode}>
             <Ionicons name="copy" size={24} color="white" />            
          </TouchableOpacity>
        </View>
      </View>

      {/* INPUT */}
      <TextInput
        placeholder="Enter code"
        value={code}
        onChangeText={setCode}
        className="mt-6 border p-4 rounded-xl"
      />

      <TouchableOpacity
        onPress={handleConnect}
        className="mt-4 bg-[#1A4DBE] py-4 rounded-xl"
      >
        <Text className="text-white text-center">Connect</Text>
      </TouchableOpacity>

      {/* LIST */}
      <FlatList
        data={devices}
        keyExtractor={(item, i) => i.toString()}
        renderItem={({ item }) => (
          <View className="mt-3 bg-gray-100 p-4 rounded-xl">
            <Text>{item.device_name}</Text>
            <Text className="text-gray-500">{item.device_id}</Text>
          </View>
        )}
      />
    </View>
  );
}