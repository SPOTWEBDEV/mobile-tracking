import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useAuth } from "../../context/AuthContext";

const API_BASE = "https://asfast-app.com/api/api";

const NIGERIA_STATES = [
  { state: "Abia", postal: "440001" },
  { state: "Adamawa", postal: "640001" },
  { state: "Akwa Ibom", postal: "520001" },
  { state: "Anambra", postal: "420001" },
  { state: "Bauchi", postal: "740001" },
  { state: "Bayelsa", postal: "561001" },
  { state: "Benue", postal: "970001" },
  { state: "Borno", postal: "600001" },
  { state: "Cross River", postal: "540001" },
  { state: "Delta", postal: "320001" },
  { state: "Ebonyi", postal: "840001" },
  { state: "Edo", postal: "300001" },
  { state: "Ekiti", postal: "360001" },
  { state: "Enugu", postal: "400001" },
  { state: "Gombe", postal: "760001" },
  { state: "Imo", postal: "460001" },
  { state: "Jigawa", postal: "720001" },
  { state: "Kaduna", postal: "800001" },
  { state: "Kano", postal: "700001" },
  { state: "Katsina", postal: "820001" },
  { state: "Kebbi", postal: "860001" },
  { state: "Kogi", postal: "260001" },
  { state: "Kwara", postal: "240001" },
  { state: "Lagos", postal: "100001" },
  { state: "Nasarawa", postal: "962001" },
  { state: "Niger", postal: "920001" },
  { state: "Ogun", postal: "110001" },
  { state: "Ondo", postal: "340001" },
  { state: "Osun", postal: "230001" },
  { state: "Oyo", postal: "200001" },
  { state: "Plateau", postal: "930001" },
  { state: "Rivers", postal: "500001" },
  { state: "Sokoto", postal: "840001" },
  { state: "Taraba", postal: "660001" },
  { state: "Yobe", postal: "320001" },
  { state: "Zamfara", postal: "860001" },
];

// edit

const fileToBlob = async (file: any) => {
  const response = await fetch(file.uri);
  const blob = await response.blob();
  return blob;
};

