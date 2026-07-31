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
            <Text className="text-blue-400 mr-2 text-xs font-bold">•</Text>
            <Text className="text-zinc-300 text-sm flex-1 leading-5">{text}</Text>
        </View>
    );
}

export default function PrivacyPolicy({ onBack }: { onBack?: () => void }) {
    return (
        <View className="flex-1 bg-black">
            {/* Header */}
            <View className="flex-row items-center px-4 pt-4 pb-2">
                {onBack && (
                    <TouchableOpacity onPress={onBack} activeOpacity={0.6} className="mr-3 p-1">
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                )}
                <Text className="text-white text-lg font-bold">Privacy Policy</Text>
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
                            <Text className="text-white text-base font-bold">Privacy Policy</Text>
                            <Text className="text-zinc-500 text-xs font-medium">Last Updated: July 31, 2026</Text>
                        </View>
                        <Text className="text-zinc-300 text-sm leading-6 mb-3">
                            Welcome to Recsta. Your privacy is important to us. This Privacy Policy explains what information we collect, how we use it, and the choices you have regarding your data.
                        </Text>
                        <Text className="text-zinc-400 text-xs leading-5 italic">
                            By using Recsta, you agree to the practices described in this Privacy Policy.
                        </Text>
                    </View>
                </Card>

                {/* Information We Collect */}
                <Card className="mt-3">
                    <SectionHeader icon="layers-outline" title="Information We Collect" />
                    <View className="px-4 pb-4">
                        <Text className="text-zinc-200 text-sm font-semibold mb-1 mt-2">Account Information</Text>
                        <Text className="text-zinc-400 text-xs mb-2">When you sign in using Google, we may collect:</Text>
                        <BulletPoint text="Your name" />
                        <BulletPoint text="Email address" />
                        <BulletPoint text="Profile picture" />
                        <BulletPoint text="A unique account identifier" />
                        <Text className="text-zinc-500 text-xs mt-2 italic">
                            This information is provided by your Google account and is used solely to create and manage your Recsta account.
                        </Text>

                        <View className="h-[0.5px] bg-white/[0.06] my-3" />

                        <Text className="text-zinc-200 text-sm font-semibold mb-1">Profile Information</Text>
                        <Text className="text-zinc-400 text-xs mb-2">You may choose to provide additional information such as:</Text>
                        <BulletPoint text="Username" />
                        <BulletPoint text="Biography" />
                        <BulletPoint text="Movie preferences & favorite genres" />
                        <BulletPoint text="Saved movies & watchlists" />
                        <BulletPoint text="Friends and connections" />

                        <View className="h-[0.5px] bg-white/[0.06] my-3" />

                        <Text className="text-zinc-200 text-sm font-semibold mb-1">Usage Information</Text>
                        <Text className="text-zinc-400 text-xs mb-2">We collect usage interactions to improve recommendations:</Text>
                        <BulletPoint text="Movies you save, like, or dislike" />
                        <BulletPoint text="Matches created with friends" />
                        <BulletPoint text="Search history & app interactions" />

                        <View className="h-[0.5px] bg-white/[0.06] my-3" />

                        <Text className="text-zinc-200 text-sm font-semibold mb-1">Device Information</Text>
                        <Text className="text-zinc-400 text-xs mb-2">Technical info for stability & performance:</Text>
                        <BulletPoint text="Device type & operating system version" />
                        <BulletPoint text="App version, crash reports & diagnostic info" />
                    </View>
                </Card>

                {/* How We Use Your Information */}
                <Card className="mt-3">
                    <SectionHeader icon="cog-outline" title="How We Use Your Information" />
                    <View className="px-4 pb-4">
                        <BulletPoint text="Create and manage your account" />
                        <BulletPoint text="Personalize movie recommendations" />
                        <BulletPoint text="Enable movie matching with friends" />
                        <BulletPoint text="Sync your saved movies and preferences" />
                        <BulletPoint text="Improve app performance and reliability" />
                        <BulletPoint text="Respond to support requests" />
                        <BulletPoint text="Prevent abuse and maintain platform security" />
                    </View>
                </Card>

                {/* Sharing Your Information */}
                <Card className="mt-3">
                    <SectionHeader icon="share-social-outline" title="Sharing Your Information" />
                    <View className="px-4 pb-4">
                        <Text className="text-emerald-400 text-sm font-semibold mb-2">
                            We do not sell your personal information.
                        </Text>
                        <Text className="text-zinc-300 text-sm leading-5 mb-3">
                            Your information may be shared only when necessary with trusted service providers that help operate Recsta, such as authentication providers, database/cloud hosting, and analytics.
                        </Text>

                        <Text className="text-zinc-200 text-sm font-semibold mb-1 mt-2">Friends & Public Information</Text>
                        <Text className="text-zinc-400 text-xs mb-2">Visible to friends or other users:</Text>
                        <BulletPoint text="Display name, username & profile picture" />
                        <BulletPoint text="Favorite movies & public watchlists (if enabled)" />
                    </View>
                </Card>

                {/* Data Security & Retention */}
                <Card className="mt-3">
                    <SectionHeader icon="shield-checkmark-outline" title="Security & Retention" />
                    <View className="px-4 pb-4">
                        <Text className="text-zinc-200 text-sm font-semibold mb-1">Data Security</Text>
                        <Text className="text-zinc-300 text-sm leading-5 mb-3">
                            We use reasonable technical and organizational measures to protect your data. However, no online service can guarantee absolute security.
                        </Text>

                        <View className="h-[0.5px] bg-white/[0.06] my-2" />

                        <Text className="text-zinc-200 text-sm font-semibold mb-1 mt-1">Data Retention</Text>
                        <Text className="text-zinc-300 text-sm leading-5">
                            We retain information only as long as necessary. If you delete your account, your personal data will be removed or anonymized within a reasonable period.
                        </Text>
                    </View>
                </Card>

                {/* Your Rights */}
                <Card className="mt-3">
                    <SectionHeader icon="key-outline" title="Your Rights" />
                    <View className="px-4 pb-4">
                        <Text className="text-zinc-400 text-xs mb-2">Depending on your location, you have the right to:</Text>
                        <BulletPoint text="Access your personal information" />
                        <BulletPoint text="Update your information" />
                        <BulletPoint text="Delete your account" />
                        <BulletPoint text="Request a copy of your data" />
                        <BulletPoint text="Withdraw consent where applicable" />
                    </View>
                </Card>

                {/* Additional Policies */}
                <Card className="mt-3">
                    <SectionHeader icon="file-tray-full-outline" title="Third Parties & Children" />
                    <View className="px-4 pb-4">
                        <Text className="text-zinc-200 text-sm font-semibold mb-1">Children's Privacy</Text>
                        <Text className="text-zinc-300 text-sm leading-5 mb-3">
                            Recsta is not intended for children under 13. We do not knowingly collect personal information from children.
                        </Text>

                        <View className="h-[0.5px] bg-white/[0.06] my-2" />

                        <Text className="text-zinc-200 text-sm font-semibold mb-1 mt-1">Third-Party Services</Text>
                        <Text className="text-zinc-300 text-sm leading-5 mb-2">
                            Integrations like Google Sign-In, movie databases (e.g., TMDb), and hosting providers have their own privacy policies.
                        </Text>
                    </View>
                </Card>

                {/* Contact Us */}
                <Card className="mt-3">
                    <SectionHeader icon="mail-outline" title="Contact Us" />
                    <View className="px-4 pb-4">
                        <Text className="text-zinc-300 text-sm leading-5 mb-3">
                            For any questions, concerns, or data requests regarding this policy:
                        </Text>
                        <View className="flex-row items-center py-2.5 px-3.5 bg-white/[0.04] rounded-xl border border-white/[0.06]">
                            <Ionicons name="mail" size={16} color="#3b82f6" />
                            <Text className="text-blue-400 text-sm font-medium ml-2">
                                privacy@recsta.app
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* Footer */}
                <View className="px-6 mt-6">
                    <Text className="text-zinc-600 text-xs text-center">
                        © 2026 Recsta. All rights reserved.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}
