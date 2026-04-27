import React from "react";
import { ScrollView, Text, View } from "react-native";
import ServiceItem from "../../components/ServiceItem";

const Services = () => {
  return (
    <ScrollView
      className="flex-1 bg-[#F9FAFB] px-4 pt-14"
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      {/* TOP NAV */}
      <View className="pt-4">
        <Text className="text-2xl font-bold text-gray-900">Services</Text>
        <Text className="text-gray-500 mt-1">
          All the services under asfast
        </Text>
      </View>

      {/* PRIMARY SERVICES */}
      <View className="mb-6 mt-5">
        <Text className="text-gray-900 font-semibold mb-4">Wallet Actions</Text>

        <View className="bg-white border border-gray-200 rounded-2xl p-4">
          <ServiceItem
            icon="wallet-outline"
            title="Deposit"
            subtitle="Fund your wallet instantly"
            link="/dashboard/deposit"
          />
          <ServiceItem
            icon="send-outline"
            title="Transfer To Monitor Spirt User"
            subtitle="Send money to other users"
            link="/dashboard/services/transfer"
          />
          <ServiceItem
            icon="cash-outline"
            title="Withdraw"
            subtitle="Withdraw funds to  bank"
            link="/dashboard/services/transferbank"
          />
        </View>
      </View>

      {/* CORE SERVICES */}
      <View className="mb-6">
        <Text className="text-gray-900 font-semibold mb-4">Core Services</Text>

        <View className="bg-white border border-gray-200 rounded-2xl p-4">
          <ServiceItem
            icon="gift-outline"
            title="Gift Card"
            subtitle="Buy or redeem gift cards"
            link="/(tabs)/giftcard"
          />
          <ServiceItem
            icon="swap-horizontal-outline"
            title="Trade"
            subtitle="Buy and sell crypto assets"
            link="/(tabs)/trade"
          />
          <ServiceItem
            icon="card-outline"
            title="Virtual Card"
            subtitle="Generate secure virtual cards"
            link="/dashboard/services/virtualcard"
          />
        </View>
      </View>

      {/* UTILITIES */}
      <View className="mb-6">
        <Text className="text-gray-900 font-semibold mb-4">Utilities</Text>

        <View className="bg-white border border-gray-200 rounded-2xl p-4">
          <ServiceItem
            icon="phone-portrait-outline"
            title="Airtime Purchase"
            subtitle="Top-up your phone instantly"
            link="/dashboard/services/airtime"
          />
          <ServiceItem
            icon="cellular-outline"
            title="Data Purchase"
            subtitle="Buy mobile data easily"
            link="/dashboard/services/data"
          />
          <ServiceItem
            icon="trending-up-outline"
            title="Saving"
            subtitle="Save and grow your money"
            link="/dashboard/services/savings/"
          />
        </View>
      </View>

      {/* TRANSACTIONS & OTHERS */}
      <View className="mb-6">
        <Text className="text-gray-900 font-semibold mb-4">
          Records & Others
        </Text>

        <View className="bg-white border border-gray-200 rounded-2xl p-4">
          <ServiceItem
            icon="receipt-outline"
            title="Transaction History"
            subtitle="View all wallet transactions"
            link="/dashboard/transactions"
          />
          <ServiceItem
            icon="chatbubble-outline"
            title="E-Funds"
            subtitle="Trade unlisted assets via an agent"
          />
        </View>
      </View>

      {/* ACCOUNT */}
      <View className="mb-10">
        <Text className="text-gray-900 font-semibold mb-4">Account</Text>

        <View className="bg-white border border-gray-200 rounded-2xl p-4">
          <ServiceItem
            icon="settings-outline"
            title="Settings"
            subtitle="Manage your account preferences"
            link="/(tabs)/account"
          />
          <ServiceItem
            icon="log-out-outline"
            title="Logout"
            subtitle="Sign out of your account"
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default Services;
