import { Image, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ImageSourcePropType } from "react-native";
import { ReactNode } from "react";

interface BackgroundImageProps {
  image: ImageSourcePropType;
  title: string;
  description: string;
  children?: ReactNode;
}

const POSTER_ASPECT_RATIO = 2 / 3;
const EDGE_FADE = 40;

export default function BackgroundImage({
  image,
  title,
  description,
  children,
}: BackgroundImageProps) {
  const { width: screenWidth } = useWindowDimensions();
  const posterWidth = screenWidth * 0.82;
  const posterHeight = posterWidth / POSTER_ASPECT_RATIO;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.posterWrapper,
          {
            width: posterWidth,
            height: posterHeight,
          },
        ]}
      >
        <Image
          source={image}
          resizeMode="cover"
          style={[
            styles.posterImage,
            {
              width: posterWidth,
              height: posterHeight,
              opacity: 0.75,
            },
          ]}
        />

        <LinearGradient
          colors={["#000", "transparent"]}
          style={[styles.edgeFadeTop, { height: EDGE_FADE }]}
        />

        <LinearGradient
          colors={["#000", "transparent"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[styles.edgeFadeLeft, { width: EDGE_FADE }]}
        />

        <LinearGradient
          colors={["transparent", "#000"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[styles.edgeFadeRight, { width: EDGE_FADE }]}
        />

        <LinearGradient
          colors={[
            "transparent",
            "rgba(0,0,0,0.3)",
            "rgba(0,0,0,0.75)",
            "#000",
          ]}
          locations={[0, 0.35, 0.65, 1]}
          style={styles.bottomFade}
        />

        <View style={styles.textOverlay}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          {children && <View style={styles.childrenWrapper}>{children}</View>}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 36,
    paddingBottom: 16,
  },
  posterWrapper: {
    overflow: "hidden",
  },
  posterImage: {},
  edgeFadeTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  edgeFadeLeft: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
  },
  edgeFadeRight: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
  },
  bottomFade: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
  },
  textOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  description: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginTop: 10,
  },
  childrenWrapper: {
    marginTop: 20,
  },
});