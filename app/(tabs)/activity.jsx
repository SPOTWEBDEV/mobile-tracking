// app/(tabs)/activity.js
import { View, Text } from "react-native";

export default function Activity() {
  return (
    <View className="flex-1 bg-white px-5 pt-14">
      <Text className="text-xl font-bold">Activity</Text>

      <View className="mt-6 bg-gray-100 p-4 rounded-xl">
        <Text>No tracking history yet</Text>
      </View>
    </View>
  );
}