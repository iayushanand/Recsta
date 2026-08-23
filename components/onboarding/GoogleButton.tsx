import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";

interface GoogleButtonProps {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function GoogleButton({
  onPress,
  loading = false,
  disabled = false,
}: GoogleButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      android_ripple={{ color: "rgba(255,255,255,0.08)" }}
      className={`w-full overflow-hidden rounded-2xl border border-white/10 bg-black px-5 py-4 ${
        isDisabled ? "opacity-50" : "active:opacity-90"
      }`}
    >
      <View className="flex-row items-center justify-center">
        {loading ? (
          <ActivityIndicator color="#fff" size="small" style={{ marginRight: 12 }} />
        ) : (
          <Image
            source={require("../../assets/images/google.png")}
            className="mr-3 h-5 w-5"
            resizeMode="contain"
          />
        )}

        <Text className="text-base font-semibold text-white">
          {loading ? "Signing in..." : "Continue with Google"}
        </Text>
      </View>
    </Pressable>
  );
}
