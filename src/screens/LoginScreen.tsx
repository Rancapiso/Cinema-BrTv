import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { COLORS, SPACING, RADIUS } from "../theme";
import { lockLandscape } from "../utils/orientation";
import { buildCreds, testLogin } from "../services/xtream";
import { saveCreds, loadCreds } from "../services/storage";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [host, setHost] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [output, setOutput] = useState<"m3u8" | "ts">("m3u8");
  const [loading, setLoading] = useState(false);

  useEffect(() => { lockLandscape(); }, []);

  useEffect(() => {
    (async () => {
      const c = await loadCreds();
      if (c) {
        setHost(c.host);
        setUsername(c.username);
        setPassword(c.password);
        setOutput(c.output || "m3u8");
      }
    })();
  }, []);

  async function onLogin() {
    if (!host || !username || !password) {
      Alert.alert("Atenção", "Preencha URL/Host, usuário e senha.");
      return;
    }
    setLoading(true);
    try {
      const creds = buildCreds(host, username, password, output);
      await testLogin(creds);
      await saveCreds(creds);
      navigation.replace("Home");
    } catch (e: any) {
      Alert.alert("Login", "Falha ao autenticar. Verifique URL/Host, usuário e senha.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>Cinema BRtv</Text>
      <Text style={styles.subtitle}>Login tipo Xtream (URL + usuário + senha)</Text>

      <TextInput
        value={host}
        onChangeText={setHost}
        placeholder="Host (ex: http://servidor:8080)"
        placeholderTextColor={COLORS.muted}
        style={styles.input}
        autoCapitalize="none"
      />
      <View style={styles.row}>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Usuário"
          placeholderTextColor={COLORS.muted}
          style={[styles.input, styles.flex]}
          autoCapitalize="none"
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Senha"
          placeholderTextColor={COLORS.muted}
          style={[styles.input, styles.flex, { marginLeft: SPACING.sm }]}
          secureTextEntry
          autoCapitalize="none"
        />
      </View>

      <View style={styles.row}>
        <Pressable onPress={() => setOutput("m3u8")} style={[styles.chip, output === "m3u8" && styles.chipActive]}>
          <Text style={[styles.chipText, output === "m3u8" && styles.chipTextActive]}>m3u8</Text>
        </Pressable>
        <Pressable onPress={() => setOutput("ts")} style={[styles.chip, output === "ts" && styles.chipActive]}>
          <Text style={[styles.chipText, output === "ts" && styles.chipTextActive]}>ts</Text>
        </Pressable>
        <Text style={styles.hint}>Dica: Expo costuma tocar melhor m3u8.</Text>
      </View>

      <Pressable onPress={onLogin} disabled={loading} style={({ pressed }) => [styles.btn, { opacity: pressed || loading ? 0.85 : 1 }]}>
        <Text style={styles.btnText}>{loading ? "Entrando..." : "Entrar"}</Text>
      </Pressable>

      <Text style={styles.legal}>
        Use apenas listas/servidores que você tenha direito de reproduzir.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.xl, justifyContent: "center" },
  brand: { color: COLORS.primary, fontSize: 34, fontWeight: "900", marginBottom: SPACING.sm },
  subtitle: { color: COLORS.muted, marginBottom: SPACING.lg },
  row: { flexDirection: "row", alignItems: "center" },
  flex: { flex: 1 },
  input: {
    backgroundColor: COLORS.surface,
    color: COLORS.text,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
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
  hint: { color: COLORS.muted, marginLeft: SPACING.sm, flex: 1 },
  btn: { backgroundColor: COLORS.primary, padding: SPACING.md, borderRadius: RADIUS.card, alignItems: "center", marginTop: SPACING.sm },
  btnText: { color: "#fff", fontWeight: "900", fontSize: 16 },
  legal: { color: COLORS.muted, marginTop: SPACING.lg, fontSize: 12 },
});
