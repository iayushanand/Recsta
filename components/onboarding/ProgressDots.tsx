import { View } from "react-native";

interface ProgressDotsProps {
  progress: number;
  total: number;
}

export default function ProgressDots({
  progress,
  total,
}: ProgressDotsProps) {
  return (
    <View className="flex-row items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          className={`h-2 rounded-full ${
            Math.round(progress) === index
              ? "w-2 bg-white"
              : "w-2 bg-white/40"
          }`}
        />
      ))}
    </View>
  );
}