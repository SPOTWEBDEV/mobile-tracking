import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";


export default function WelcomeScreen() {
  const router = useRouter();
  

  return (
    <View className=" h-screen  flex flex-col gap-9  justify-end">

      {/* Center Content */}
      <View className="items-center justify-center px-8">

        {/* Logo */}
        <Image
          source={require("../assets/images/logo.png")}
          className="w-100 h-60 mb-6"
          resizeMode="contain"
        />
      </View>

      {/* Buttons */}
      <View className="px-6 pb-20 py-8">

        {/* Sign Up Button */}
        <TouchableOpacity
          onPress={() => router.push("/pricing")}
          className=" py-4 rounded-xl mb-4  border-2 border-blue-600"
        >
          <Text className="text-center text-black text-lg font-semibold">
            Sign Up
          </Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity
          onPress={() => router.push("/auth/login")}
          className="border bg-blue-600 border-white py-4 rounded-xl"
        >
          <Text className="text-center text-white text-lg font-semibold">
            Log in
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}
