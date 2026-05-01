import * as Device from "expo-device";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const DEVICE_ID_KEY = "myapp_device_id";

export const getDeviceInfo = async () => {
  let deviceId = await SecureStore.getItemAsync(DEVICE_ID_KEY);

  if (!deviceId) {
    deviceId = `${Platform.OS}-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 10)}`;

    await SecureStore.setItemAsync(DEVICE_ID_KEY, deviceId);
  }

  const deviceName =
    Device.deviceName || `${Device.brand} ${Device.modelName}`;

  return {
    device_id: deviceId,
    device_name: deviceName,
  };
};