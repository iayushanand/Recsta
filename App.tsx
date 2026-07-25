import "./global.css";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import GetStarted from "components/GetStarted";

export default function App() {
  return (
    <SafeAreaProvider>
      <GetStarted />
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}