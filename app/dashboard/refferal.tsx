import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    ScrollView,
    Share,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from '../../hooks/theme';
import { useAuth } from "../context/AuthContext";


export default function ReferralScreen() {
  const router = useRouter();
  const { colors, isDark } = useAppTheme();
  
  const { user } = useAuth();

  const handleShare = async () => {
    await Share.share({
      message: `Join Monitor Spirt and earn rewards! Use my referral code: ${user?.user_invite_code}`,
    });
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER (same style as Virtual Card) */}
        <View className="flex-row items-center px-6 pt-4 pb-6">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>

          <Text
            className="flex-1 text-center text-lg font-semibold"
            style={{ color: colors.text }}
          >
            Referral
          </Text>

          <View className="w-6" />
        </View>

        {/* MAIN CARD */}
        <View className="mx-6 rounded-3xl p-6 bg-gray-100 dark:bg-[#0F1724]">
          {/* ICON */}
          <View className="items-center mb-4">
            <View style={{backgroundColor: colors.background}} className="p-6 rounded-2xl  dark:bg-yellow-500/10">
              <Ionicons
                name="megaphone-outline"
                size={46}
                color="#FACC15"
              />
            </View>
          </View>

          {/* TITLE */}
          <Text
            className="text-xl font-semibold text-center mb-2"
            style={{ color: colors.text }}
          >
            Invite & Earn
          </Text>

          {/* DESCRIPTION */}
          <Text
            className="text-center text-sm leading-6 mb-4"
            style={{ color: colors.subText }}
          >
            Earn ₦8 whenever someone you invite completes a successful
            transaction on Monitor Spirt.
          </Text>

          {/* EXPIRY BADGE */}
          <View className="self-center mb-6 px-4 py-1 rounded-full bg-yellow-100 dark:bg-yellow-500/10">
            <Text className="text-xs text-yellow-500">
              ⏱ Expires in 5 months
            </Text>
          </View>

          {/* REFERRAL CODE */}
          <View className="flex-row items-center justify-between border border-dashed rounded-2xl p-4 border-gray-400 dark:border-gray-600">
            <View>
              <Text
                className="text-xs mb-1"
                style={{ color: colors.subText }}
              >
                Referral Code
              </Text>
              <Text
                className="text-lg font-semibold"
                style={{ color: colors.text }}
              >
                {user?.user_invite_code}
              </Text>
            </View>

            <TouchableOpacity>
              <Ionicons
                name="copy-outline"
                size={22}
                color="#FACC15"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* STATS SECTION */}
        <View className="mx-6 mt-6 rounded-3xl p-5 bg-gray-100 dark:bg-[#0F1724]">
          <TouchableOpacity className="flex-row items-center justify-between mb-4">
            <Text
              className="text-base font-semibold"
              style={{ color: colors.text }}
            >
              Track My Referrals
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.icon}
            />
          </TouchableOpacity>

          <View className="flex-row space-x-4">
            {/* EARNINGS */}
            <View className="flex-1 rounded-2xl p-4 bg-white dark:bg-[#1E293B]">
              <Text
                className="text-xs mb-1"
                style={{ color: colors.subText }}
              >
                Earnings
              </Text>
              <Text
                className="text-lg font-semibold"
                style={{ color: colors.text }}
              >
                ₦0.00
              </Text>
            </View>

            {/* TOTAL REFERRALS */}
            <View className="flex-1 rounded-2xl p-4 bg-white dark:bg-[#1E293B]">
              <Text
                className="text-xs mb-1"
                style={{ color: colors.subText }}
              >
                Total Referrals
              </Text>
              <Text
                className="text-lg font-semibold"
                style={{ color: colors.text }}
              >
                0
              </Text>
            </View>
          </View>
        </View>

        {/* SHARE BUTTON */}
        <TouchableOpacity
          onPress={handleShare}
          className="mx-6 my-10 rounded-3xl py-4 flex-row items-center justify-center bg-yellow-400"
        >
          <Text
            className="text-lg font-semibold mr-2"
            style={{ color: isDark ? "#000" : "#000" }}
          >
            Share Invite Link
          </Text>
          <Ionicons
            name="share-social-outline"
            size={22}
            color="#000"
          />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
