import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useAuth } from "../../../context/AuthContext";

const API_BASE = "https://asfast-app.com/api/api";

export default function VirtualCardsScreen() {
    const { token, user } = useAuth();
    const router = useRouter();

    const [cards, setCards] = useState({} as any);
    const [selectedCard, setSelectedCard] = useState<any>(null);

    const [fundOpen, setFundOpen] = useState(false);
    const [withdrawOpen, setWithdrawOpen] = useState(false);
    const [freezeOpen, setFreezeOpen] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);

    const [loadingDetails, setLoadingDetails] = useState(false);

    const [loading, setLoading] = useState(false);
    const [checkingCard, setCheckingCard] = useState(true); // Initial check
    const [hasCard, setHasCard] = useState(false);
    const [cardDetails, setCardDetails] = useState<any>(null);
    const [amount, setAmount] = useState("");
    const [actionLoading, setActionLoading] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    // ======================
    // Check if user has card
    // ======================
    useEffect(() => {
        const checkCard = async () => {
            if (!user || !token) return;

            try {
                const res = await fetch(`${API_BASE}/user/cards.php?action=fetchcards`, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await res.json();
                console.log("Fetched cards:", data);

                if (data.status && data.data && data.data.length > 0) {
                    // Fetch the first card's details
                    const firstCardId = data.data[0].card_id;
                    const detailsRes = await fetch(
                        `${API_BASE}/user/cards.php?action=fetch_card_details`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({ card_id: firstCardId }),
                        }
                    );

                    const detailsText = await detailsRes.text();
                    const detailsData = JSON.parse(detailsText);

                    console.log("Fetched card details:", detailsData);

                    if (!detailsData.status) {
                        Toast.show({ type: "error", text1: detailsData.message });
                        setHasCard(false);
                    } else {
                        setCardDetails(detailsData.data); // store real card info
                        setCards(detailsData.data); // store list of cards
                        setHasCard(true);
                    }

                    // Optionally redirect to view page
                    // router.replace("/dashboard/services/virtualcard/view");
                } else {
                    setHasCard(false);
                }
            } catch (err) {
                console.log("Error checking/fetching cards:", err);
                setHasCard(false);
            } finally {
                setCheckingCard(false);
            }
        };

        checkCard();
    }, [user, token]);

    const fundCard = async () => {
        if (!amount) {
            Toast.show({ type: "error", text1: "Enter amount" });
            return;
        }

        if (Number(amount) > Number(user?.bal)) {
            Toast.show({ type: "error", text1: "Insufficient balance", text2: `Your current balance is ${user?.bal} Naira` });
            return;
        }


        try {
            setActionLoading(true);

            const res = await fetch(`${API_BASE}/user/cards.php?action=fund_card`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    card_id: cards.card_id,
                    amount: Number(amount),
                }),
            });

            const text = await res.text();
            console.log("Fund card response:", text);


            const data = JSON.parse(text);

            if (!data.status) {
                Toast.show({ type: "error", text1: data.message });
            } else {
                Toast.show({ type: "success", text1: "Card funded successfully" });
                setFundOpen(false);
                setAmount("");
                router.replace("/dashboard/services/virtualcard/view");
            }
        } catch (err) {
            Toast.show({ type: "error", text1: "Something went wrong" });
        } finally {
            setActionLoading(false);
        }
    };

    const withdrawCard = async () => {
        if (!amount) {
            Toast.show({ type: "error", text1: "Enter amount" });
            return;
        }

        if(Number(amount) > cards.available_balance) {
            Toast.show({ type: "error", text1: "Insufficient card balance", text2: `Your card's available balance is ${cards.available_balance} ${cards.card_currency}` });
            return;
        }

        try {
            setActionLoading(true);

            const res = await fetch(`${API_BASE}/user/cards.php?action=withdraw_card`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    card_id: cards.card_id,
                    amount: Number(amount),
                }),
            });

            const data = await res.json();

            if (!data.status) {
                Toast.show({ type: "error", text1: data.message });
            } else {
                Toast.show({ type: "success", text1: "Withdrawal successful" });
                setWithdrawOpen(false);
                setAmount("");
                router.replace("/dashboard/services/virtualcard/view");
            }
        } catch (err) {
            Toast.show({ type: "error", text1: "Something went wrong" });
        } finally {
            setActionLoading(false);
        }
    };

    const freezeCard = async () => {
        try {
            setActionLoading(true);

            const freeze = cards.is_active ? 1 : 0;

            console.log("Freezing/unfreezing card with ID:", cards.card_id, "Current status:", freeze);


            const res = await fetch(`${API_BASE}/user/cards.php?action=freeze_card`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    card_id: cards.card_id,
                    freeze,
                }),
            });

            const text = await res.text();
            console.log("Freeze card response:", text);
            const data = JSON.parse(text);

            if (!data.status) {
                Toast.show({ type: "error", text1: data.message });
            } else {
                Toast.show({ type: "success", text1: "Card frozen successfully" });
                setFreezeOpen(false);
                router.replace("/dashboard/services/virtualcard/view");
            }
        } catch (err) {
            Toast.show({ type: "error", text1: "Something went wrong" });
        } finally {
            setActionLoading(false);
        }
    };

    const deleteCard = async () => {
        try {
            setActionLoading(true);


            if(cards.available_balance > 0){
                Toast.show({ type: "error", text1: "Card has available balance", text2: "Withdraw the balance before deleting the card" });
                setActionLoading(false);
                return;
            }

            const res = await fetch(`${API_BASE}/user/cards.php?action=delete_card`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    card_id: cards.card_id,
                }),
            });

            const text = await res.text();
            console.log("Delete card response:", text);
            const data = JSON.parse(text);

            if (!data.status) {
                Toast.show({ type: "error", text1: data.message });
            } else {
                Toast.show({ type: "success", text1: "Card deleted successfully" });

                setHasCard(false);
                setCards({});
                setDeleteOpen(false);
            }
        } catch (err) {
            Toast.show({ type: "error", text1: "Something went wrong" });
        } finally {
            setActionLoading(false);
        }
    };


    const formatNumber = (value: number | string) => {
        if (value === null || value === undefined || value === "") return "0.00";

        return new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(Number(value));
    };


    return (
        <SafeAreaView className="flex-1 bg-[#F9FAFB]">
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                {/* HEADER */}
                <View className="px-5 pt-2">
                    <TouchableOpacity
                        onPress={() => router.push("/dashboard/services/virtualcard")}
                        className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm"
                    >
                        <Ionicons name="chevron-back" size={22} color="#111827" />
                    </TouchableOpacity>

                    <Text className="text-2xl mt-4 font-bold text-gray-900">
                        Virtual Dollar Cards
                    </Text>
                    <Text className="text-gray-500 mt-1">
                        All your purchased virtual cards
                    </Text>
                </View>

                {/* CARD LIST */}
                <View className="px-5 mt-6 space-y-4">
                    {checkingCard && (
                        <View className="bg-white rounded-xl border border-gray-200 p-6 items-center">
                            <Text className="text-gray-500">Checking cards...</Text>
                        </View>
                    )}
                    {!checkingCard && hasCard === false && (
                        <View className="bg-white rounded-xl border border-gray-200 p-6 items-center">
                            <Ionicons name="card-outline" size={28} color="#9CA3AF" />
                            <Text className="text-gray-500 mt-3">No cards available</Text>
                        </View>
                    )}

                    {!checkingCard && hasCard === true && (
                        <View>
                            <TouchableOpacity
                                key={Math.random().toString()}
                                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                                activeOpacity={0.9}
                            >
                                <View className="w-full rounded-2xl overflow-hidden">
                                    {/* Card Background */}
                                    <View className="bg-[#1e3a8a] px-5 py-6 rounded-2xl relative">

                                        {/* Top Row */}
                                        <View className="flex-row justify-between items-start">
                                            <View>
                                                <Text className="text-white text-sm opacity-80">Balance</Text>
                                                <Text className="text-white text-2xl font-bold">
                                                    ${formatNumber(cards.available_balance)}
                                                </Text>
                                            </View>

                                            <Text className="text-white font-bold text-lg">Master Card</Text>
                                        </View>

                                        {/* Card Number */}
                                        <View className="mt-8">
                                            <Text className="text-white text-2xl tracking-widest font-semibold">
                                                {cards.card_number}
                                            </Text>
                                        </View>

                                        {/* Bottom Row */}
                                        <View className="flex-row justify-between items-end mt-6">
                                            <View>
                                                <Text className="text-white text-xs opacity-70">CARD HOLDER</Text>
                                                <Text className="text-white font-semibold text-sm mt-1">
                                                    {user?.firstName?.toUpperCase()} {user?.lastName?.toUpperCase()}
                                                </Text>
                                            </View>

                                            <View>
                                                <Text className="text-white text-xs opacity-70 text-right">
                                                    VALID THRU
                                                </Text>
                                                <Text className="text-white font-semibold text-sm mt-1 text-right">
                                                    {cards.expiry_month}/{cards.expiry_year}
                                                </Text>
                                            </View>
                                        </View>

                                        {/* Decorative Icon */}
                                        <Ionicons
                                            name="card-outline"
                                            size={120}
                                            color="rgba(255,255,255,0.06)"
                                            style={{ position: "absolute", right: -20, bottom: -20 }}
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <View className="flex-row flex-wrap gap-3 mt-4 mb-6">
                                <ActionButton
                                    label="Fund Cards"
                                    icon="wallet-outline"
                                    onPress={() => setFundOpen(true)}
                                />
                                <ActionButton
                                    label="Withdraw"
                                    icon="cash-outline"
                                    onPress={() => setWithdrawOpen(true)}
                                />
                                <ActionButton
                                    label="Card Details"
                                    icon="card-outline"
                                    onPress={() => setDetailsOpen(true)}
                                />
                                <ActionButton
                                    label={cards.is_active ? "Freeze Card" : "Unfreeze Card"}
                                    icon={cards.is_active ? "snow-outline" : "refresh-outline"}
                                    danger={cards.is_active}
                                    onPress={() => setFreezeOpen(true)}
                                />
                                <ActionButton
                                    label="Delete Card"
                                    icon="trash-outline"
                                    danger
                                    onPress={() => setDeleteOpen(true)}
                                />
                            </View>
                        </View>
                    )}


                </View>
            </ScrollView>

            {/* ================= MODALS ================= */}

            {/* Card Details */}
            <BottomModal visible={detailsOpen} onClose={() => setDetailsOpen(false)}>
                <ModalHeader title="Card Details" onClose={() => setDetailsOpen(false)} />
                <Info label="Card Number" value={cards.card_number} />
                <Info label="CVV" value={cards.cvv} />
                <Info
                    label="Expiry"
                    value={`${cards.expiry_month}  / ${cards.expiry_year}`}
                />
                <Info label="Card Balance" value={cards.balance + ' ' + cards.card_currency} />
                <Info label="Card Limit" value={cards.current_card_limit + ' ' + cards.card_currency} />
                <Info label="Card Status" value={cards.is_active ? 'Active' : 'Blocked'} />
            </BottomModal>

            {/* Fund Card */}
            <BottomModal visible={fundOpen} onClose={() => setFundOpen(false)}>
                <ModalHeader title="Fund Card" onClose={() => setFundOpen(false)} />
                <Input
                    label="Amount (Naria)"
                    placeholder="Enter amount"
                    value={amount}
                    onChangeText={setAmount}
                />

                <PrimaryButton label="Fund Card" onPress={fundCard} />
            </BottomModal>

            {/* Withdraw */}
            <BottomModal visible={withdrawOpen} onClose={() => setWithdrawOpen(false)}>
                <ModalHeader title="Withdraw" onClose={() => setWithdrawOpen(false)} />
                <Input
                    label="Amount"
                    placeholder="Enter amount"
                    value={amount}
                    onChangeText={setAmount}
                />
                <PrimaryButton label="Withdraw" onPress={withdrawCard} />
            </BottomModal>

            {/* Freeze */}
            <BottomModal visible={freezeOpen} onClose={() => setFreezeOpen(false)}>
                <Text className="text-lg font-bold text-gray-900">
                    {cards.is_active ? "Freeze Card" : "Unfreeze Card"}
                </Text>

                <Text className="text-gray-500 mt-2 mb-3">
                    {cards.is_active
                        ? "Are you sure you want to freeze this card?"
                        : "Are you sure you want to unfreeze this card?"}
                </Text>

                <DangerButton
                    label={cards.is_active ? "Freeze" : "Unfreeze"}
                    onPress={freezeCard}
                />
            </BottomModal>
            {/* Delete */}
            <BottomModal visible={deleteOpen} onClose={() => setDeleteOpen(false)}>
                <Text className="text-lg font-bold text-gray-900">
                    Delete Card
                </Text>
                <Text className="text-gray-500 mt-2">
                    This action cannot be undone. Are you sure?
                </Text>

                <View className="flex-row gap-3 mt-6">
                    <SecondaryButton label="Cancel" onPress={() => setDeleteOpen(false)} />
                    <DangerButton label="Delete" onPress={deleteCard} />
                </View>
            </BottomModal>
        </SafeAreaView>
    );
}

