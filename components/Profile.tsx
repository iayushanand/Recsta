import { useState } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

const STATS = [
    { label: "Friends", value: "28" },
    { label: "Saved", value: "164" },
    { label: "Watched", value: "81" },
];

const TOP_MOVIES = [
    { title: "Interstellar", image: require("../assets/images/genre/scifi.jpg") },
    { title: "La La Land", image: require("../assets/images/genre/musical.jpg") },
    { title: "Whiplash", image: require("../assets/images/genre/drama.jpg") },
    { title: "Prisoners", image: require("../assets/images/genre/thriller.jpg") },
];

const TASTE_ITEMS = [
    { icon: "film-outline" as const, label: "Top Genres", value: "Sci-Fi • Thriller • Drama" },
    { icon: "calendar-outline" as const, label: "Favorite Decade", value: "2010s" },
    { icon: "time-outline" as const, label: "Favorite Runtime", value: "90–120 min" },
    { icon: "language-outline" as const, label: "Preferred Language", value: "English" },
    { icon: "videocam-outline" as const, label: "Favorite Director", value: "Christopher Nolan" },
];

const FRIENDS = [
    { name: "Rohan", avatar: require("../assets/images/profile/friend1.png") },
    { name: "Sarah", avatar: require("../assets/images/profile/friend2.png") },
];

const CONTENT_PREFS = [
    { name: "Horror", enabled: true },
    { name: "Anime", enabled: true },
    { name: "Musicals", enabled: false },
];

const LANGUAGES = ["English", "Hindi", "Japanese"];

function SectionHeader({ icon, title }: { icon: keyof typeof Ionicons.glyphMap; title: string }) {
    return (
        <View className="flex-row items-center gap-2 px-4 pt-5 pb-2">
            <Ionicons name={icon} size={16} color="#a1a1aa" />
            <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-widest">
                {title}
            </Text>
        </View>
    );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <View className={`mx-3 rounded-2xl border border-white/[0.08] overflow-hidden ${className}`}>
            <BlurView
                intensity={40}
                tint="dark"
                style={{ overflow: "hidden", borderRadius: 16 }}
            >
                {children}
            </BlurView>
        </View>
    );
}

type SettingsMenuItemProps = {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    iconColor?: string;
    onPress?: () => void;
};

function SettingsMenuItem({ icon, label, iconColor = "#a1a1aa", onPress }: SettingsMenuItemProps) {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.6} className="flex-row items-center py-3.5 px-4">
            <View className="w-9 h-9 rounded-xl bg-white/[0.07] items-center justify-center mr-3">
                <Ionicons name={icon} size={18} color={iconColor} />
            </View>
            <Text className="text-zinc-200 text-[15px] font-medium flex-1">{label}</Text>
            <Ionicons name="chevron-forward" size={16} color="#52525b" />
        </TouchableOpacity>
    );
}

function SettingsScreen({ onBack }: { onBack: () => void }) {
    return (
        <View className="flex-1 bg-black">
            <View className="flex-row items-center px-4 pt-4 pb-2">
                <TouchableOpacity onPress={onBack} activeOpacity={0.6} className="mr-3 p-1">
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-bold">Settings</Text>
            </View>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                <Card className="mt-4">
                    <SectionHeader icon="person-outline" title="Account" />
                    <View className="px-4 pb-4">
                        <View className="flex-row items-center py-3">
                            <View className="w-9 h-9 rounded-xl bg-white/[0.07] items-center justify-center mr-3">
                                <Ionicons name="mail-outline" size={18} color="#3b82f6" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-zinc-500 text-xs">Email</Text>
                                <Text className="text-zinc-200 text-sm font-medium mt-0.5">
                                    thisisayushanand@gmail.com
                                </Text>
                            </View>
                        </View>
                    </View>
                </Card>

                <Card className="mt-3">
                    <SectionHeader icon="shield-outline" title="General" />
                    <SettingsMenuItem
                        icon="lock-closed-outline"
                        label="Privacy"
                        iconColor="#10b981"
                    />
                    <View className="mx-4 h-[0.5px] bg-white/[0.06]" />
                    <SettingsMenuItem
                        icon="notifications-outline"
                        label="Notifications"
                        iconColor="#f59e0b"
                    />
                </Card>

                <Card className="mt-3">
                    <SectionHeader icon="help-buoy-outline" title="Support" />
                    <SettingsMenuItem
                        icon="help-circle-outline"
                        label="Help & Feedback"
                        iconColor="#8b5cf6"
                    />
                    <View className="mx-4 h-[0.5px] bg-white/[0.06]" />
                    <SettingsMenuItem
                        icon="information-circle-outline"
                        label="About"
                        iconColor="#6366f1"
                    />
                </Card>

                <View className="mx-3 mt-5 rounded-2xl border border-red-500/20 overflow-hidden">
                    <TouchableOpacity activeOpacity={0.6} className="py-3.5 px-4 flex-row items-center justify-center gap-2 bg-red-500/[0.08]">
                        <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                        <Text className="text-red-400 text-[15px] font-semibold">Log Out</Text>
                    </TouchableOpacity>
                </View>

                <Text className="text-zinc-600 text-xs text-center mt-5">Recsta v0.0.1</Text>
            </ScrollView>
        </View>
    );
}

