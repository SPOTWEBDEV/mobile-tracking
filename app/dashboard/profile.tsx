import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen() {
  const router = useRouter()
  const {user,token} = useAuth()

  console.log("User data in ProfileScreen:", user);


  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/account')} className="w-10 h-10 rounded-full bg-white items-center  justify-center shadow-sm ml-4 ">
          <Ionicons name="chevron-back" size={22} color="#111827" />
        </TouchableOpacity>
        {/* Header */}
        <View className="px-5 pt-6">
          <Text className="text-2xl font-bold text-gray-900">
            Profile
          </Text>
          <Text className="text-gray-500 mt-1">
            Manage your account & KYC details
          </Text>
        </View>

        {/* Profile Card */}
        <View className="mx-5 mt-6 bg-white rounded-2xl p-5 border border-gray-200">
          <View className="flex-row items-center mb-4">
            <View className="w-14 h-14 bg-blue-100 rounded-full items-center justify-center">
              <Ionicons name="person" size={28} color="#2563EB" />
            </View>
            <View className="ml-4">
              <Text className="text-lg font-semibold text-gray-900">
                {user?.firstName} {user?.lastName}
              </Text>
              <Text className="text-gray-500">{user?.email}</Text>
            </View>
          </View>

          <ProfileRow label="Phone Number" value='08108833188' />
          <ProfileRow label="Invite Code" value={user?.user_invite_code} />
          <ProfileRow
            label="KYC Status"
            value={user?.kyc_level == 2 ? 'Approved' : "Pending"}
            status
          />
        </View>

        {/* KYC Details */}
        <View className="mx-5 mt-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            KYC Details
          </Text>

          <View className="bg-white rounded-2xl p-5 border border-gray-200 space-y-4">
            <ProfileRow label="Country" value={user?.kyc_details?.country} />
            <ProfileRow label="State" value={user?.kyc_details?.state} />
            <ProfileRow label="City" value={user?.kyc_details?.city} />
            <ProfileRow label="House Number" value={user?.kyc_details?.house_number} />
            <ProfileRow label="Phone Number" value={user?.kyc_details?.phone} />
            <ProfileRow label="BVN Number" value={user?.kyc_details?.bvn} />


            {/* Documents */}
            <DocumentRow
              label="Passport Photograph"
              url={user?.kyc_details?.passport}
            />
          </View>
        </View>

        {/* Action */}
        <View className="px-5 mt-10 mb-6">
          <TouchableOpacity className="h-14 bg-blue-600 rounded-xl items-center justify-center">
            <Text className="text-white font-semibold text-lg">
              Update Profile
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ======================
   Reusable Components
====================== */

function ProfileRow({
  label,
  value,
  status,
}: {
  label: string;
  value: any;
  status?: boolean;
}) {
  return (
    <View className="flex-row justify-between items-center mb-3">
      <Text className="text-gray-500">{label}</Text>
      <Text
        className={`${status
            ? value === "Approved"
              ? "text-green-600"
              : "text-yellow-600"
            : "text-gray-900"
          } font-medium`}
      >
        {value}
      </Text>
    </View>
  );
}

function DocumentRow({
  label,
  url,
}: {
  label: string;
  url: any;
}) {
  return (
    <View className="flex-row justify-between items-center">
      <Text className="text-gray-700">{label}</Text>
      <TouchableOpacity
        onPress={() => {
          // TODO: open document in WebView or Linking.openURL(url)
          console.log("View document:", url);
        }}
        className="flex-row items-center"
      >
        <Ionicons name="eye-outline" size={18} color="#2563EB" />
        <Text className="ml-1 text-blue-600 font-medium">
          View
        </Text>
      </TouchableOpacity>
    </View>
  );
}
