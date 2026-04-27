import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

function ServiceItem({
  icon,
  title,
  subtitle,
  link,
}: {
  icon: any;
  title: string;
  subtitle: string;
  link?: string;
}) {
  const router = useRouter();

  const handlePress = () => {
    if (link) {
      router.push(link as any);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={!link}
      style={{ marginBottom: 20 }}
    >
      <View className="flex-row items-center">
        <View
          className="w-12 h-12 rounded-full items-center justify-center mr-4"
        >
          <Ionicons name={icon} size={22}  />
        </View>

        <View className="flex-1">
          <Text >
            {title}
          </Text>
          <Text >
            {subtitle}
          </Text>
        </View>

        {link && (
          <Ionicons
            name="chevron-forward"
            size={18}
          />
        )}
      </View>
    </Pressable>
  );
}

export default ServiceItem;
