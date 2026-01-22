import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import AppNavigator from "./src/navigation/AppNavigator";
import { lockLandscape } from "./src/utils/orientation";
import { loadCreds } from "./src/services/storage";

export default function App() {
  const [boot, setBoot] = useState<"loading" | "ready">("loading");

  useEffect(() => { lockLandscape(); }, []);
  useEffect(() => {
    (async () => {
      // apenas para garantir que SecureStore esteja OK
      await loadCreds();
      setBoot("ready");
    })();
  }, []);

  if (boot === "loading") return null;

  return (
    <>
      <AppNavigator />
      <StatusBar style="light" />
    </>
  );
}
