import { Image, Pressable, Text, View } from "react-native";

interface GoogleButtonProps {
  onPress: () => void;
}

export default function GoogleButton({
  onPress,
}: GoogleButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: "rgba(255,255,255,0.08)" }}
      className="w-full overflow-hidden rounded-2xl border border-white/10 bg-black px-5 py-4 active:opacity-90"
    >
      <View className="flex-row items-center justify-center">
        <Image
          source={require("../../assets/images/google.png")}
          className="mr-3 h-5 w-5"
          resizeMode="contain"
        />

        <Text className="text-base font-semibold text-white">
          Continue with Google
        </Text>
      </View>
    </Pressable>
  );
}