/* ================= SHARED COMPONENTS ================= */

function BottomModal({ children, visible, onClose }: any) {
    return (
        <Modal transparent animationType="slide" visible={visible}>
            <View className="flex-1 justify-end h-screen">
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    <View className="bg-[#F9FAFB] rounded-t-3xl px-5 pt-8 pb-6 min-h-[50%]">
                        <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-4" />
                        <ScrollView showsVerticalScrollIndicator={false}>{children}</ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}

function ModalHeader({ title, onClose }: any) {
    return (
        <View className="flex-row justify-between items-center mb-6">
            <Text className="text-lg font-semibold text-gray-900">{title}</Text>
            <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={22} color="#111827" />
            </TouchableOpacity>
        </View>
    );
}

function Info({ label, value }: any) {
    return (
        <View className="mb-4">
            <Text className="text-gray-700 mb-1">{label}</Text>
            <View className="bg-white h-14 px-4 rounded-xl border border-gray-200 justify-center">
                <Text className="text-gray-900 font-medium">{value}</Text>
            </View>
        </View>
    );
}



function ActionButton({ label, icon, onPress, danger }: any) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className={`w-[48%] h-20 rounded-xl items-center justify-center border ${danger ? "bg-red-50 border-red-200" : "bg-white border-gray-200"
                }`}
        >
            <Ionicons name={icon} size={22} color={danger ? "#DC2626" : "#0A145A"} />
            <Text
                className={`mt-2 text-sm font-medium ${danger ? "text-red-600" : "text-gray-900"
                    }`}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
}

