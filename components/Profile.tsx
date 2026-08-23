import { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
    TextInput,
    Modal,
    BackHandler,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import HelpAndFeedback from "./HelpAndFeedback";
import About from "./About";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsOfService from "./TermsOfService";
import { signOut } from "../lib/auth";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { getProfile, getUserGenres, getFriends, updateProfile } from "../lib/profile";
import type { Profile as DbProfile } from "../types/database";
import { GENRES } from "../constants/genres";

// Fallback mocks when DB not yet created
const FALLBACK_STATS = [
    { label: "Friends", value: "28" },
    { label: "Saved", value: "164" },
    { label: "Watched", value: "81" },
];

const FALLBACK_TOP_MOVIES = [
    { title: "Interstellar", image: require("../assets/images/genre/scifi.jpg") },
    { title: "La La Land", image: require("../assets/images/genre/musical.jpg") },
    { title: "Whiplash", image: require("../assets/images/genre/drama.jpg") },
    { title: "Prisoners", image: require("../assets/images/genre/thriller.jpg") },
];

const GENRE_IMAGE_MAP: Record<string, any> = {
    action: require("../assets/images/genre/action.jpg"),
    animation: require("../assets/images/genre/animation.jpg"),
    comedy: require("../assets/images/genre/comedy.jpg"),
    documentary: require("../assets/images/genre/documentary.jpg"),
    drama: require("../assets/images/genre/drama.jpg"),
    fantasy: require("../assets/images/genre/fantasy.jpg"),
    horror: require("../assets/images/genre/horror.jpg"),
    musical: require("../assets/images/genre/musical.jpg"),
    romance: require("../assets/images/genre/romance.jpg"),
    scifi: require("../assets/images/genre/scifi.jpg"),
    thriller: require("../assets/images/genre/thriller.jpg"),
    western: require("../assets/images/genre/western.jpg"),
};

function labelForGenre(id: string) {
    return GENRES.find(g => g.id === id)?.label ?? id;
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

function SettingsScreen({
    onBack,
    onHelpFeedback,
    onAbout,
    onPrivacyPolicy,
    onSignOut,
    session,
}: {
    onBack: () => void;
    onHelpFeedback: () => void;
    onAbout: () => void;
    onPrivacyPolicy: () => void;
    onSignOut?: () => void;
    session?: Session | null;
}) {
    const [loggingOut, setLoggingOut] = useState(false);
    const email = session?.user?.email ?? "thisisayushanand@gmail.com";
    const displayName = session?.user?.user_metadata?.full_name ?? session?.user?.user_metadata?.name ?? null;

    const handleLogout = async () => {
        Alert.alert("Log Out", "Are you sure you want to sign out?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Log Out",
                style: "destructive",
                onPress: async () => {
                    setLoggingOut(true);
                    try {
                        await signOut();
                        onSignOut?.();
                    } catch (e: any) {
                        Alert.alert("Error", e?.message ?? "Failed to sign out");
                    } finally {
                        setLoggingOut(false);
                    }
                },
            },
        ]);
    };

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
                        {displayName && (
                            <View className="flex-row items-center py-2">
                                <View className="w-9 h-9 rounded-xl bg-white/[0.07] items-center justify-center mr-3">
                                    <Ionicons name="person-outline" size={18} color="#8b5cf6" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-zinc-500 text-xs">Name</Text>
                                    <Text className="text-zinc-200 text-sm font-medium mt-0.5">
                                        {displayName}
                                    </Text>
                                </View>
                            </View>
                        )}
                        <View className="flex-row items-center py-3">
                            <View className="w-9 h-9 rounded-xl bg-white/[0.07] items-center justify-center mr-3">
                                <Ionicons name="mail-outline" size={18} color="#3b82f6" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-zinc-500 text-xs">Email</Text>
                                <Text className="text-zinc-200 text-sm font-medium mt-0.5">
                                    {email}
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
                        onPress={onPrivacyPolicy}
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
                        onPress={onHelpFeedback}
                    />
                    <View className="mx-4 h-[0.5px] bg-white/[0.06]" />
                    <SettingsMenuItem
                        icon="information-circle-outline"
                        label="About"
                        iconColor="#6366f1"
                        onPress={onAbout}
                    />
                </Card>

                <View className="mx-3 mt-5 rounded-2xl border border-red-500/20 overflow-hidden">
                    <TouchableOpacity
                        onPress={handleLogout}
                        disabled={loggingOut}
                        activeOpacity={0.6}
                        className="py-3.5 px-4 flex-row items-center justify-center gap-2 bg-red-500/[0.08]"
                    >
                        {loggingOut ? (
                            <ActivityIndicator color="#ef4444" />
                        ) : (
                            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                        )}
                        <Text className="text-red-400 text-[15px] font-semibold">
                            {loggingOut ? "Signing out..." : "Log Out"}
                        </Text>
                    </TouchableOpacity>
                </View>

                <Text className="text-zinc-600 text-xs text-center mt-5">Recsta v0.0.1</Text>
            </ScrollView>
        </View>
    );
}

