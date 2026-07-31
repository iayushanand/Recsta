import { View, Text, ImageBackground, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

export default function HomePage() {
  const genres = ["Action", "Adventure", "Sci-Fi"];

  const cast = [
    { name: "Tom Holland", role: "as Peter Parker / Spider-Man" },
    { name: "Zendaya", role: "as MJ" },
    { name: "Sadie Sink", role: "Actor" },
    { name: "Jacob Batalon", role: "as Ned Leeds" },
  ];

  return (
    <View className="flex-1 p-2 gap-2 bg-black">
      <ImageBackground
        source={require("../assets/images/home/demo.jpg")}
        className="h-2/3 rounded-2xl p-4 justify-end overflow-hidden"
        resizeMode="cover"
        imageStyle={{ opacity: 0.55 }}
      >
        <View className="flex-row justify-between items-center w-full">
          <Text className="text-white text-sm font-medium">
            2h 25m • 2026
          </Text>

          <View className="flex-row items-center gap-1 bg-black/50 px-2.5 py-1 rounded-full border border-white/10">
            <Ionicons name="star" size={14} color="#f59e0b" />
            <Text className="text-white text-sm font-semibold">4.5</Text>
          </View>
        </View>
      </ImageBackground>

      <View className="flex-1 rounded-2xl border border-white/20 overflow-hidden bg-zinc-900/80">
        <BlurView
          intensity={80}
          tint="dark"
          blurMethod="none"
          style={{ flex: 1, padding: 16 }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 16 }}
          >
            <Text className="text-white text-2xl font-bold">
              SpiderMan: Brand New Day
            </Text>

            <Text className="text-zinc-300 text-sm mt-1 leading-5">
              The fourth installment in the MCU Spider-Man franchise.
            </Text>

            <View className="flex-row flex-wrap gap-2 mt-3">
              {genres.map((genre, index) => (
                <View
                  key={index}
                  className="bg-white/10 px-2.5 py-1 rounded-full border border-white/10"
                >
                  <Text className="text-zinc-200 text-xs font-medium">
                    {genre}
                  </Text>
                </View>
              ))}
            </View>

            <View className="mt-4 pt-3 border-t border-white/10">
              <Text className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">
                Director
              </Text>
              <Text className="text-white text-sm font-medium mt-0.5">
                Destin Daniel Cretton
              </Text>
            </View>

            <View className="mt-4 pt-3 border-t border-white/10">
              <Text className="text-zinc-400 text-xs uppercase tracking-wider font-semibold mb-2">
                Cast
              </Text>

              <View className="gap-2">
                {cast.map((item, index) => (
                  <View
                    key={index}
                    className="flex-row justify-between items-center py-1"
                  >
                    <Text className="text-white text-sm font-medium">
                      {item.name}
                    </Text>
                    <Text className="text-zinc-400 text-xs">
                      {item.role}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </BlurView>
      </View>
    </View>
  );
}