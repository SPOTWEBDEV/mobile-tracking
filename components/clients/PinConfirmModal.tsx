import React, { useEffect, useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (pin: string) => void;
};

export default function ConfirmPinModal({
  visible,
  onClose,
  onConfirm,
}: Props) {
  const [pin, setPin] = useState("");

  useEffect(() => {
    if (!visible) setPin("");
  }, [visible]);

  const handlePress = (value: string) => {
    if (pin.length < 4) setPin((p) => p + value);
  };

  const handleDelete = () => {
    setPin((p) => p.slice(0, -1));
  };

  return (
    <Modal transparent animationType="slide" visible={visible}>
      <View className="flex-1 justify-end bg-black/40">
        <View className="rounded-t-3xl bg-[#F9FAFB] px-6 pt-6 pb-10">
          {/* HANDLE */}
          <View className="w-12 h-1 rounded-full self-center mb-4 bg-gray-300" />

          {/* TITLE */}
          <Text className="text-xl font-bold text-center text-gray-900">
            Enter Transaction PIN
          </Text>
          <Text className="text-center text-gray-500 mt-1 mb-8">
            Confirm this transaction securely
          </Text>

          {/* PIN DOTS */}
          <View className="flex-row justify-center mb-10">
            {[0, 1, 2, 3].map((i) => (
              <View
                key={i}
                className={`w-4 h-4 mx-2 rounded-full ${
                  pin.length > i ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            ))}
          </View>

          {/* KEYPAD */}
          <View className="flex-row flex-wrap justify-between">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <Key key={n} value={n} onPress={handlePress} />
            ))}

            <View className="w-[30%]" />

            <Key value={0} onPress={handlePress} />

            <TouchableOpacity
              onPress={handleDelete}
              className="w-[30%] h-14 mb-4 rounded-xl items-center justify-center bg-white border border-gray-200"
            >
              <Ionicons name="backspace-outline" size={22} color="#EF4444" />
            </TouchableOpacity>
          </View>

          {/* CONFIRM BUTTON */}
          <TouchableOpacity
            disabled={pin.length !== 4}
            onPress={() => onConfirm(pin)}
            className={`mt-6 h-14 rounded-xl items-center justify-center ${
              pin.length === 4 ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <Text className="text-white font-semibold text-lg">
              Confirm Transaction
            </Text>
          </TouchableOpacity>

          {/* CANCEL */}
          <TouchableOpacity onPress={onClose} className="mt-4">
            <Text className="text-center text-red-500 font-medium">
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

/* ---------- KEYPAD BUTTON ---------- */

const Key = ({
  value,
  onPress,
}: {
  value: number;
  onPress: (v: string) => void;
}) => (
  <TouchableOpacity
    onPress={() => onPress(String(value))}
    className="w-[30%] h-14 mb-4 rounded-xl items-center justify-center bg-white border border-gray-200"
    activeOpacity={0.7}
  >
    <Text className="text-xl font-semibold text-gray-900">
      {value}
    </Text>
  </TouchableOpacity>
);
