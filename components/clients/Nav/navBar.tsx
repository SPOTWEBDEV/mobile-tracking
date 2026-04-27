import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../../app/context/AuthContext';
import { useAppTheme } from '../../../hooks/theme';

const NavBar = ({ profile }: any) => {
  const { colors } = useAppTheme(); // get the theme colors
  const [hidden, setHidden] = useState(false);
  const { user } = useAuth();

  const bal = user?.bal || 0;
  const usd = 600 / 460; // Example conversion rate

  let precentage = 0;

  if (user?.haspin != null) precentage += 30;
  if (Number(user?.kyc_level) >= 3) precentage += 40;
  if (user?.has_bank_account === 1) precentage += 30;


  console.log("Profile in NavBar:", precentage);



  return (
    <View style={{ backgroundColor: colors.background, padding: 5 }}>
      {/* Top Bar */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <Image
          style={{ width: 32, height: 32 }}
          resizeMode="contain"
          source={require('../../../assets/images/avatar.png')}
        />

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.card,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 9999,
          }}
        >
          <Text style={{ marginRight: 8 }}>🇳🇬</Text>
          <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 14, color: colors.text }}>
            Nigerian Naira
          </Text>
          <Ionicons name="chevron-down" size={16} color={colors.icon} />
        </TouchableOpacity>

        <Ionicons name="notifications-outline" size={22} color={colors.icon} />
      </View>

      {/* Account Setup Card */}
      {profile && precentage < 100 &&  (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
            padding: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.iconBg,
            backgroundColor: colors.card,
          }}
        >
          <Text style={{ fontFamily: 'Poppins-Medium', color: colors.text }}>
            Complete Account Setup
          </Text>

          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 9999,
              borderWidth: 4,
              borderColor: colors.iconBg,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 10, fontFamily: 'Poppins-Medium', color: colors.text }}>
              {precentage}%
            </Text>
          </View>
        </View>
      )}

      {/* Balance */}
      <View style={{ alignItems: "center", marginBottom: 32 }}>
        {/* Main Balance */}
        <Text style={{ fontSize: 32, fontFamily: "Poppins-Bold", color: colors.primary }}>
          {hidden ? "****" : `₦${bal}.00`}
        </Text>

        {/* Toggle Button */}
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}
          onPress={() => setHidden(!hidden)}
        >
          <Ionicons
            name={hidden ? "eye-outline" : "eye-off-outline"}
            size={16}
            color={colors.subText}
          />
          <Text style={{ marginLeft: 8, fontSize: 14, color: colors.subText }}>
            {hidden ? "Show Balance" : "Hide Balance"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};



export default NavBar;
