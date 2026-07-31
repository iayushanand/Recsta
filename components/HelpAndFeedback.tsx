import { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    LayoutAnimation,
    Platform,
    UIManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
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

const FAQS = [
    {
        id: "1",
        question: "How do movie matches work?",
        answer: "Our engine analyzes your selected genres, favorite directors, runtime preferences, and watched history to recommend movies tailored specifically to your taste.",
    },
    {
        id: "2",
        question: "How do I update my preferences?",
        answer: "Navigate to your Profile tab and update your Content Preferences or Language settings directly inside your profile cards.",
    },
    {
        id: "3",
        question: "How do I add friends?",
        answer: "Go to the Friends section on your profile page or search for usernames in the search bar to send friend requests.",
    },
    {
        id: "4",
        question: "Why can't I sign in?",
        answer: "Ensure your internet connection is stable and your Google account credentials are correct. If issues persist, clear your app cache or contact support.",
    },
    {
        id: "5",
        question: "How do I report a bug?",
        answer: "You can tap the 'Report a Bug' button right here on this page to submit details and screenshots directly to our dev team.",
    },
];

export default function HelpAndFeedback({
    onBack,
    onPrivacyPolicy,
    onTermsOfService,
}: {
    onBack?: () => void;
    onPrivacyPolicy?: () => void;
    onTermsOfService?: () => void;
}) {
    const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

    const toggleFaq = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedFaq((prev) => (prev === id ? null : id));
    };

    return (
        <View className="flex-1 bg-black">
            {/* Top Navigation */}
            <View className="flex-row items-center px-4 pt-4 pb-2">
                {onBack && (
                    <TouchableOpacity onPress={onBack} activeOpacity={0.6} className="mr-3 p-1">
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                )}
                <Text className="text-white text-lg font-bold">Help & Feedback</Text>
            </View>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                {/* Subtitle Banner */}
                <View className="px-5 pt-2 pb-4">
                    <Text className="text-zinc-400 text-sm leading-5">
                        Need assistance or have feedback? We're here to help you get the best experience.
                    </Text>
                </View>

                {/* FAQ Section */}
                <Card className="mt-1">
                    <SectionHeader icon="help-circle-outline" title="Frequently Asked Questions" />
                    <View className="px-4 pb-3">
                        {FAQS.map((faq, index) => {
                            const isExpanded = expandedFaq === faq.id;
                            return (
                                <View key={faq.id}>
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        onPress={() => toggleFaq(faq.id)}
                                        className="flex-row items-center justify-between py-3.5"
                                    >
                                        <Text className="text-zinc-200 text-[15px] font-medium flex-1 pr-3">
                                            {faq.question}
                                        </Text>
                                        <Ionicons
                                            name={isExpanded ? "chevron-up" : "chevron-down"}
                                            size={18}
                                            color="#71717a"
                                        />
                                    </TouchableOpacity>
                                    {isExpanded && (
                                        <Text className="text-zinc-400 text-sm leading-5 pb-3 pt-1">
                                            {faq.answer}
                                        </Text>
                                    )}
                                    {index < FAQS.length - 1 && (
                                        <View className="h-[0.5px] bg-white/[0.06]" />
                                    )}
                                </View>
                            );
                        })}
                    </View>
                </Card>

                {/* Report a Bug */}
                <Card className="mt-3">
                    <View className="p-4">
                        <View className="flex-row items-center gap-2 mb-2">
                            <View className="w-8 h-8 rounded-xl bg-red-500/10 items-center justify-center">
                                <Ionicons name="bug-outline" size={18} color="#ef4444" />
                            </View>
                            <Text className="text-white text-base font-semibold">Report a Bug</Text>
                        </View>
                        <Text className="text-zinc-400 text-sm leading-5 mb-4">
                            Encountered a glitch or broken feature? Let us know so we can fix it right away.
                        </Text>
                        <TouchableOpacity activeOpacity={0.8} className="overflow-hidden rounded-xl">
                            <LinearGradient
                                colors={["#ef4444", "#dc2626"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={{
                                    paddingVertical: 11,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: 12,
                                }}
                            >
                                <Text className="text-white text-sm font-semibold">Report an Issue</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </Card>

                {/* Suggest a Feature */}
                <Card className="mt-3">
                    <View className="p-4">
                        <View className="flex-row items-center gap-2 mb-2">
                            <View className="w-8 h-8 rounded-xl bg-violet-500/10 items-center justify-center">
                                <Ionicons name="bulb-outline" size={18} color="#8b5cf6" />
                            </View>
                            <Text className="text-white text-base font-semibold">Suggest a Feature</Text>
                        </View>
                        <Text className="text-zinc-400 text-sm leading-5 mb-4">
                            Have an idea that could make Recsta better? We'd love to hear your suggestions.
                        </Text>
                        <TouchableOpacity activeOpacity={0.8} className="overflow-hidden rounded-xl">
                            <LinearGradient
                                colors={["#8b5cf6", "#7c3aed"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={{
                                    paddingVertical: 11,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: 12,
                                }}
                            >
                                <Text className="text-white text-sm font-semibold">Share Idea</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </Card>

                {/* Contact Support */}
                <Card className="mt-3">
                    <SectionHeader icon="mail-outline" title="Contact Support" />
                    <View className="px-4 pb-4">
                        <Text className="text-zinc-400 text-sm leading-5 mb-3">
                            Can't find what you're looking for? Reach out directly to our support team and we'll get back to you shortly.
                        </Text>
                        <View className="flex-row items-center py-2.5 px-3.5 bg-white/[0.04] rounded-xl border border-white/[0.06]">
                            <Ionicons name="mail" size={16} color="#3b82f6" className="mr-2" />
                            <Text className="text-blue-400 text-sm font-medium ml-2">
                                support@recsta.app
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* Legal */}
                <Card className="mt-3">
                    <SectionHeader icon="document-text-outline" title="Legal" />
                    <TouchableOpacity onPress={onPrivacyPolicy} activeOpacity={0.6} className="flex-row items-center justify-between py-3.5 px-4">
                        <Text className="text-zinc-200 text-[15px] font-medium">Privacy Policy</Text>
                        <Ionicons name="chevron-forward" size={16} color="#52525b" />
                    </TouchableOpacity>
                    <View className="mx-4 h-[0.5px] bg-white/[0.06]" />
                    <TouchableOpacity onPress={onTermsOfService} activeOpacity={0.6} className="flex-row items-center justify-between py-3.5 px-4">
                        <Text className="text-zinc-200 text-[15px] font-medium">Terms of Service</Text>
                        <Ionicons name="chevron-forward" size={16} color="#52525b" />
                    </TouchableOpacity>
                </Card>

                {/* App Information */}
                <Card className="mt-3">
                    <SectionHeader icon="information-circle-outline" title="App Information" />
                    <View className="px-4 pb-4">
                        <View className="flex-row justify-between py-2 border-b border-white/[0.06]">
                            <Text className="text-zinc-400 text-sm">Version</Text>
                            <Text className="text-zinc-200 text-sm font-medium">1.0.0</Text>
                        </View>
                        <View className="flex-row justify-between py-2">
                            <Text className="text-zinc-400 text-sm">Build</Text>
                            <Text className="text-zinc-200 text-sm font-medium">2026.07.31</Text>
                        </View>
                    </View>
                </Card>

                {/* Thank You Note */}
                <View className="px-6 mt-6">
                    <Text className="text-zinc-500 text-xs text-center leading-5 italic">
                        Thank you for using Recsta. Every bug report and suggestion helps us create a better movie discovery experience.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}