export default function KycScreen() {
  const [country, setCountry] = useState("Nigeria");
  const [address, setAddress] = useState("");
  const [nin, setNin] = useState("");
  const { user, token, login } = useAuth();
  const router = useRouter();

  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [phone, setPhone] = useState("");
  const [bvnNumber, setBvnNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const kyc_level = user?.kyc_level; // 0 : not yet applied  , 1: pending, 2: verified  || approved , 3: rejected

  const [passport, setPassport] = useState<any>(null);
  const [ninDoc, setNinDoc] = useState<any>(null);
  const [addressDoc, setAddressDoc] = useState<any>(null);

  const pickFile = async (setter: any) => {
    const res = await DocumentPicker.getDocumentAsync({
      type: ["image/*", "application/pdf"],
    });

    if (!res.canceled) setter(res.assets[0]);
  };

  const submitKyc = async () => {
    if (
      !phone.trim() ||
      !city.trim() ||
      !stateName.trim() ||
      !postalCode.trim() ||
      !houseNo.trim() ||
      !bvnNumber.trim()
    ) {
      Toast.show({
        type: "error",
        text1: "KYC Verification Failed",
        text2: "All fields are required",
      });
      return;
    }





    if (!/^\d{11}$/.test(bvnNumber)) {
      Toast.show({
        type: "error",
        text1: "Invalid BVN",
        text2: "BVN must be exactly 11 digits",
      });
      return;
    }

    if (!/^\+[1-9]\d{6,14}$/.test(phone)) {
      Toast.show({
        type: "error",
        text1: "Invalid Phone Number",
        text2: "Phone must be in E.164 format e.g +2347060507480",
      });
      return;
    }

    setLoading(true); // start loader

    try {
      const form = new FormData();
      form.append("country", country);
      form.append("nin", nin);
      form.append("phone", phone);
      form.append("city", city);
      form.append("state", stateName);
      form.append("postal_code", postalCode);
      form.append("house_number", houseNo);
      form.append("bvn", bvnNumber);

      form.append("passport", {
        uri: passport.uri,
        name: passport.name,
        type: passport.mimeType || "image/jpeg",
      } as any);

      const res = await fetch(`${API_BASE}/user/kyc.php`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      const text = await res.text();
      const data = JSON.parse(text);

      if (!data.status) {
        Toast.show({
          type: "error",
          text1: "KYC Verification Failed",
          text2: data.message,
        });
        setLoading(false);
        return;
      }

      Toast.show({
        type: "success",
        text1: "KYC Verification",
        text2: "KYC submitted successfully",
      });

      await login(token, data.data.user);

      setTimeout(() => router.push("/(tabs)/account"), 500);
    } catch {
      Toast.show({
        type: "error",
        text1: "KYC Verification Failed",
        text2: "Network error",
      });
    }

    setLoading(false); // end loader
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView keyboardShouldPersistTaps="handled">

            <View>
              {
                (
                  kyc_level === 1 || kyc_level === 2
                ) ? (
                  <KycStatusCard />
                ) : (<>
                  <View>
                    <View className="px-5 pt-2">
                      <TouchableOpacity
                        onPress={() => router.push("/(tabs)/account")}
                        className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm"
                      >
                        <Ionicons name="chevron-back" size={22} color="#111827" />
                      </TouchableOpacity>
                      <Text className="text-2xl mt-4 font-bold text-gray-900">
                        KYC Verification
                      </Text>
                      <Text className="text-gray-500 mt-1">
                        Verify your identity to continue
                      </Text>
                    </View>

                    <View className="px-5 mt-6 gap-4 space-y-5">
                      <Select
                        label="Country"
                        value={country}
                        options={["Nigeria", "Ghana", "Other Countries"]}
                        onSelect={(val: string) => {
                          setCountry(val);
                          setStateName("");
                          setPostalCode("");
                        }}
                      />

                      {country === "Nigeria" ? (
                        <>
                          <Select
                            label="State"
                            value={stateName}
                            options={NIGERIA_STATES.map((s) => s.state)}
                            onSelect={(selected: string) => {
                              setStateName(selected);
                              const found = NIGERIA_STATES.find(
                                (s) => s.state === selected,
                              );
                              if (found) setPostalCode(found.postal);
                            }}
                          />

                          <Input
                            label="Postal Code"
                            icon="mail-outline"
                            value={postalCode}
                            setValue={() => { }}
                            keyboard="number-pad"
                            editable={false}
                          />
                        </>
                      ) : (
                        <>
                          <Input
                            label="State"
                            icon="location-outline"
                            value={stateName}
                            setValue={setStateName}
                          />

                          <Input
                            label="Postal Code"
                            icon="mail-outline"
                            value={postalCode}
                            setValue={setPostalCode}
                            keyboard="number-pad"
                          />
                        </>
                      )}

                      {/* <Textarea label="Address" value={address} setValue={setAddress} /> */}
                      <Input
                        label="City"
                        icon="business-outline"
                        value={city}
                        setValue={setCity}
                      />

                      <Input
                        label="House Number"
                        icon="home-outline"
                        value={houseNo}
                        setValue={setHouseNo}
                        keyboard="number-pad"
                      />
                      <Input
                        label="Phone Number (Use international format e.g +2348012345678)"
                        icon="call-outline"
                        value={phone}
                        setValue={setPhone}
                        keyboard="phone-pad"
                      />
                      <Input
                        label="BVN Number"
                        icon="card-outline"
                        value={bvnNumber}
                        setValue={setBvnNumber}
                        keyboard="number-pad"
                      />
                      {/* <Input
              label="NIN Number"
              icon="card-outline"
              value={nin}
              setValue={setNin}
              keyboard="number-pad"
            /> */}

                      <Upload
                        label="Passport (A clear picture of you)"
                        file={passport}
                        onPick={() => pickFile(setPassport)}
                      />
                      {/* <Upload label="NIN Document" file={ninDoc} onPick={() => pickFile(setNinDoc)} /> */}
                      {/* <Upload label="Address Document" file={addressDoc} onPick={() => pickFile(setAddressDoc)} /> */}
                    </View>

                    <View className="px-5 mt-10 mb-6">
                      <TouchableOpacity
                        onPress={submitKyc}
                        disabled={loading}
                        className={`h-14 rounded-xl items-center justify-center ${loading ? "bg-blue-300" : "bg-blue-600"
                          }`}
                      >
                        <Text className="text-white font-semibold text-lg">
                          {loading ? "Submitting..." : "Submit KYC"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>)
              }
            </View>


          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ---------- Reusable Components ---------- */

function Input({ label, icon, value, setValue, keyboard }: any) {
  return (
    <View>
      <Text className="text-gray-700 mb-1">{label}</Text>
      <View className="flex-row items-center bg-white h-14 px-4 rounded-xl border border-gray-200">
        <Ionicons name={icon} size={18} color="#9CA3AF" />
        <TextInput
          value={value}
          onChangeText={(text) => setValue(text)}
          keyboardType={keyboard}
          className="flex-1 ml-3"
          placeholder={label}
        />
      </View>
    </View>
  );
}

function Textarea({ label, value, setValue }: any) {
  return (
    <View>
      <Text className="text-gray-700 mb-1">{label}</Text>
      <View className="bg-white rounded-xl border border-gray-200 px-4">
        <TextInput
          multiline
          value={value}
          onChangeText={setValue}
          className="h-24"
        />
      </View>
    </View>
  );
}

function Upload({ label, file, onPick }: any) {
  return (
    <View>
      <Text className="text-gray-700 mb-1">{label}</Text>
      <TouchableOpacity
        onPress={onPick}
        className="flex-row justify-between items-center bg-white h-14 px-4 rounded-xl border border-gray-200"
      >
        <Text className="text-gray-500">
          {file ? file.name : "Upload document"}
        </Text>
        <Ionicons name="cloud-upload-outline" size={18} color="#9CA3AF" />
      </TouchableOpacity>
    </View>
  );
}

function Select({ label, value, options, onSelect }: any) {
  const [open, setOpen] = useState(false);

  return (
    <View>
      <Text className="text-gray-700 mb-1">{label}</Text>

      <TouchableOpacity
        onPress={() => setOpen(true)}
        className="flex-row justify-between items-center bg-white h-14 px-4 rounded-xl border border-gray-200"
      >
        <Text className="text-gray-700">{value}</Text>
        <Ionicons name="chevron-down-outline" size={20} color="#9CA3AF" />
      </TouchableOpacity>

      {open && (
        <View className="absolute top-16 left-0 w-full bg-white rounded-xl border border-gray-200 z-50 p-3 shadow-md">
          {options.map((opt: string, index: number) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                onSelect(opt);
                setOpen(false);
              }}
              className="py-3"
            >
              <Text className="text-gray-800">{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}


const KycStatusCard = () => {
  const { user, token, login } = useAuth();
  const kyc_level = user?.kyc_level; // 0 : not yet applied  , 1: pending, 2: verified  || approved , 3: rejected  
  let title = "";
  let message = "";
  let bgColor = "";
  let icon = "time-outline";
  const router = useRouter();

  if (kyc_level === 1) {
    title = "KYC Under Review";
    message =
      "You have already submitted your KYC. Our team is reviewing your documents. Please wait for approval.";
    bgColor = "bg-yellow-50 border-yellow-400";
    icon = "time-outline";
  }

  if (kyc_level === 2) {
    title = "KYC Approved";
    message =
      "Congratulations 🎉 Your identity has been verified successfully.";
    bgColor = "bg-green-50 border-green-500";
    icon = "checkmark-circle-outline";
  }

  if (kyc_level === 3) {
    title = "KYC Rejected";
    message =
      "Your previous submission was rejected. Please resubmit with correct documents.";
    bgColor = "bg-red-50 border-red-500";
    icon = "close-circle-outline";
  }

  return (
    <>
      <View className="px-5 pt-2">
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/account")}
          className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm"
        >
          <Ionicons name="chevron-back" size={22} color="#111827" />
        </TouchableOpacity>
        <Text className="text-2xl mt-4 font-bold text-gray-900">
          KYC Verification Status
        </Text>

      </View>
      <View className={`mx-5 mt-8 p-5 rounded-2xl border ${bgColor}`}>
        <View className="flex-row items-center">
          <Ionicons name={icon as any} size={26} color="#111827" />
          <Text className="ml-3 text-lg font-bold text-gray-900">
            {title}
          </Text>
        </View>

        <Text className="text-gray-600 mt-3 leading-6">
          {message}
        </Text>

        {kyc_level === 1 && (
          <View className="mt-4 bg-yellow-100 px-4 py-2 rounded-xl">
            <Text className="text-yellow-800 text-sm">
              Estimated review time: 24 - 48 hours
            </Text>
          </View>
        )}
      </View></>
  );
};