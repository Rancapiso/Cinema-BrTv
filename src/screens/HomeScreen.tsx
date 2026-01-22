import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, FlatList, ScrollView, Pressable, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { COLORS, SPACING } from "../theme";
import { lockLandscape } from "../utils/orientation";
import { clearCreds, loadCreds } from "../services/storage";
import { getLiveCategories, getLiveStreams } from "../services/xtream";
import { LiveCategory, LiveStream } from "../types";
import CategoryPill from "../components/CategoryPill";
import StreamCard from "../components/StreamCard";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const [credsOk, setCredsOk] = useState(false);
  const [categories, setCategories] = useState<LiveCategory[]>([]);
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [activeCat, setActiveCat] = useState<string>("");

  useEffect(() => { lockLandscape(); }, []);

  useEffect(() => {
    (async () => {
      const creds = await loadCreds();
      if (!creds) {
        navigation.replace("Login");
        return;
      }
      setCredsOk(true);
      try {
        const [cats, str] = await Promise.all([getLiveCategories(creds), getLiveStreams(creds)]);
        setCategories(cats);
        setStreams(str);
        setActiveCat(cats?.[0]?.category_id || "");
      } catch {
        Alert.alert("Erro", "Não foi possível carregar categorias/canais. Verifique o servidor.");
      }
    })();
  }, [navigation]);

  const filtered = useMemo(() => {
    if (!activeCat) return streams;
    return streams.filter(s => String(s.category_id || "") === String(activeCat));
  }, [streams, activeCat]);

  async function logout() {
    await clearCreds();
    navigation.replace("Login");
  }

  return (
    <View style={styles.container}>
      <View style={styles.topbar}>
        <Text style={styles.brand}>Cinema BRtv</Text>

        <View style={{ flexDirection: "row" }}>
          <Pressable onPress={() => navigation.navigate("Settings")} style={styles.smallBtn}>
            <Text style={styles.smallBtnText}>Config</Text>
          </Pressable>
          <Pressable onPress={logout} style={[styles.smallBtn, { marginLeft: SPACING.sm }]}>
            <Text style={styles.smallBtnText}>Sair</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catRow} contentContainerStyle={{ paddingRight: SPACING.lg }}>
        {categories.map((c) => (
          <CategoryPill key={c.category_id} label={c.category_name} active={c.category_id === activeCat} onPress={() => setActiveCat(c.category_id)} />
        ))}
      </ScrollView>

      <Text style={styles.section}>Canais</Text>

      <FlatList
        data={filtered}
        horizontal
        keyExtractor={(item) => String(item.stream_id)}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: SPACING.lg }}
        renderItem={({ item }) => (
          <StreamCard
            title={item.name}
            icon={item.stream_icon}
            onPress={() => navigation.navigate("Player", { streamId: item.stream_id, title: item.name })}
          />
        )}
        ListEmptyComponent={() => (
          <Text style={{ color: COLORS.muted }}>Nenhum canal nesta categoria.</Text>
        )}
      />

      {!credsOk && <Text style={{ color: COLORS.muted }}>Carregando...</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.lg },
  topbar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  brand: { color: COLORS.primary, fontSize: 30, fontWeight: "900" },
  smallBtn: { paddingHorizontal: 14, paddingVertical: 10, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 999, borderWidth: 1, borderColor: COLORS.border },
  smallBtnText: { color: COLORS.text, fontWeight: "800" },
  catRow: { marginTop: SPACING.md, marginBottom: SPACING.md },
  section: { color: COLORS.text, fontSize: 16, fontWeight: "900", marginVertical: SPACING.md },
});
