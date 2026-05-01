import { useFonts } from "expo-font";
import { Slot, Stack } from "expo-router";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { toastConfig } from "../components/toastConfig";
import "../global.css";
import { ThemeProvider } from '../hooks/ThemeContext';


export default function Layout() {
  const [loaded] = useFonts({
    PoppinsLight: require("../assets/fonts/Poppins-Light.ttf"),
    PoppinsMedium: require("../assets/fonts/Poppins-Medium.ttf"),
    PoppinsSemiBold: require("../assets/fonts/Poppins-SemiBold.ttf"),
    PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
  });

  if (!loaded) return <View />;

  return (
    <>

      <ThemeProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Slot />
          </Stack>

          <Toast
            config={toastConfig}
            position="top"
            topOffset={60}
          />
      </ThemeProvider>

    </>
  );
}
