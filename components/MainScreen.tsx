import { useState, useEffect } from "react";
import { View, Text, BackHandler } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomBar, { TabType } from "./BottomBar";
import HomePage from "./Home";
import Profile from "./Profile";
import type { Session } from "@supabase/supabase-js";

type MainScreenProps = {
  onSignOut?: () => void;
  session?: Session | null;
};

export default function MainScreen({ onSignOut, session }: MainScreenProps) {
  const [activeTab, setActiveTab] = useState<TabType>("home");

  // Back from Profile/Message should go to Home, not exit or genre
  // Profile's own BackHandler (for settings/help/etc) runs first (LIFO) and will consume if needed
  useEffect(() => {
    const onBack = () => {
      if (activeTab === "profile" || activeTab === "message") {
        setActiveTab("home");
        return true; // consumed - go to home
      }
      return false; // on home, let App handle double-press to exit
    };
    const sub = BackHandler.addEventListener("hardwareBackPress", onBack);
    return () => sub.remove();
  }, [activeTab]);

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "left", "right"]}>
      <View className="flex-1">
        {activeTab === "home" && (
          <HomePage />
        )}

        {activeTab === "message" && (
          <View className="flex-1 justify-center items-center">
            <Text className="text-white text-lg">Messages Screen</Text>
          </View>
        )}

        {activeTab === "profile" && (
          <Profile onSignOut={onSignOut} session={session} />
        )}
      </View>

      <BottomBar activeTab={activeTab} onTabPress={setActiveTab} />
    </SafeAreaView>
  );
}
