import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const DashboardQuickActions = () => {
    
    const router = useRouter()

    return (
        <View className="space-y-4 gap-2">
            {/* Row 1 */}
            <View className="flex-row gap-2 space-x-4">
                <ActionCard
                    title="Deposit"
                    icon="wallet"
                    bg={isDark ? "#102A43" : "#EAF6FF"}
                    iconColor="#3B82F6"
                    textColor={colors.text}
                    link="/dashboard/deposit"
                />
                <ActionCard
                    title="Withdraw"
                    icon="cash-outline"
                    bg={isDark ? "#3A1F1B" : "#FFE9DF"}
                    iconColor="#FB923C"
                    textColor={colors.text}
                    link="/dashboard/withdraw"
                />
            </View>

            {/* Row 2 */}
            <View className="flex-row gap-2 space-x-4">

                <ActionCard
                    title="Transfer"
                    icon="swap-horizontal"
                    bg={isDark ? "#1E1B4B" : "#F1EDFF"}
                    iconColor="#6366F1"
                    textColor={colors.text}
                    link="/dashboard/services/transfer"
                />
                

                <ActionCard
                    title="Gift Cards"
                    icon="bag"
                    bg={isDark ? "#0F2F2F" : "#E6F9F6"}
                    iconColor="#14B8A6"
                    textColor={colors.text}
                    link="/dashboard/services/giftcard"
                />
            </View>

            {/* Row 3 */}
            <View className="flex-row gap-2 space-x-4">
                <ActionCard
                    title="Airtime & Data"
                    icon="phone-portrait"
                    bg={isDark ? "#111827" : "#FFFFFF"}
                    iconColor="#22C55E"
                    textColor={colors.text}
                    bordered
                    link="/dashboard/services/airtime"
                />

                <ActionCard
                    title="Virtual Dollar Card"
                    icon="card"
                    bg={isDark ? "#3A1F1B" : "#FFE9DF"}
                    iconColor="#22C55E"
                    textColor={colors.text}
                    bordered
                    link="/dashboard/services/virtualcard"
                />
            </View>
            <View className="flex-row gap-2 space-x-4">
                <ActionCard
                    title="Crypto"
                    icon="phone-portrait"
                    bg={isDark ? "#111827" : "#FFFFFF"}
                    iconColor="#22C55E"
                    textColor={colors.text}
                    bordered
                    link="/(tabs)/trade"
                />   
            </View>

            

        </View>
    );
};


const ActionCard = ({
    title,
    icon,
    bg,
    iconColor,
    textColor,
    bordered = false,
    link,
}: any) => {
    const router = useRouter();

    return (
        <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => link && router.push(link)}
            style={{
                backgroundColor: bg,
                borderWidth: bordered ? 1 : 0,
                borderColor: "#E5E7EB",
            }}
            className="flex-1 rounded-2xl p-5 h-[120px] justify-between"
        >
            <View className="w-9 h-9 rounded-full items-center justify-center bg-black/5">
                <Ionicons name={icon} size={20} color={iconColor} />
            </View>

            <Text className="text-base font-semibold" style={{ color: textColor }}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};



export default DashboardQuickActions;
