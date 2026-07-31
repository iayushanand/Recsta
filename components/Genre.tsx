import { useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  Text,
  View,
  useWindowDimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import { GENRES, GenreItem } from "../constants/genres";

const MIN_SELECTION = 3;
const NUM_COLUMNS = 2;
const CARD_GAP = 12;
const HORIZONTAL_PADDING = 20;

interface GenreProps {
  onConfirm?: () => void;
}

export default function Genre({ onConfirm }: GenreProps) {
  const { width: screenWidth } = useWindowDimensions();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const cardWidth =
    (screenWidth - HORIZONTAL_PADDING * 2 - CARD_GAP * (NUM_COLUMNS - 1)) /
    NUM_COLUMNS;
  const cardHeight = cardWidth * 0.7;

  const toggleGenre = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleConfirm = () => {
    if (selected.size < MIN_SELECTION) {
      Alert.alert(
        "Not enough genres",
        `Please select at least ${MIN_SELECTION} genres to continue.`
      );
      return;
    }
    console.log("Selected genres:", Array.from(selected));
    if (onConfirm) onConfirm();
  };

  const canConfirm = selected.size >= MIN_SELECTION;

  const renderGenreCard = ({ item }: { item: GenreItem }) => {
    const isSelected = selected.has(item.id);

    return (
      <Pressable
        onPress={() => toggleGenre(item.id)}
        className="relative overflow-hidden rounded-2xl"
        style={{ width: cardWidth, height: cardHeight }}
      >
        <Image
          source={item.image}
          className="absolute inset-0 h-full w-full"
          style={{ opacity: isSelected ? 0.45 : 0.75 }}
          resizeMode="cover"
        />

        <LinearGradient
          colors={[
            "transparent",
            isSelected ? "rgba(139,92,246,0.6)" : "rgba(0,0,0,0.7)",
          ]}
          className="absolute inset-0"
        />

        {isSelected && (
          <View className="absolute inset-0 rounded-2xl border-2 border-violet-500" />
        )}

        {isSelected && (
          <View className="absolute right-2.5 top-2.5 h-[26px] w-[26px] items-center justify-center rounded-full bg-violet-500">
            <Text className="text-sm font-bold text-white">✓</Text>
          </View>
        )}

        <View className="absolute bottom-0 inset-x-0 px-3.5 pb-3">
          <Text
            className={`text-base font-bold tracking-[0.3px] ${
              isSelected ? "text-violet-300" : "text-white"
            }`}
          >
            {item.label}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-row items-center justify-between px-5 pb-2 pt-4">
        <View className="flex-1">
          <Text className="text-[28px] font-extrabold tracking-[0.3px] text-white">
            What do you love?
          </Text>
          <Text className="mt-1 text-sm text-white/50">
            Select at least {MIN_SELECTION} to get started
          </Text>
        </View>

        <Pressable
          onPress={handleConfirm}
          className={`ml-4 h-12 w-12 items-center justify-center rounded-full ${
            canConfirm
              ? "bg-violet-500"
              : "border border-white/10 bg-white/10"
          }`}
        >
          <Text
            className={`text-[22px] font-bold ${
              canConfirm ? "text-white" : "text-white/25"
            }`}
          >
            ✓
          </Text>
        </Pressable>
      </View>

      <View className="px-5 pb-3 pt-1">
        <View className="self-start rounded-full border border-violet-500/30 bg-violet-500/15 px-3.5 py-[5px]">
          <Text className="text-[13px] font-semibold text-violet-400">
            {selected.size} selected
          </Text>
        </View>
      </View>

      <FlatList
        data={GENRES}
        keyExtractor={(item) => item.id}
        numColumns={NUM_COLUMNS}
        contentContainerClassName="px-5 pb-8"
        columnWrapperClassName="mb-3 justify-between"
        showsVerticalScrollIndicator={false}
        renderItem={renderGenreCard}
      />
    </SafeAreaView>
  );
}