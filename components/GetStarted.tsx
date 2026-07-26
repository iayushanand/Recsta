import { useState } from "react";
import {
    FlatList,
    NativeScrollEvent,
    NativeSyntheticEvent,
    SafeAreaView,
    StyleSheet,
    View,
    useWindowDimensions,
} from "react-native";

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

    const handleScrollEnd = (
        event: NativeSyntheticEvent<NativeScrollEvent>
    ) => {
        const index = Math.round(
            event.nativeEvent.contentOffset.x / width
        );

        setCurrentIndex(index);
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
                                    // onPress={async () => {
                                    //     try {
                                    //         await signInWithGoogle();
                                    //     } catch (err) {
                                    //         console.error(err);
                                    //     }
                                    // }}
                                    onPress={() => {
                                        if (onGetStarted) {
                                            onGetStarted();
                                        }
                                    }}
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