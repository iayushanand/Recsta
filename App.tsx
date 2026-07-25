import "./global.css";

import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import GetStarted from "components/GetStarted";
import { supabase } from "./lib/supabase";

export default function App() {
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
      <GetStarted />
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}