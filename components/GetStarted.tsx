import { useState } from "react";
import {
    Alert,
    FlatList,
    NativeScrollEvent,
    NativeSyntheticEvent,
    StyleSheet,
    View,
    useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ONBOARDING } from "../constants/onboarding";
import { signInWithGoogle } from "../lib/auth";
import BackgroundImage from "./onboarding/BackgroundImage";

import GoogleButton from "./onboarding/GoogleButton";
import ProgressDots from "./onboarding/ProgressDots";

interface GetStartedProps {
    onGetStarted?: () => void;
}

export default function GetStarted({ onGetStarted }: GetStartedProps) {
    const { width } = useWindowDimensions();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleScrollEnd = (
        event: NativeSyntheticEvent<NativeScrollEvent>
    ) => {
        const index = Math.round(
            event.nativeEvent.contentOffset.x / width
        );

        setCurrentIndex(index);
    };

    const handleGooglePress = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const result = await signInWithGoogle();
            if (result.success) {
                // Supabase auth state change will also trigger App.tsx routing,
                // but we call onGetStarted to move to genre screen immediately
                if (onGetStarted) onGetStarted();
            } else {
                // Don't show alert for user cancellation
                if (result.code !== "CANCELLED" && result.code !== "SIGN_IN_CANCELLED") {
                    Alert.alert("Sign-in failed", result.error);
                }
            }
        } catch (err: any) {
            console.error(err);
            Alert.alert("Sign-in failed", err?.message ?? "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-black">
            <FlatList
                data={ONBOARDING}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                pagingEnabled
                bounces={false}
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleScrollEnd}
                renderItem={({ item, index }) => (
                    <View
                        style={{
                            width,
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <BackgroundImage
                            image={item.image}
                            title={item.title}
                            description={item.description}
                        >
                            {index === ONBOARDING.length - 1 && (
                                <GoogleButton
                                    loading={loading}
                                    onPress={handleGooglePress}
                                />
                            )}
                        </BackgroundImage>
                    </View>
                )}
            />

            <View style={styles.dots}>
                <ProgressDots
                    progress={currentIndex}
                    total={ONBOARDING.length}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    dots: {
        position: "absolute",
        bottom: 42,
        left: 0,
        right: 0,
        alignItems: "center",
    },
});
