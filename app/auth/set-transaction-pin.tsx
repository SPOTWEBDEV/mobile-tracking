import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { useAuth } from "../context/AuthContext";

const PIN_LENGTH = 4;
const API_BASE = "https://asfast-app.com/api/api";

export default function SetTransactionPin() {
    const [pin, setPin] = useState<string[]>(Array(PIN_LENGTH).fill(""));
    const [confirmPin, setConfirmPin] = useState<string[]>(Array(PIN_LENGTH).fill(""));
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();
     


    const pinRefs = useRef<(TextInput | null)[]>([]);
    const confirmRefs = useRef<(TextInput | null)[]>([]);

    const handleChange = (
        value: string,
        index: number,
        type: "pin" | "confirm"
    ) => {
        if (!/^\d?$/.test(value)) return;

        const arr = type === "pin" ? [...pin] : [...confirmPin];
        arr[index] = value;

        type === "pin" ? setPin(arr) : setConfirmPin(arr);

        if (value && index < PIN_LENGTH - 1) {
            (type === "pin" ? pinRefs : confirmRefs).current[index + 1]?.focus();
        }
    };

    const handleBackspace = (
        index: number,
        type: "pin" | "confirm"
    ) => {
        if (index > 0) {
            (type === "pin" ? pinRefs : confirmRefs).current[index - 1]?.focus();
        }
    };

    const handleSubmit = async () => {
        const pinValue = pin.join("");
        const confirmValue = confirmPin.join("");

        if (pinValue.length !== 4 || confirmValue.length !== 4) {
            Toast.show({
                type: "error",
                text1: "Invalid PIN",
                text2: "Transaction PIN must be 4 digits",
            });
            return;
        }

        if (pinValue !== confirmValue) {
            Toast.show({
                type: "error",
                text1: "PIN Mismatch",
                text2: "PINs do not match",
            });
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${API_BASE}/user/setpin.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ pin: pinValue }),
            });

            const text = await res.text();
            console.log(text, 'text')
            const data = JSON.parse(text);
            console.log(data, 'data')

            if (!data.status) {
                Toast.show({
                    type: "error",
                    text1: "Failed",
                    text2: data.message || "Unable to set PIN",
                });
                return;
            }

            Toast.show({
                type: "success",
                text1: "Success 🎉",
                text2: "Transaction PIN set successfully",
            });

            router.replace('/(tabs)');

        } catch (err) {
            console.log(err)
            Toast.show({
                type: "error",
                text1: "Network Error",
                text2: "Please try again",
            });
        } finally {
            setLoading(false);
        }
    };

    const renderInputs = (
        values: string[],
        refs: React.MutableRefObject<(TextInput | null)[]>,
        type: "pin" | "confirm"
    ) => (
        <View className="flex-row justify-between mt-4">
            {values.map((digit, index) => (
                <TextInput
                    key={index}
                    ref={(ref) => {
                        refs.current[index] = ref;
                    }}
                    value={digit}
                    secureTextEntry
                    keyboardType="number-pad"
                    maxLength={1}
                    onChangeText={(v) => handleChange(v, index, type)}
                    onKeyPress={({ nativeEvent }) =>
                        nativeEvent.key === "Backspace" && handleBackspace(index, type)
                    }
                    className="w-14 h-16 bg-white border border-gray-200 rounded-xl text-center text-2xl font-bold"
                />
            ))}
        </View>
    );

    return (
        <View  style={{ backgroundColor: '1A4DBE'}} className="flex-1  px-6 pt-16">
            <View  className="items-center mb-6">
                <Ionicons name="lock-closed-outline" size={48} color="#2563eb" />
                <Text  className="text-2xl font-bold  mt-4">
                    Set Transaction PIN
                </Text>
                <Text  className=" text-center mt-2">
                    This PIN will be required for transfers and payments
                </Text>
            </View>

            <Text  className=" font-medium mt-6">Enter PIN</Text>
            {renderInputs(pin, pinRefs, "pin")}

            <Text  className="font-medium mt-6">Confirm PIN</Text>
            {renderInputs(confirmPin, confirmRefs, "confirm")}

            <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading}
                className="bg-blue-600 py-4 rounded-xl mt-10"
            >
                <Text className="text-white text-center font-semibold text-lg">
                    {loading ? "Setting PIN..." : "Continue"}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
