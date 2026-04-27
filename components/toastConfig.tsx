import { BaseToast, ErrorToast } from "react-native-toast-message";

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#16A34A", // green
        backgroundColor: "#ECFDF5",
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "700",
        color: "#065F46",
      }}
      text2Style={{
        fontSize: 14,
        color: "#047857",
      }}
    />
  ),

  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: "#DC2626", // red
        backgroundColor: "#FEF2F2",
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: "700",
        color: "#7F1D1D",
      }}
      text2Style={{
        fontSize: 14,
        color: "#991B1B",
      }}
    />
  ),
};
