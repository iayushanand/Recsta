import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

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

const FEATURES = [
    {
        icon: "sparkles-outline" as const,
        color: "#3b82f6",
        title: "Tailored Recommendations",
        description: "Discover movies matched precisely to your unique taste and mood.",
    },
    {
        icon: "bookmark-outline" as const,
        color: "#f59e0b",
        title: "Save for Later",
        description: "Keep a curated collection of films you want to watch next.",
    },
    {
        icon: "people-outline" as const,
        color: "#10b981",
        title: "Friend Matching",
        description: "Match tastes with friends to find what everyone wants to watch.",
    },
    {
        icon: "film-outline" as const,
        color: "#8b5cf6",
        title: "Personal Watchlists",
        description: "Build, organize, and manage custom movie lists effortlessly.",
    },
];

const VALUES = [
    { icon: "analytics-outline" as const, title: "Personalized Recommendations" },
    { icon: "eye-outline" as const, title: "Beautiful, Distraction-Free Design" },
    { icon: "heart-outline" as const, title: "Built for Movie Lovers" },
    { icon: "flash-outline" as const, title: "Fast & Simple to Use" },
];

const SOCIAL_LINKS = [
    { icon: "globe-outline" as const, label: "Website", url: "recsta.app" },
    { icon: "logo-github" as const, label: "GitHub", url: "github.com/recsta" },
    { icon: "logo-instagram" as const, label: "Instagram", url: "@recstaapp" },
    { icon: "mail-outline" as const, label: "Contact Email", url: "ayush@recsta.app" },
];

