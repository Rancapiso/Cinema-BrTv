import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { COLORS, SPACING, RADIUS } from "../theme";
import { lockLandscape } from "../utils/orientation";
import { loadCreds, saveCreds } from "../services/storage";

export default function SettingsScreen({ navigation }: any) {
  const [output, setOutput] = useState<"m3u8" | "ts">("m3u8");

  useEffect(() => { lockLandscape(); }, []);

  useEffect(() => {
    (async () => {
      const c = await loadCreds();
      if (c?.output) setOutput(c.output);
    })();
  }, []);

  async function save() {
    const c = await loadCreds();
    if (!c) return;
    await saveCreds({ ...c, output });
    Alert.alert("OK", "Formato de playback salvo.");
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>
      <Text style={styles.label}>Formato de Playback</Text>

      <View style={{ flexDirection: "row", marginBottom: SPACING.md }}>
        <Pressable onPress={() => setOutput("m3u8")} style={[styles.chip, output === "m3u8" && styles.chipActive]}>
          <Text style={[styles.chipText, output === "m3u8" && styles.chipTextActive]}>m3u8</Text>
        </Pressable>
        <Pressable onPress={() => setOutput("ts")} style={[styles.chip, output === "ts" && styles.chipActive]}>
          <Text style={[styles.chipText, output === "ts" && styles.chipTextActive]}>ts</Text>
        </Pressable>
      </View>

      <Pressable onPress={save} style={styles.btn}>
        <Text style={styles.btnText}>Salvar</Text>
      </Pressable>

      <Text style={styles.hint}>
        Futuramente você pode integrar um painel administrativo próprio para validar planos, trial e bloqueios,
        mas este app já funciona sem painel, usando apenas as credenciais do servidor (Xtream).
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.xl, justifyContent: "center" },
  title: { color: COLORS.text, fontSize: 26, fontWeight: "900", marginBottom: SPACING.lg },
  label: { color: COLORS.muted, marginBottom: SPACING.sm },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SPACING.sm,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { color: COLORS.text, fontWeight: "900" },
  chipTextActive: { color: "#fff" },
  btn: { backgroundColor: COLORS.primary, padding: SPACING.md, borderRadius: RADIUS.card, alignItems: "center", marginTop: SPACING.sm },
  btnText: { color: "#fff", fontWeight: "900", fontSize: 16 },
  hint: { color: COLORS.muted, marginTop: SPACING.lg, fontSize: 12, lineHeight: 16 },
});
