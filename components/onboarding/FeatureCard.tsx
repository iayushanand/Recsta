import { ReactNode } from "react";
import { Text, View } from "react-native";
import GlassCard from "../common/GlassCard";

interface FeatureCardProps {
  title: string;
  description: string;
  isLast?: boolean;
  children?: ReactNode;
}

export default function FeatureCard({
  title,
  description,
  isLast = false,
  children,
}: FeatureCardProps) {
  return (
    <GlassCard>
      <View className="items-center">
        <Text className="text-center text-4xl font-bold text-white">
          {title}
        </Text>

        <Text className="mt-5 text-center text-base leading-7 text-zinc-300">
          {description}
        </Text>

        {isLast && children && (
          <View className="mt-10 w-full">
            {children}
          </View>
        )}
      </View>
    </GlassCard>
  );
}