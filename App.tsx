import "./global.css";

import { useEffect, useState, useCallback, useRef } from "react";
import { BackHandler, View, ActivityIndicator, ToastAndroid, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import MainScreen from "components/MainScreen";

import GetStarted from "components/GetStarted";
import Genre from "components/Genre";

import { supabase } from "./lib/supabase";
import { ensureProfile } from "./lib/profile";
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
    supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setAuthInitialized(true);
      if (initialSession?.user) {
        // Ensure profile exists in DB (handles first login)
        ensureProfile(initialSession.user).catch(() => {});
        // Auto-route if already signed in
        setCurrentScreen("main");
      }
      if (initialSession) console.log("[App] initial session", initialSession.user.email);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("[App] auth event", event, newSession?.user?.email);
      setSession(newSession);

      if (event === "SIGNED_IN" && newSession?.user) {
        await ensureProfile(newSession.user).catch(() => {});
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

  // Handle back button - genre is onboarding, main should exit (not go to genre)
  const lastBackPress = useRef(0);
  useEffect(() => {
    const backAction = () => {
      if (currentScreen === "genre") {
        // Genre only shown right after login - don't go back to login if signed in
        if (session) {
          return false; // system back -> exit app
        }
        setCurrentScreen("get-started");
        return true;
      } else if (currentScreen === "main") {
        // Home/Messages/Profile are top-level - back should exit, not go to genre selector
        // Profile's own BackHandler (if subScreen open) will intercept first and pop its stack
        if (Platform.OS === "android") {
          const now = Date.now();
          if (now - lastBackPress.current < 2000) {
            BackHandler.exitApp();
            return true;
          }
          ToastAndroid.show("Press back again to exit", ToastAndroid.SHORT);
          lastBackPress.current = now;
          return true;
        }
        return false;
      }
      // get-started or other - let system handle (exit)
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