export default function About({ onBack }: { onBack?: () => void }) {
    return (
        <View className="flex-1 bg-black">
            {/* Top Bar */}
            <View className="flex-row items-center px-4 pt-4 pb-2">
                {onBack && (
                    <TouchableOpacity onPress={onBack} activeOpacity={0.6} className="mr-3 p-1">
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                )}
                <Text className="text-white text-lg font-bold">About Recsta</Text>
            </View>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                {/* Hero Header */}
                <View className="items-center pt-6 pb-6 px-4">
                    <View className="mb-4">
                        <LinearGradient
                            colors={["#3b82f6", "#8b5cf6", "#ec4899"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{ borderRadius: 24, padding: 3 }}
                        >
                            <View className="w-20 h-20 bg-black rounded-[21px] items-center justify-center">
                                <Ionicons name="film" size={36} color="#3b82f6" />
                            </View>
                        </LinearGradient>
                    </View>

                    <Text className="text-white text-2xl font-extrabold tracking-tight">
                        Recsta
                    </Text>
                    <Text className="text-zinc-400 text-sm mt-1 font-medium">
                        Making movie nights effortless.
                    </Text>
                </View>

                {/* What is Recsta? */}
                <Card className="mt-1">
                    <SectionHeader icon="information-circle-outline" title="What is Recsta?" />
                    <View className="px-4 pb-4 pt-1">
                        <Text className="text-zinc-300 text-sm leading-6">
                            Recsta is a cinematic discovery and matching platform built to solve the age-old problem of scroll fatigue. It helps you and your friends easily discover films tailored to your shared preferences so you spend less time searching and more time watching.
                        </Text>
                    </View>
                </Card>

                {/* Our Mission */}
                <Card className="mt-3">
                    <SectionHeader icon="compass-outline" title="Our Mission" />
                    <View className="px-4 pb-4 pt-1">
                        <Text className="text-zinc-300 text-sm leading-6">
                            We aim to eliminate the frustration of deciding what to watch by turning movie discovery into a collaborative, personalized, and delightful experience.
                        </Text>
                    </View>
                </Card>

                {/* What You Can Do */}
                <Card className="mt-3">
                    <SectionHeader icon="grid-outline" title="What You Can Do" />
                    <View className="px-4 pb-3">
                        {FEATURES.map((feat, index) => (
                            <View key={feat.title}>
                                <View className="flex-row items-start py-3">
                                    <View
                                        className="w-9 h-9 rounded-xl items-center justify-center mr-3 mt-0.5"
                                        style={{ backgroundColor: feat.color + "18" }}
                                    >
                                        <Ionicons name={feat.icon} size={18} color={feat.color} />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-zinc-200 text-sm font-semibold">{feat.title}</Text>
                                        <Text className="text-zinc-400 text-xs mt-0.5 leading-4">
                                            {feat.description}
                                        </Text>
                                    </View>
                                </View>
                                {index < FEATURES.length - 1 && (
                                    <View className="h-[0.5px] bg-white/[0.06] ml-12" />
                                )}
                            </View>
                        ))}
                    </View>
                </Card>

                {/* Why Recsta? */}
                <Card className="mt-3">
                    <SectionHeader icon="sparkles-outline" title="Why Recsta?" />
                    <View className="px-4 pb-4">
                        {VALUES.map((val, index) => (
                            <View key={val.title} className="flex-row items-center py-2.5">
                                <View className="w-6 h-6 rounded-full bg-white/[0.06] items-center justify-center mr-3">
                                    <Ionicons name={val.icon} size={13} color="#10b981" />
                                </View>
                                <Text className="text-zinc-200 text-sm font-medium">{val.title}</Text>
                            </View>
                        ))}
                    </View>
                </Card>

                {/* Credits */}
                <Card className="mt-3">
                    <SectionHeader icon="code-slash-outline" title="Credits" />
                    <View className="px-4 pb-4">
                        <View className="py-2">
                            <Text className="text-zinc-500 text-xs">Developed by</Text>
                            <Text className="text-zinc-200 text-sm font-semibold mt-0.5">Ayush Anand</Text>
                        </View>
                        <View className="h-[0.5px] bg-white/[0.06] my-1" />
                        <View className="py-2">
                            <Text className="text-zinc-500 text-xs">Built With</Text>
                            <Text className="text-zinc-300 text-sm font-medium mt-0.5">
                                React Native • Expo • NativeWind • Supabase
                            </Text>
                        </View>
                        <View className="h-[0.5px] bg-white/[0.06] my-1" />
                        <View className="py-2">
                            <Text className="text-zinc-500 text-xs">Special Thanks</Text>
                            <Text className="text-zinc-300 text-sm font-medium mt-0.5">
                                All cinephiles & beta testers helping shape Recsta
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* Version Info */}
                <Card className="mt-3">
                    <SectionHeader icon="hardware-chip-outline" title="Version Information" />
                    <View className="px-4 pb-4">
                        <View className="flex-row justify-between py-2 border-b border-white/[0.06]">
                            <Text className="text-zinc-400 text-sm">App Version</Text>
                            <Text className="text-zinc-200 text-sm font-medium">1.0.0</Text>
                        </View>
                        <View className="flex-row justify-between py-2 border-b border-white/[0.06]">
                            <Text className="text-zinc-400 text-sm">Build Number</Text>
                            <Text className="text-zinc-200 text-sm font-medium">2026.07.31</Text>
                        </View>
                        <View className="flex-row justify-between py-2">
                            <Text className="text-zinc-400 text-sm">Last Updated</Text>
                            <Text className="text-zinc-200 text-sm font-medium">July 2026</Text>
                        </View>
                    </View>
                </Card>

                {/* Connect With Us */}
                <Card className="mt-3">
                    <SectionHeader icon="share-social-outline" title="Connect With Us" />
                    <View className="px-4 pb-3">
                        {SOCIAL_LINKS.map((link, index) => (
                            <View key={link.label}>
                                <TouchableOpacity activeOpacity={0.6} className="flex-row items-center justify-between py-3">
                                    <View className="flex-row items-center">
                                        <View className="w-8 h-8 rounded-xl bg-white/[0.06] items-center justify-center mr-3">
                                            <Ionicons name={link.icon} size={16} color="#3b82f6" />
                                        </View>
                                        <Text className="text-zinc-200 text-sm font-medium">{link.label}</Text>
                                    </View>
                                    <Text className="text-zinc-500 text-xs">{link.url}</Text>
                                </TouchableOpacity>
                                {index < SOCIAL_LINKS.length - 1 && (
                                    <View className="h-[0.5px] bg-white/[0.06]" />
                                )}
                            </View>
                        ))}
                    </View>
                </Card>

                {/* Footer Message */}
                <View className="px-8 mt-6">
                    <Text className="text-zinc-500 text-xs text-center leading-5 italic">
                        "Built with passion for everyone who has ever spent more time choosing a movie than watching one."
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}
