import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

type MenuItemProps = {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    iconColor?: string;
    showChevron?: boolean;
    onPress?: () => void;
};

function MenuItem({
    icon,
    label,
    iconColor = "#a1a1aa",
    showChevron = true,
    onPress,
}: MenuItemProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.6}
            className="flex-row items-center py-3.5 px-4"
        >
            <View className="w-9 h-9 rounded-xl bg-white/[0.07] items-center justify-center mr-3">
                <Ionicons name={icon} size={18} color={iconColor} />
            </View>
            <Text className="text-zinc-200 text-[15px] font-medium flex-1">
                {label}
            </Text>
            {showChevron && (
                <Ionicons name="chevron-forward" size={16} color="#52525b" />
            )}
        </TouchableOpacity>
    );
}

function SectionDivider({ label }: { label?: string }) {
    if (!label) {
        return <View className="h-2" />;
    }
    return (
        <View className="px-4 pt-5 pb-1.5">
            <Text className="text-zinc-500 text-xs font-semibold uppercase tracking-widest">
                {label}
            </Text>
        </View>
    );
}

export default function Profile() {
    return (
        <View className="flex-1 bg-black">
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 32 }}
            >
                <View className="items-center pt-6 pb-5 px-4">
                    <View className="relative mb-4">
                        <View className="rounded-full p-[2.5px] overflow-hidden">
                            <LinearGradient
                                colors={["#3b82f6", "#8b5cf6", "#ec4899"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={{
                                    borderRadius: 999,
                                    padding: 3,
                                }}
                            >
                                <Image
                                    source={require("../assets/images/home/profile.jpg")}
                                    className="w-24 h-24 rounded-full"
                                    style={{ borderWidth: 3, borderColor: "#000" }}
                                />
                            </LinearGradient>
                        </View>
                        <View
                            className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 items-center justify-center"
                            style={{ borderWidth: 3, borderColor: "#000" }}
                        />
                    </View>

                    <Text className="text-white text-xl font-bold tracking-tight">
                        Ayush Anand
                    </Text>
                    <Text className="text-zinc-400 text-sm mt-1">
                        thisisayushanand@gmail.com
                    </Text>

                    <TouchableOpacity
                        activeOpacity={0.7}
                        className="mt-4 overflow-hidden rounded-xl"
                    >
                        <LinearGradient
                            colors={["#3b82f6", "#2563eb"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{
                                paddingVertical: 10,
                                paddingHorizontal: 32,
                                borderRadius: 12,
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 6,
                            }}
                        >
                            <Ionicons name="pencil" size={14} color="#fff" />
                            <Text className="text-white text-sm font-semibold">
                                Edit Profile
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <View className="mx-3 rounded-2xl border border-white/[0.08] overflow-hidden">
                    <BlurView
                        intensity={40}
                        tint="dark"
                        style={{ overflow: "hidden", borderRadius: 16 }}
                    >
                        <SectionDivider label="Account" />
                        <MenuItem
                            icon="settings-outline"
                            label="Settings"
                            iconColor="#3b82f6"
                        />
                        <View className="mx-4 h-[0.5px] bg-white/[0.06]" />
                        <MenuItem
                            icon="notifications-outline"
                            label="Notifications"
                            iconColor="#f59e0b"
                        />
                        <View className="mx-4 h-[0.5px] bg-white/[0.06]" />
                        <MenuItem
                            icon="lock-closed-outline"
                            label="Privacy"
                            iconColor="#10b981"
                        />
                    </BlurView>
                </View>

                <View className="mx-3 mt-3 rounded-2xl border border-white/[0.08] overflow-hidden">
                    <BlurView
                        intensity={40}
                        tint="dark"
                        style={{ overflow: "hidden", borderRadius: 16 }}
                    >
                        <SectionDivider label="Support" />
                        <MenuItem
                            icon="help-circle-outline"
                            label="Help & Feedback"
                            iconColor="#8b5cf6"
                        />
                        <View className="mx-4 h-[0.5px] bg-white/[0.06]" />
                        <MenuItem
                            icon="information-circle-outline"
                            label="About"
                            iconColor="#6366f1"
                        />
                    </BlurView>
                </View>

                <View className="mx-3 mt-3 rounded-2xl border border-red-500/20 overflow-hidden">
                    <TouchableOpacity activeOpacity={0.6} className="py-3.5 px-4 flex-row items-center justify-center gap-2 bg-red-500/[0.08]">
                        <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                        <Text className="text-red-400 text-[15px] font-semibold">
                            Log Out
                        </Text>
                    </TouchableOpacity>
                </View>

                <Text className="text-zinc-600 text-xs text-center mt-5">
                    Recsta v0.0.1
                </Text>
            </ScrollView>
        </View>
    );
}
