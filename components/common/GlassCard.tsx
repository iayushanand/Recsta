import { ReactNode } from "react";
import { View } from "react-native";
import { BlurView } from "expo-blur";

interface GlassCardProps {
  children: ReactNode;
}

export default function GlassCard({ children }: GlassCardProps) {
  return (
    <View
      className="overflow-hidden rounded-[32px] border border-white/10"
      style={{
        backgroundColor: "rgba(255,255,255,0.04)",
      }}
    >
      <BlurView
        intensity={30}
        tint="dark"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />

      <View className="px-8 py-10">
        {children}
      </View>
    </View>
  );
}