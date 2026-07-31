import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

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

function BulletPoint({ text }: { text: string }) {
    return (
        <View className="flex-row items-start py-1">
            <Text className="text-violet-400 mr-2 text-xs font-bold">•</Text>
            <Text className="text-zinc-300 text-sm flex-1 leading-5">{text}</Text>
        </View>
    );
}

export default function TermsOfService({ onBack }: { onBack?: () => void }) {
    return (
        <View className="flex-1 bg-black">
            {/* Header */}
            <View className="flex-row items-center px-4 pt-4 pb-2">
                {onBack && (
                    <TouchableOpacity onPress={onBack} activeOpacity={0.6} className="mr-3 p-1">
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                )}
                <Text className="text-white text-lg font-bold">Terms of Service</Text>
            </View>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                {/* Intro Card */}
                <Card className="mt-2">
                    <View className="p-4">
                        <View className="flex-row justify-between items-center mb-3 border-b border-white/[0.06] pb-3">
                            <Text className="text-white text-base font-bold">Terms of Service</Text>
                            <Text className="text-zinc-500 text-xs font-medium">Last Updated: July 31, 2026</Text>
                        </View>
                        <Text className="text-zinc-300 text-sm leading-6 mb-3">
                            Welcome to Recsta. These Terms of Service ("Terms") govern your use of the Recsta application and related services.
                        </Text>
                        <Text className="text-zinc-400 text-xs leading-5 italic">
                            By accessing or using Recsta, you agree to these Terms. If you do not agree, please do not use the application.
                        </Text>
                    </View>
                </Card>

                {/* 1. Eligibility & 2. Your Account */}
                <Card className="mt-3">
                    <SectionHeader icon="person-circle-outline" title="Account & Eligibility" />
                    <View className="px-4 pb-4">
                        <Text className="text-zinc-200 text-sm font-semibold mb-1 mt-1">1. Eligibility</Text>
                        <Text className="text-zinc-300 text-sm leading-5 mb-3">
                            You must be at least 13 years old (or the minimum age required by your local laws) to use Recsta. By using the app, you represent that you meet these requirements.
                        </Text>

                        <View className="h-[0.5px] bg-white/[0.06] my-2" />

                        <Text className="text-zinc-200 text-sm font-semibold mb-1 mt-1">2. Your Account</Text>
                        <Text className="text-zinc-400 text-xs mb-2">When signing in with Google, you agree to:</Text>
                        <BulletPoint text="Provide accurate account information" />
                        <BulletPoint text="Keep your account secure" />
                        <BulletPoint text="Notify us if you believe your account has been compromised" />
                        <Text className="text-zinc-500 text-xs mt-2 italic">
                            You are responsible for all activity that occurs under your account.
                        </Text>
                    </View>
                </Card>

                {/* 3. Acceptable Use */}
                <Card className="mt-3">
                    <SectionHeader icon="shield-checkmark-outline" title="3. Acceptable Use" />
                    <View className="px-4 pb-4">
                        <Text className="text-zinc-400 text-xs mb-2">You agree not to:</Text>
                        <BulletPoint text="Use the app for illegal or unauthorized purposes" />
                        <BulletPoint text="Harass, threaten, or abuse other users" />
                        <BulletPoint text="Impersonate another individual or organization" />
                        <BulletPoint text="Attempt unauthorized access to Recsta systems" />
                        <BulletPoint text="Interfere with normal app operation" />
                        <BulletPoint text="Upload malicious software or harmful content" />
                        <BulletPoint text="Use automated bots or scripts to abuse the service" />
                        <Text className="text-red-400/80 text-xs mt-3">
                            We reserve the right to suspend or terminate accounts that violate these rules.
                        </Text>
                    </View>
                </Card>

                {/* 4. User Content & 5. Movie Information */}
                <Card className="mt-3">
                    <SectionHeader icon="film-outline" title="Content & Intellectual Property" />
                    <View className="px-4 pb-4">
                        <Text className="text-zinc-200 text-sm font-semibold mb-1 mt-1">4. User Content</Text>
                        <Text className="text-zinc-300 text-sm leading-5 mb-2">
                            You retain ownership of content you create (profile info, watchlists, movie preferences). By submitting content, you grant Recsta a non-exclusive worldwide license to store, display, and process it solely for operating and improving the service.
                        </Text>

                        <View className="h-[0.5px] bg-white/[0.06] my-3" />

                        <Text className="text-zinc-200 text-sm font-semibold mb-1">5. Movie Information</Text>
                        <Text className="text-zinc-300 text-sm leading-5">
                            Recsta displays metadata provided by third-party services. All copyrights and trademarks belong to their respective owners. Recsta does not claim ownership of third-party movie info.
                        </Text>

                        <View className="h-[0.5px] bg-white/[0.06] my-3" />

                        <Text className="text-zinc-200 text-sm font-semibold mb-1">7. Intellectual Property</Text>
                        <Text className="text-zinc-300 text-sm leading-5">
                            The Recsta app, branding, logos, and graphics are protected by IP laws. You may not copy, modify, reverse engineer, redistribute, sell, or license any part without prior written permission.
                        </Text>
                    </View>
                </Card>

                {/* 6. Availability & 8. Account Termination */}
                <Card className="mt-3">
                    <SectionHeader icon="server-outline" title="Service & Termination" />
                    <View className="px-4 pb-4">
                        <Text className="text-zinc-200 text-sm font-semibold mb-1 mt-1">6. Availability</Text>
                        <Text className="text-zinc-300 text-sm leading-5 mb-3">
                            We strive to keep Recsta reliable, but cannot guarantee uninterrupted service. Features may change or be discontinued at any time without notice.
                        </Text>

                        <View className="h-[0.5px] bg-white/[0.06] my-2" />

                        <Text className="text-zinc-200 text-sm font-semibold mb-1 mt-1">8. Account Termination</Text>
                        <Text className="text-zinc-300 text-sm leading-5">
                            You may delete your account at any time. We may suspend or terminate your account if you violate these Terms, pose a security risk, or if required by law.
                        </Text>
                    </View>
                </Card>

                {/* 9. Disclaimer & 10. Limitation of Liability */}
                <Card className="mt-3">
                    <SectionHeader icon="alert-circle-outline" title="Disclaimers & Liability" />
                    <View className="px-4 pb-4">
                        <Text className="text-zinc-200 text-sm font-semibold mb-1 mt-1">9. Disclaimer</Text>
                        <Text className="text-zinc-300 text-sm leading-5 mb-3">
                            Recsta is provided <Text className="font-bold text-white">"AS IS"</Text> and <Text className="font-bold text-white">"AS AVAILABLE"</Text> without guarantees regarding continuous availability, recommendation accuracy, or error-free operation. Use of the service is at your own risk.
                        </Text>

                        <View className="h-[0.5px] bg-white/[0.06] my-2" />

                        <Text className="text-zinc-200 text-sm font-semibold mb-1 mt-1">10. Limitation of Liability</Text>
                        <Text className="text-zinc-300 text-sm leading-5">
                            To the fullest extent permitted by law, Recsta and its developers shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the app.
                        </Text>
                    </View>
                </Card>

                {/* 11. Privacy, 12. Changes, 13. Governing Law */}
                <Card className="mt-3">
                    <SectionHeader icon="document-text-outline" title="General Terms" />
                    <View className="px-4 pb-4">
                        <Text className="text-zinc-200 text-sm font-semibold mb-1 mt-1">11. Privacy</Text>
                        <Text className="text-zinc-300 text-sm leading-5 mb-3">
                            Your use of Recsta is also governed by our Privacy Policy.
                        </Text>

                        <View className="h-[0.5px] bg-white/[0.06] my-2" />

                        <Text className="text-zinc-200 text-sm font-semibold mb-1 mt-1">12. Changes to These Terms</Text>
                        <Text className="text-zinc-300 text-sm leading-5 mb-3">
                            We may update these Terms from time to time. Continued use after changes become effective constitutes acceptance.
                        </Text>

                        <View className="h-[0.5px] bg-white/[0.06] my-2" />

                        <Text className="text-zinc-200 text-sm font-semibold mb-1 mt-1">13. Governing Law</Text>
                        <Text className="text-zinc-300 text-sm leading-5">
                            Governed by and interpreted in accordance with applicable local jurisdiction laws.
                        </Text>
                    </View>
                </Card>

                {/* 14. Contact */}
                <Card className="mt-3">
                    <SectionHeader icon="mail-outline" title="14. Contact" />
                    <View className="px-4 pb-4">
                        <Text className="text-zinc-300 text-sm leading-5 mb-3">
                            If you have any questions regarding these Terms, please contact us:
                        </Text>
                        <View className="flex-row items-center py-2.5 px-3.5 bg-white/[0.04] rounded-xl border border-white/[0.06]">
                            <Ionicons name="mail" size={16} color="#8b5cf6" />
                            <Text className="text-violet-400 text-sm font-medium ml-2">
                                legal@recsta.app
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* Closing Message */}
                <View className="px-6 mt-6">
                    <Text className="text-zinc-500 text-xs text-center leading-5 italic">
                        Thank you for using Recsta. Our goal is to make discovering the perfect movie simple, collaborative, and enjoyable for everyone.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}
