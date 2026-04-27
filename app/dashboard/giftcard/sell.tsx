import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "@/app/context/AuthContext";
import Toast from "react-native-toast-message";

/* -----------------------------
   CONFIG
------------------------------ */
const API_BASE = "https://asfast-app.com/api/api/user";

type GiftCardBrand = {
  label: string;
  value: string;
};

const BRANDS: GiftCardBrand[] = [
  { label: "Amazon", value: "amazon" },
  { label: "Apple iTunes", value: "itunes" },
  { label: "Steam", value: "steam" },
  { label: "Google Play", value: "google_play" },
];

export default function SellGiftCardScreen() {
  const router = useRouter();
  const { token } = useAuth();

  const [cardType, setCardType] = useState<GiftCardBrand | null>(null);
  const [amount, setAmount] = useState("");
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [loading, setLoading] = useState(false);

  /* -----------------------------
     PICK IMAGE
  ------------------------------ */
  const pickImage = async () => {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
     
      Toast.show({
        type: "error",
        text1: "Permission required, Allow gallery access ",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0]);
    }
  };

  /* -----------------------------
     SUBMIT
  ------------------------------ */
  /* -----------------------------
   SUBMIT
------------------------------ */
  const submitSell = async () => {
    if (!cardType || !amount || !image) {
      Toast.show({
        type: "error",
        text1: "All fields are required",
      });
      return;
    }

    if (!token) {
      Toast.show({
        type: "error",
        text1: "Authentication required",
      });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("action", "sell");
      formData.append("card_type", cardType.value);
      formData.append("amount_usd", amount);

      formData.append("card_image", {
        uri: image.uri,
        name: "giftcard.jpg",
        type: "image/jpeg",
      } as any);

      const res = await fetch(`${API_BASE}/giftcard.php`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const text = await res.text();
      console.log(text);
      const json = JSON.parse(text);

      if (!json.status) {
        throw new Error(json.message || "Submission failed");
      }

      Toast.show({
        type: "success",
        text1: "Gift card submitted successfully",
      });
      router.push('/(tabs)/giftcard');
    } catch (e: unknown) {
      Toast.show({
        type: "error",
        text1: e instanceof Error ? e.message : "Network error",
      });
    } finally {
      setLoading(false);
    }
  };


  /* -----------------------------
     UI
  ------------------------------ */
  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <ScrollView>
        {/* HEADER */}
        <View className="px-5 pt-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 items-center justify-center"
          >
            <Ionicons name="chevron-back" size={22} color="#111827" />
          </TouchableOpacity>

          <Text className="text-2xl font-bold text-gray-900 mt-4">
            Sell Gift Card
          </Text>
          <Text className="text-gray-500 mt-1">
            Exchange your gift card for cash
          </Text>
        </View>

        {/* FORM */}
        <View className="px-5 mt-6">
          <View className="bg-white border border-gray-200 rounded-2xl p-5">

            {/* CARD TYPE */}
            <Text className="text-gray-700 font-medium mb-2">
              Gift Card Type
            </Text>

            <Select
              value={cardType?.label || "Select gift card"}
              options={BRANDS}
              onSelect={setCardType}
            />

            {/* AMOUNT */}
            <View className="mt-6">
              <Text className="text-gray-700 font-medium mb-2">
                Card Value (USD)
              </Text>
              <View className="flex-row items-center h-14 border border-gray-200 rounded-xl px-4">
                <Text className="text-gray-500 mr-2">$</Text>
                <TextInput
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  placeholder="Enter amount"
                  className="flex-1 text-gray-900"
                />
              </View>
            </View>

            {/* IMAGE */}
            <View className="mt-6">
              <Text className="text-gray-700 font-medium mb-2">
                Upload Gift Card
              </Text>

              <TouchableOpacity
                onPress={pickImage}
                className="h-28 border border-dashed border-gray-300 rounded-xl items-center justify-center overflow-hidden"
              >
                {image ? (
                  <Image
                    source={{ uri: image.uri }}
                    className="w-full h-full"
                  />
                ) : (
                  <>
                    <Ionicons
                      name="cloud-upload-outline"
                      size={28}
                      color="#9CA3AF"
                    />
                    <Text className="text-gray-500 mt-2 text-sm">
                      Tap to upload card image
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

          </View>
        </View>

        {/* SUBMIT */}
        <View className="px-5 mt-10 mb-10">
          <TouchableOpacity
            disabled={loading}
            onPress={submitSell}
            className="h-14 bg-[#0A145A] rounded-xl items-center justify-center"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-lg">
                Sell Gift Card
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* -----------------------------
   SELECT COMPONENT
------------------------------ */
function Select({
  value,
  options,
  onSelect,
}: {
  value: string;
  options: GiftCardBrand[];
  onSelect: (item: GiftCardBrand) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <View>
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        className="flex-row justify-between items-center bg-white h-14 px-4 rounded-xl border border-gray-200"
      >
        <Text className="text-gray-700">{value}</Text>
        <Ionicons name="chevron-down-outline" size={20} color="#9CA3AF" />
      </TouchableOpacity>

      {open && (
        <View className="absolute top-16 left-0 w-full bg-white rounded-xl border border-gray-200 z-50 shadow-md">
          {options.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              onPress={() => {
                onSelect(opt);
                setOpen(false);
              }}
              className="px-4 py-3"
            >
              <Text className="text-gray-800">{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
