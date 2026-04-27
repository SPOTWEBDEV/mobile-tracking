import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const OTP_LENGTH = 6;
const API_BASE = "https://asfast-app.com/api/api";

export default function VerifyEmailScreen() {
    const { email } = useLocalSearchParams();
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [timer, setTimer] = useState(60);

    const inputs = useRef<(TextInput | null)[]>([]);
      

    /* Countdown */
    useEffect(() => {
        if (timer === 0) return;
        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);

    /* Handle OTP Input */
    const handleChange = (value: string, index: number) => {
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < OTP_LENGTH - 1) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleBackspace = (index: number) => {
        if (otp[index] === "" && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    /* Verify OTP */
    const handleVerifyOtp = async () => {
        const code = otp.join("");

        if (code.length < OTP_LENGTH) {
            Toast.show({
                type: "error",
                text1: "Invalid OTP",
                text2: "Please enter the 6-digit code",
            });
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${API_BASE}/auth/email_otp.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    email,
                    otp: code,
                    action:'verify'
                }),
            });

            const text = await res.text();
            console.log("VERIFY OTP:", text);

            const data = JSON.parse(text);

            if (!data.status) {
                Toast.show({
                    type: "error",
                    text1: "Verification Failed",
                    text2: data.message || "Invalid OTP",
                });
                return;
            }

            Toast.show({
                type: "success",
                text1: "Verified 🎉",
                text2: "Your account is now active",
            });

            router.replace("/auth/login");
        } catch (err) {
            Toast.show({
                type: "error",
                text1: "Network Error",
                text2: "Unable to connect to server",
            });
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    /* Resend OTP */
    const handleResendOtp = async () => {
        setResendLoading(true);

        try {
            const res = await fetch(`${API_BASE}/auth/email_otp.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ action: 'resend' }),
            });

            const text = await res.text();
            console.log("RESEND OTP:", text);

            const data = JSON.parse(text);

            if (!data.status) {
                Toast.show({
                    type: "error",
                    text1: "Failed",
                    text2: data.message || "Unable to resend OTP",
                });
                return;
            }

            Toast.show({
                type: "success",
                text1: "OTP Sent",
                text2: "A new OTP has been sent",
            });

            setOtp(Array(OTP_LENGTH).fill(""));
            setTimer(60);
            inputs.current[0]?.focus();
        } catch (err) {
            Toast.show({
                type: "error",
                text1: "Network Error",
                text2: "Unable to connect to server",
            });
            console.log(err);
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <SafeAreaView   className="flex-1 bg-[#F9FAFB]">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                className="flex-1"
            >
                {/* Header */}
                <View className="px-5 pt-4">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm"
                    >
                        <Ionicons name="chevron-back" size={22} color="#111827" />
                    </TouchableOpacity>

                    <Text  className="text-2xl font-bold  mt-6">
                        Email Verification 
                    </Text>
                    <Text className="text-gray-500 mt-1">
                        Enter the 6-digit code sent to your email address 
                    </Text>
                </View>

                {/* OTP Inputs */}
                <View className="flex-row justify-between px-5 mt-10">
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => {
                                inputs.current[index] = ref;
                            }}
                            value={digit}
                            onChangeText={(value) => handleChange(value, index)}
                            onKeyPress={({ nativeEvent }) =>
                                nativeEvent.key === "Backspace" && handleBackspace(index)
                            }
                            keyboardType="number-pad"
                            maxLength={1}
                            className="w-12 h-14 bg-white border border-gray-200 rounded-xl text-center text-xl font-semibold text-gray-900"
                        />

                    ))}
                </View>

                {/* Verify Button */}
                <View className="px-5 mt-10">
                    <TouchableOpacity
                        onPress={handleVerifyOtp}
                        disabled={loading}
                        className={`h-14 rounded-xl items-center justify-center ${loading ? "bg-blue-400" : "bg-blue-600"
                            }`}
                    >
                        <Text className="text-white font-semibold text-lg">
                            {loading ? "Verifying..." : "Verify OTP"}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Resend */}
                <View className="mt-6 items-center">
                    {timer > 0 ? (
                        <Text   className="">
                            Resend OTP in{" "}
                            <Text className="font-semibold ">
                                {timer}s
                            </Text>
                        </Text>
                    ) : (
                        <TouchableOpacity
                            onPress={handleResendOtp}
                            disabled={resendLoading}
                        >
                            <Text className="text-blue-600 font-semibold">
                                {resendLoading ? "Sending..." : "Resend OTP"}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