const PrimaryButton = ({ label, onPress }: any) => (
    <TouchableOpacity
        onPress={onPress}
        className="h-14 bg-blue-600 rounded-xl items-center mb-4 justify-center mt-4"
    >
        <Text className="text-white font-semibold text-lg">{label}</Text>
    </TouchableOpacity>
);

const SecondaryButton = ({ label, onPress }: any) => (
    <TouchableOpacity
        onPress={onPress}
        className="flex-1 h-12 border border-gray-200 rounded-xl items-center justify-center"
    >
        <Text className="text-gray-900 font-semibold">{label}</Text>
    </TouchableOpacity>
);

const DangerButton = ({ label, onPress }: any) => (
    <TouchableOpacity
        onPress={onPress}
        className="flex-1 h-12 bg-red-600 rounded-xl items-center justify-center"
    >
        <Text className="text-white font-semibold">{label}</Text>
    </TouchableOpacity>
);

function Input({ label, placeholder, value, onChangeText }: any) {
    return (
        <View className="mb-4">
            <Text className="text-gray-700 mb-1">{label}</Text>
            <View className="bg-white h-14 px-4 rounded-xl border border-gray-200 justify-center">
                <TextInput
                    placeholder={placeholder}
                    keyboardType="numeric"
                    value={value}
                    onChangeText={onChangeText}
                />
            </View>
        </View>
    );
}