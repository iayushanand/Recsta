import "./global.css";

import { useEffect, useState, useCallback } from "react";
import { BackHandler, View, ActivityIndicator } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import MainScreen from "components/MainScreen";

import GetStarted from "components/GetStarted";
import Genre from "components/Genre";

import { supabase } from "./lib/supabase";
import type { Session } from "@supabase/supabase-js";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<"get-started" | "genre" | "main">("get-started");
  const [fontsLoaded] = useFonts(Ionicons.font);
  const [session, setSession] = useState<Session | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  const isReady = fontsLoaded && authInitialized;

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  // Initialize Supabase session and subscribe to auth changes
  useEffect(() => {
    // Get initial session (handles app cold start with persisted session)
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setAuthInitialized(true);
      // Auto-route if already signed in
      if (initialSession) {
        // If user already has a session, skip onboarding
        // You can change this to "genre" if you want first-time users to pick genres
        setCurrentScreen("main");
      }
      if (initialSession) console.log("[App] initial session", initialSession.user.email);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("[App] auth event", event, newSession?.user?.email);
      setSession(newSession);

      if (event === "SIGNED_IN" && newSession) {
        // After native Google sign-in, move to genre step
        // If currentScreen is still onboarding, advance to genre
        setCurrentScreen((prev) => (prev === "get-started" ? "genre" : prev));
      }
      if (event === "SIGNED_OUT") {
        setCurrentScreen("get-started");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handle back button with auth awareness
  useEffect(() => {
    const backAction = () => {
      if (currentScreen === "genre") {
        // If signed in, back from genre should NOT go to get-started (logout would be needed)
        // Allow back only if not signed in
        if (session) {
          return false; // let system handle or stay
        }
        setCurrentScreen("get-started");
        return true;
      } else if (currentScreen === "main") {
        setCurrentScreen("genre");
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [currentScreen, session]);

  const handleGetStarted = useCallback(() => {
    setCurrentScreen("genre");
  }, []);

  const handleGenreConfirm = useCallback(() => {
    setCurrentScreen("main");
  }, []);

  // Optional: allow logout to reset navigation (passed to MainScreen if needed)
  const handleSignOut = useCallback(() => {
    setCurrentScreen("get-started");
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="#3b82f6" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      {currentScreen === "get-started" && (
        <GetStarted onGetStarted={handleGetStarted} />
      )}
      {currentScreen === "genre" && (
        <Genre onConfirm={handleGenreConfirm} />
      )}
      {currentScreen === "main" && (
        <MainScreen onSignOut={handleSignOut} session={session} />
      )}
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
