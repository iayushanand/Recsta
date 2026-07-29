import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type TabType = "home" | "message" | "profile";

interface BottomBarProps {
  activeTab: TabType;
  onTabPress: (tab: TabType) => void;
}

export default function BottomBar({ activeTab, onTabPress }: BottomBarProps) {
  const tabs: {
    id: TabType;
    label: string;
    activeIcon: keyof typeof Ionicons.glyphMap;
    inactiveIcon: keyof typeof Ionicons.glyphMap;
  }[] = [
    {
      id: "home",
      label: "Home",
      activeIcon: "home",
      inactiveIcon: "home-outline",
    },
    {
      id: "message",
      label: "Messages",
      activeIcon: "chatbubble-ellipses",
      inactiveIcon: "chatbubble-ellipses-outline",
    },
    {
      id: "profile",
      label: "Profile",
      activeIcon: "person",
      inactiveIcon: "person-outline",
    },
  ];

  return (
    <View className="flex-row justify-around items-center bg-zinc-950 border-t border-zinc-800 py-2.5 px-4">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const iconName = isActive ? tab.activeIcon : tab.inactiveIcon;

        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onTabPress(tab.id)}
            className="items-center justify-center flex-1 py-1"
            activeOpacity={0.7}
          >
            <Ionicons
              name={iconName}
              size={24}
              color={isActive ? "#3b82f6" : "#9ca3af"}
            />
            <Text
              className={`text-xs mt-1 font-medium ${
                isActive ? "text-blue-500" : "text-zinc-400"
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
