import { useState } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomBar, { TabType } from "./BottomBar";
import HomePage from "./Home";
import Profile from "./Profile";

export default function MainScreen() {
  const [activeTab, setActiveTab] = useState<TabType>("home");

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
          <Profile />
        )}
      </View>

      <BottomBar activeTab={activeTab} onTabPress={setActiveTab} />
    </SafeAreaView>
  );
}