export default function Profile() {
    const [showSettings, setShowSettings] = useState(false);

    if (showSettings) {
        return <SettingsScreen onBack={() => setShowSettings(false)} />;
    }

    return (
        <View className="flex-1 bg-black">
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                <View className="items-center pt-6 pb-2 px-4">
                    <View className="relative mb-4">
                        <View className="rounded-full overflow-hidden">
                            <LinearGradient
                                colors={["#3b82f6", "#8b5cf6", "#ec4899"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={{ borderRadius: 999, padding: 3 }}
                            >
                                <Image
                                    source={require("../assets/images/home/profile.jpg")}
                                    className="w-24 h-24 rounded-full"
                                    style={{ borderWidth: 3, borderColor: "#000" }}
                                />
                            </LinearGradient>
                        </View>
                        <View
                            className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500"
                            style={{ borderWidth: 3, borderColor: "#000" }}
                        />
                    </View>

                    <Text className="text-white text-xl font-bold tracking-tight">
                        Ayush Anand
                    </Text>
                    <Text className="text-zinc-300 text-sm mt-2 italic">
                        "Cinema is therapy."
                    </Text>

                    <TouchableOpacity activeOpacity={0.7} className="mt-4 overflow-hidden rounded-xl">
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
                            <Text className="text-white text-sm font-semibold">Edit Profile</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <Card className="mt-4">
                    <View className="flex-row py-4">
                        {STATS.map((stat, i) => (
                            <View key={stat.label} className="flex-1 items-center">
                                {i > 0 && (
                                    <View className="absolute left-0 top-1 bottom-1 w-[0.5px] bg-white/[0.08]" />
                                )}
                                <Text className="text-white text-xl font-bold">{stat.value}</Text>
                                <Text className="text-zinc-500 text-xs mt-0.5">{stat.label}</Text>
                            </View>
                        ))}
                    </View>
                </Card>

                <Card className="mt-3">
                    <SectionHeader icon="star-outline" title="Top Movies" />
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16, gap: 10 }}
                    >
                        {TOP_MOVIES.map((movie) => (
                            <View key={movie.title} className="items-center">
                                <Image
                                    source={movie.image}
                                    className="w-24 h-36 rounded-xl"
                                    resizeMode="cover"
                                />
                                <Text className="text-zinc-400 text-[10px] mt-1.5 text-center w-24" numberOfLines={1}>
                                    {movie.title}
                                </Text>
                            </View>
                        ))}
                    </ScrollView>
                </Card>

                <Card className="mt-3">
                    <SectionHeader icon="color-palette-outline" title="Your Taste" />
                    <View className="px-4 pb-4">
                        {TASTE_ITEMS.map((item, i) => (
                            <View key={item.label}>
                                <View className="flex-row items-center py-3">
                                    <View className="w-8 h-8 rounded-lg bg-white/[0.06] items-center justify-center mr-3">
                                        <Ionicons name={item.icon} size={15} color="#71717a" />
                                    </View>
                                    <Text className="text-zinc-400 text-sm flex-1">{item.label}</Text>
                                    <Text className="text-zinc-200 text-sm font-medium">{item.value}</Text>
                                </View>
                                {i < TASTE_ITEMS.length - 1 && (
                                    <View className="h-[0.5px] bg-white/[0.05] ml-11" />
                                )}
                            </View>
                        ))}
                    </View>
                </Card>

                <Card className="mt-3">
                    <SectionHeader icon="people-outline" title="Friends" />
                    <View className="px-4 pb-4">
                        <View className="flex-row items-center">
                            {FRIENDS.map((friend) => (
                                <View key={friend.name} className="items-center mr-4">
                                    <Image
                                        source={friend.avatar}
                                        className="w-12 h-12 rounded-full"
                                        style={{ borderWidth: 2, borderColor: "#27272a" }}
                                    />
                                    <Text className="text-zinc-400 text-[10px] mt-1">{friend.name}</Text>
                                </View>
                            ))}
                            <TouchableOpacity
                                activeOpacity={0.6}
                                className="w-12 h-12 rounded-full bg-white/[0.06] items-center justify-center border border-white/[0.08]"
                            >
                                <Text className="text-zinc-400 text-xs font-semibold">+26</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Card>

                <Card className="mt-3">
                    <SectionHeader icon="options-outline" title="Content Preferences" />
                    <View className="px-4 pb-3">
                        {CONTENT_PREFS.map((pref) => (
                            <View key={pref.name} className="flex-row items-center py-1.5">
                                <Ionicons
                                    name={pref.enabled ? "checkmark-circle" : "close-circle"}
                                    size={16}
                                    color={pref.enabled ? "#10b981" : "#52525b"}
                                />
                                <Text className={`text-sm ml-2 ${pref.enabled ? "text-zinc-200" : "text-zinc-600"}`}>
                                    {pref.name}
                                </Text>
                            </View>
                        ))}
                    </View>

                    <View className="mx-4 h-[0.5px] bg-white/[0.06]" />

                    <SectionHeader icon="globe-outline" title="Language" />
                    <View className="flex-row px-4 pb-4 gap-2 flex-wrap">
                        {LANGUAGES.map((lang) => (
                            <View key={lang} className="px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08]">
                                <Text className="text-zinc-300 text-xs font-medium">{lang}</Text>
                            </View>
                        ))}
                    </View>
                </Card>

                <Card className="mt-3">
                    <TouchableOpacity onPress={() => setShowSettings(true)} activeOpacity={0.6} className="flex-row items-center py-3.5 px-4">
                        <View className="w-9 h-9 rounded-xl bg-white/[0.07] items-center justify-center mr-3">
                            <Ionicons name="settings-outline" size={18} color="#a1a1aa" />
                        </View>
                        <Text className="text-zinc-200 text-[15px] font-medium flex-1">Settings</Text>
                        <Ionicons name="chevron-forward" size={16} color="#52525b" />
                    </TouchableOpacity>
                </Card>

                <Text className="text-zinc-600 text-xs text-center mt-5">Recsta v0.0.1</Text>
            </ScrollView>
        </View>
    );
}
