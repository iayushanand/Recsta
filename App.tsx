import "./global.css";

import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import GetStarted from "components/GetStarted";
import Genre from "components/Genre";

import { supabase } from "./lib/supabase";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<"get-started" | "genre">("get-started");

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        console.log(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <SafeAreaProvider>
      {currentScreen === "get-started" ? (
        <GetStarted onGetStarted={() => setCurrentScreen("genre")} />
      ) : (
        <Genre />
      )}
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}