type ProfileProps = {
    onSignOut?: () => void;
    session?: Session | null;
};

export default function Profile({ onSignOut, session }: ProfileProps) {
    const [subScreen, setSubScreen] = useState<"none" | "settings" | "help" | "about" | "privacy" | "terms">("none");

    // Handle Android back within Profile stack before App's handler pops to genre
    useEffect(() => {
        const onBack = () => {
            if (subScreen === "terms" || subScreen === "privacy") {
                setSubScreen("settings");
                return true;
            }
            if (subScreen === "help" || subScreen === "about") {
                setSubScreen("settings");
                return true;
            }
            if (subScreen === "settings") {
                setSubScreen("none");
                return true;
            }
            return false; // let App handle (exit)
        };
        const sub = BackHandler.addEventListener("hardwareBackPress", onBack);
        return () => sub.remove();
    }, [subScreen]);
    const [dbProfile, setDbProfile] = useState<DbProfile | null>(null);
    const [userGenres, setUserGenres] = useState<string[]>([]);
    const [friends, setFriends] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editModal, setEditModal] = useState(false);
    const [editName, setEditName] = useState("");
    const [editStatus, setEditStatus] = useState("");
    const [saving, setSaving] = useState(false);

    const user = session?.user;
    const displayName = dbProfile?.display_name ?? user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? "Ayush Anand";
    const avatarUrl = dbProfile?.avatar_url ?? user?.user_metadata?.avatar_url ?? user?.user_metadata?.picture ?? null;
    const email = dbProfile?.email ?? user?.email;
    const statusText = dbProfile?.status_text ?? "Hi, I am using Recsta!";

    const fetchData = useCallback(async () => {
        if (!user?.id) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const [profile, genres, fr] = await Promise.all([
                getProfile(user.id).catch(() => null),
                getUserGenres(user.id).catch(() => []),
                getFriends(user.id).catch(() => []),
            ]);
            if (profile) {
                setDbProfile(profile);
                setEditName(profile.display_name ?? displayName);
                setEditStatus(profile.status_text ?? statusText);
            }
            setUserGenres(genres);
            setFriends(fr as any);
        } catch (e) {
            console.warn('[Profile] fetch error', e);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => { fetchData(); }, [fetchData]);

    // Refresh on focus? simple effect
    const handleSaveProfile = async () => {
        if (!user?.id) return;
        setSaving(true);
        try {
            const updated = await updateProfile(user.id, { display_name: editName.trim() || null, status_text: editStatus.trim() || null } as any);
            setDbProfile(updated);
            setEditModal(false);
        } catch (e: any) {
            Alert.alert('Save failed', e.message);
        } finally { setSaving(false); }
    };

    const togglePref = async (key: 'horror_enabled' | 'anime_enabled' | 'musicals_enabled') => {
        if (!user?.id || !dbProfile) return;
        const newVal = !dbProfile[key];
        // optimistic
        setDbProfile({ ...dbProfile, [key]: newVal });
        try { await updateProfile(user.id, { [key]: newVal } as any); } catch (e: any) { Alert.alert('Failed', e.message); setDbProfile(dbProfile); }
    };

    const toggleLanguage = async (lang: string) => {
        if (!user?.id || !dbProfile) return;
        const current = dbProfile.languages ?? ['English','Hindi','Japanese'];
        const next = current.includes(lang) ? current.filter(l => l !== lang) : [...current, lang];
        setDbProfile({ ...dbProfile, languages: next });
        try { await updateProfile(user.id, { languages: next } as any); } catch (e: any) { Alert.alert('Failed', e.message); }
    };

    const addFriendPrompt = () => {
        Alert.prompt?.('Add Friend', 'Enter friend email', async (emailInput: string) => {
            if (!emailInput || !user?.id) return;
            try {
                const { error } = await supabase.from('friendships').insert({ user_id: user.id, friend_id: (await supabase.from('profiles').select('id').eq('email', emailInput).single()).data?.id });
                if (error) throw error;
                Alert.alert('Sent', 'Friend request sent');
                fetchData();
            } catch (e: any) { Alert.alert('Failed', e.message); }
        });
        // Fallback for Android where Alert.prompt not available
        if (!Alert.prompt) {
            Alert.alert('Add Friend', 'Go to Supabase > friendships to add friends by email. Feature requires searchable profiles.');
        }
    };

    if (subScreen === "terms") return <TermsOfService onBack={() => setSubScreen("settings")} />;
    if (subScreen === "privacy") return <PrivacyPolicy onBack={() => setSubScreen("settings")} />;
    if (subScreen === "about") return <About onBack={() => setSubScreen("settings")} />;
    if (subScreen === "help") {
        return (
            <HelpAndFeedback
                onBack={() => setSubScreen("settings")}
                onPrivacyPolicy={() => setSubScreen("privacy")}
                onTermsOfService={() => setSubScreen("terms")}
            />
        );
    }
    if (subScreen === "settings") {
        return (
            <SettingsScreen
                onBack={() => setSubScreen("none")}
                onHelpFeedback={() => setSubScreen("help")}
                onAbout={() => setSubScreen("about")}
                onPrivacyPolicy={() => setSubScreen("privacy")}
                onSignOut={onSignOut}
                session={session}
            />
        );
    }

    // Derived display data
    const topGenresLabel = userGenres.length > 0 ? userGenres.map(labelForGenre).join(' • ') : 'Sci-Fi • Thriller • Drama';
    const tasteItems = [
        { icon: "film-outline" as const, label: "Top Genres", value: topGenresLabel },
        { icon: "calendar-outline" as const, label: "Favorite Decade", value: dbProfile?.favorite_decade ?? "2010s" },
        { icon: "time-outline" as const, label: "Favorite Runtime", value: dbProfile?.favorite_runtime ?? "90–120 min" },
        { icon: "language-outline" as const, label: "Preferred Language", value: dbProfile?.preferred_language ?? "English" },
        { icon: "videocam-outline" as const, label: "Favorite Director", value: dbProfile?.favorite_director ?? "Christopher Nolan" },
    ];
    const contentPrefs = [
        { key: 'horror_enabled' as const, name: "Horror", enabled: dbProfile?.horror_enabled ?? true },
        { key: 'anime_enabled' as const, name: "Anime", enabled: dbProfile?.anime_enabled ?? true },
        { key: 'musicals_enabled' as const, name: "Musicals", enabled: dbProfile?.musicals_enabled ?? false },
    ];
    const languages = dbProfile?.languages ?? ["English", "Hindi", "Japanese"];
    const allLanguages = ["English", "Hindi", "Japanese", "Spanish", "French", "Korean"];
    const stats = [
        { label: "Friends", value: String(friends.length || dbProfile?.friends_count || FALLBACK_STATS[0].value) },
        { label: "Saved", value: String(dbProfile?.saved_count ?? FALLBACK_STATS[1].value) },
        { label: "Watched", value: String(dbProfile?.watched_count ?? FALLBACK_STATS[2].value) },
    ];

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
                                    source={
                                        avatarUrl
                                            ? { uri: avatarUrl }
                                            : require("../assets/images/home/profile.jpg")
                                    }
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
                        {displayName}
                    </Text>
                    {email && (
                        <Text className="text-zinc-400 text-xs mt-1">{email}</Text>
                    )}
                    <Text className="text-zinc-300 text-sm mt-2 italic">
                        "{statusText}"
                    </Text>

                    <TouchableOpacity onPress={() => setEditModal(true)} activeOpacity={0.7} className="mt-4 overflow-hidden rounded-xl">
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

                {loading && <ActivityIndicator color="#3b82f6" style={{ marginVertical: 12 }} />}

                <Card className="mt-4">
                    <View className="flex-row py-4">
                        {stats.map((stat, i) => (
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
                        {(FALLBACK_TOP_MOVIES).map((movie) => (
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
                        {tasteItems.map((item, i) => (
                            <View key={item.label}>
                                <View className="flex-row items-center py-3">
                                    <View className="w-8 h-8 rounded-lg bg-white/[0.06] items-center justify-center mr-3">
                                        <Ionicons name={item.icon} size={15} color="#71717a" />
                                    </View>
                                    <Text className="text-zinc-400 text-sm flex-1">{item.label}</Text>
                                    <Text className="text-zinc-200 text-sm font-medium" numberOfLines={1} style={{ maxWidth: 160 }}>{item.value}</Text>
                                </View>
                                {i < tasteItems.length - 1 && (
                                    <View className="h-[0.5px] bg-white/[0.05] ml-11" />
                                )}
                            </View>
                        ))}
                    </View>
                </Card>

                <Card className="mt-3">
                    <SectionHeader icon="people-outline" title="Friends" />
                    <View className="px-4 pb-4">
                        {friends.length === 0 ? (
                            <View className="py-2">
                                <Text className="text-zinc-500 text-sm">No friends yet. Add friends by email.</Text>
                                <TouchableOpacity onPress={addFriendPrompt} className="mt-3 self-start px-3 py-1.5 rounded-full bg-violet-500/20 border border-violet-500/30">
                                    <Text className="text-violet-400 text-xs font-semibold">+ Add Friend</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View className="flex-row items-center flex-wrap gap-3">
                                {friends.map((f: any) => (
                                    <View key={f.id} className="items-center mr-2">
                                        <Image
                                            source={f.avatar_url ? { uri: f.avatar_url } : require("../assets/images/profile/friend1.png")}
                                            className="w-12 h-12 rounded-full"
                                            style={{ borderWidth: 2, borderColor: "#27272a" }}
                                        />
                                        <Text className="text-zinc-400 text-[10px] mt-1">{f.display_name ?? f.email?.split('@')[0]}</Text>
                                    </View>
                                ))}
                                <TouchableOpacity
                                    onPress={addFriendPrompt}
                                    activeOpacity={0.6}
                                    className="w-12 h-12 rounded-full bg-white/[0.06] items-center justify-center border border-white/[0.08]"
                                >
                                    <Ionicons name="add" size={18} color="#71717a" />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </Card>

                <Card className="mt-3">
                    <SectionHeader icon="options-outline" title="Content Preferences" />
                    <View className="px-4 pb-3">
                        {contentPrefs.map((pref) => (
                            <TouchableOpacity key={pref.name} onPress={() => togglePref(pref.key)} className="flex-row items-center py-1.5">
                                <Ionicons
                                    name={pref.enabled ? "checkmark-circle" : "close-circle"}
                                    size={16}
                                    color={pref.enabled ? "#10b981" : "#52525b"}
                                />
                                <Text className={`text-sm ml-2 ${pref.enabled ? "text-zinc-200" : "text-zinc-600"}`}>
                                    {pref.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View className="mx-4 h-[0.5px] bg-white/[0.06]" />

                    <SectionHeader icon="globe-outline" title="Language" />
                    <View className="flex-row px-4 pb-4 gap-2 flex-wrap">
                        {allLanguages.map((lang) => {
                            const active = languages.includes(lang);
                            return (
                                <TouchableOpacity key={lang} onPress={() => toggleLanguage(lang)} className={`px-3 py-1.5 rounded-full border ${active ? 'bg-violet-500/20 border-violet-500/30' : 'bg-white/[0.06] border-white/[0.08]'}`}>
                                    <Text className={`${active ? 'text-violet-300' : 'text-zinc-300'} text-xs font-medium`}>{lang}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </Card>

                <Card className="mt-3">
                    <TouchableOpacity onPress={() => setSubScreen("settings")} activeOpacity={0.6} className="flex-row items-center py-3.5 px-4">
                        <View className="w-9 h-9 rounded-xl bg-white/[0.07] items-center justify-center mr-3">
                            <Ionicons name="settings-outline" size={18} color="#a1a1aa" />
                        </View>
                        <Text className="text-zinc-200 text-[15px] font-medium flex-1">Settings</Text>
                        <Ionicons name="chevron-forward" size={16} color="#52525b" />
                    </TouchableOpacity>
                </Card>

                <Text className="text-zinc-600 text-xs text-center mt-5">Recsta v0.0.1</Text>
            </ScrollView>

            <Modal visible={editModal} transparent animationType="fade" onRequestClose={() => setEditModal(false)}>
                <View className="flex-1 bg-black/70 justify-center px-6">
                    <View className="bg-zinc-900 rounded-2xl p-5 border border-white/10">
                        <Text className="text-white text-lg font-bold mb-3">Edit Profile</Text>
                        <Text className="text-zinc-400 text-xs mb-1">Name</Text>
                        <TextInput value={editName} onChangeText={setEditName} placeholder="Your name" placeholderTextColor="#71717a" className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2.5 text-white mb-3" />
                        <Text className="text-zinc-400 text-xs mb-1">Status</Text>
                        <TextInput value={editStatus} onChangeText={setEditStatus} placeholder="Hi, I am using Recsta!" placeholderTextColor="#71717a" className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2.5 text-white mb-4" />
                        <View className="flex-row gap-3">
                            <TouchableOpacity onPress={() => setEditModal(false)} className="flex-1 py-3 rounded-xl bg-white/10 items-center"><Text className="text-white font-semibold">Cancel</Text></TouchableOpacity>
                            <TouchableOpacity onPress={handleSaveProfile} disabled={saving} className="flex-1 py-3 rounded-xl bg-violet-600 items-center">
                                {saving ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-semibold">Save</Text>}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
