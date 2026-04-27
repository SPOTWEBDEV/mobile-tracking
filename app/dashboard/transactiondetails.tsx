import { Ionicons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import { router, useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { captureRef } from "react-native-view-shot";
import { useAppTheme } from "../../hooks/theme";
import { useAuth } from "../context/AuthContext";

export default function TransactionDetailsScreen() {
  const { ref, type } = useLocalSearchParams();
  const { token, user } = useAuth();
  const { colors } = useAppTheme();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [successModal, setSuccessModal] = useState(false);

  const receiptRef = useRef<View>(null);



  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    console.log('testting', ref, type)
    try {
      const res = await fetch(
        "https://asfast-app.com/api/api/user/transaction-details.php",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ref: ref,
            type: type,
          }),
        }
      );


      const text = await res.text()
      console.log('=======')
      console.log(text)
      const json = JSON.parse(text);


      if (json.status) setData(json.data);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- SHARE JPG ---------------- */
  const handleShare = async () => {
    try {
      const uri = await captureRef(receiptRef, {
        format: "jpg",
        quality: 1,
      });

      await Sharing.shareAsync(uri);
    } catch (err) {
      console.log("Share error:", err);
    }
  };

  /* ---------------- DOWNLOAD JPG ---------------- */
  const handleDownload = async () => {
    try {
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (!permission.granted) return;

      const uri = await captureRef(receiptRef, {
        format: "jpg",
        quality: 1,
      });

      await MediaLibrary.saveToLibraryAsync(uri);
      setSuccessModal(true);
    } catch (err) {
      console.log("Download error:", err);
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 20 }}>
        {/* Header */}
        <View className="flex-row items-center mb-4">
          <Ionicons
            onPress={() => router.push("/dashboard/transactions")}
            name="chevron-back"
            size={24}
            color={colors.text}
          />
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              marginLeft: 10,
              color: colors.text,
            }}
          >
            Transaction Details
          </Text>
        </View>

        {data && (

          <View>
            {/* ========= RECEIPT (CAPTURE AREA) ========= */}
            < View className="px-4 py-4 " ref={receiptRef} collapsable={false}>
              {/* Amount Card */}
              <View
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 16,
                  padding: 20,
                }}
              >
                <Text
                  style={{
                    color:
                      data.transaction_type === "deposit"
                        ? "#22c55e"
                        : "#ef4444",
                    fontWeight: "600",
                  }}
                >
                  {data.transaction_type === "deposit" ? "Credited" : "Debited"}
                </Text>

                <Text
                  style={{
                    fontSize: 30,
                    fontWeight: "700",
                    marginTop: 8,
                    color:
                      data.transaction_type === "deposit"
                        ? "#22c55e"
                        : "#ef4444",
                  }}
                >
                  {data.transaction_type === "deposit" ? "+" : "-"} ₦
                  {Number(data.amount).toLocaleString()}
                </Text>

                <Text style={{ color: colors.subText, marginTop: 6 }}>
                  {data.created_at}
                </Text>

                <View
                  style={{
                    marginTop: 10,
                    alignSelf: "flex-start",
                    paddingHorizontal: 14,
                    paddingVertical: 4,
                    borderRadius: 999,
                    backgroundColor:
                      data.status === "pending"
                        ? "#facc15"
                        : data.status === "completed" ||
                          data.status === "credited" || data.status === "success"
                          ? "#22c55e"
                          : "#ef4444",
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 12 }}>
                    {data.status}
                  </Text>
                </View>
              </View>

              {/* Other Details */}
              <View style={{ marginTop: 24 }}>
                <Detail label="Reference" value={data.reference} />
                {/* <Detail label="Type" value={data.transaction_type} /> */}


                {type === "withdrawals" && (
                  <>
                    <Detail label="Bank" value={data.bank.bank_name} />
                    <Detail
                      label="Account Number"
                      value={`****${data.bank.account_number.slice(-4)}`}
                    />
                    <Detail label="Account Name" value={data.bank.account_name} />
                  </>
                )}
                {type === "transfers" && (
                  <>
                    <Detail label="Receiver Name" value={data.receiver_name} />
                    <Detail
                      label="Receiver Email"
                      value={`${data.receiver_email}`}
                    />
                  </>
                )}
                {type === "airtime_data" && (
                  <>
                    <Detail label="Transaction" value={data.type} />
                    <Detail label="Mobile Number" value={data.mobile_number} />
                    <Detail
                      label="Mobile Network"
                      value={`${data.network}`}
                    />
                    {data.type == 'data' && (

                      <Detail
                        label="Data Plan"
                        value={`${data.plan}`}
                      />

                    )}

                  </>
                )}
                <Detail label="Date" value={data.created_at} />
              </View>
            </View>
          </View>
        )}

        {/* ACTION BUTTONS (NOT CAPTURED) */}
        <View className="flex-row justify-between mt-6">
          <TouchableOpacity
            onPress={handleShare}
            className="w-[48%] bg-gray-100 py-4 rounded-xl items-center"
          >
            <Ionicons name="share-outline" size={22} />
            <Text className="mt-1">Share</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDownload}
            className="w-[48%] bg-gray-100 py-4 rounded-xl items-center"
          >
            <Ionicons name="download-outline" size={22} />
            <Text className="mt-1">Download</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* SUCCESS MODAL */}
      <Modal transparent animationType="fade" visible={successModal}>
        <View className="flex-1 bg-black/40 items-center justify-center">
          <View className="bg-white w-[80%] rounded-2xl p-6 items-center">
            <Ionicons
              name="checkmark-circle"
              size={64}
              color="#22c55e"
            />
            <Text className="mt-3 text-lg font-semibold">
              Download Successful
            </Text>

            <TouchableOpacity
              onPress={() => setSuccessModal(false)}
              className="mt-5 bg-green-500 px-6 py-3 rounded-full"
            >
              <Text className="text-white font-semibold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView >
  );
}

/* ---------------- DETAIL ROW ---------------- */
function Detail({ label, value }: { label: string; value: string }) {
  return (
    <View className="border-b border-gray-200 py-4">
      <Text className="text-gray-400 capitalize text-sm">{label}</Text>
      <Text className="mt-1 font-medium ">{value}</Text>
    </View>
  );
}
