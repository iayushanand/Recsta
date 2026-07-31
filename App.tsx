import "./global.css";

import { useEffect, useState } from "react";
import { BackHandler } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import MainScreen from "components/MainScreen";

import GetStarted from "components/GetStarted";
import Genre from "components/Genre";
import HomePage from "components/Home";

import { supabase } from "./lib/supabase";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<"get-started" | "genre" | "main">("get-started");

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

  useEffect(() => {
    const backAction = () => {
      if (currentScreen === "genre") {
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
  }, [currentScreen]);

  return (
    <SafeAreaProvider>
      {currentScreen === "get-started" && (
        <GetStarted onGetStarted={() => setCurrentScreen("genre")} />
      )}
      {currentScreen === "genre" && (
        <Genre onConfirm={() => setCurrentScreen("main")} />
      )}
      {currentScreen === "main" && (
        <MainScreen />
      )}
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}