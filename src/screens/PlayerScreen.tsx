import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { COLORS, SPACING } from "../theme";
import { lockLandscape } from "../utils/orientation";
import { loadCreds } from "../services/storage";
import { buildLivePlaybackUrl } from "../services/xtream";
import { Video, AVPlaybackStatus } from "expo-av";

type Props = NativeStackScreenProps<RootStackParamList, "Player">;

export default function PlayerScreen({ route, navigation }: Props) {
  const { streamId, title } = route.params;

  const videoRef = useRef<Video>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [errorCount, setErrorCount] = useState(0);

  useEffect(() => { lockLandscape(); }, []);

  useEffect(() => {
    (async () => {
      const creds = await loadCreds();
      if (!creds) {
        navigation.replace("Login");
        return;
      }
      setUrl(buildLivePlaybackUrl(creds, streamId));
    })();
  }, [navigation, streamId]);

  async function onStatus(status: AVPlaybackStatus) {
    if (!status.isLoaded) {
      // tenta recarregar algumas vezes
      if (errorCount < 2) {
        setErrorCount((c) => c + 1);
        try {
          await videoRef.current?.unloadAsync();
          if (url) await videoRef.current?.loadAsync({ uri: url }, { shouldPlay: true });
        } catch {}
      }
      return;
    }

    // Se buffering recorrente, apenas mostramos um indicador.
    // Troca automática de qualidade depende do servidor fornecer urls alternativas (HLS multi-bitrate).
  }

  if (!url) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.btn}>
          <Text style={styles.btnText}>Voltar</Text>
        </Pressable>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
      </View>

      <Video
        ref={videoRef}
        style={styles.video}
        source={{ uri: url }}
        useNativeControls
        resizeMode="contain"
        shouldPlay
        onPlaybackStatusUpdate={onStatus}
        onError={() => {
          Alert.alert("Player", "Não foi possível reproduzir este canal. Tente mudar o formato (m3u8/ts) em Config.");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  btn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.08)" },
  btnText: { color: COLORS.text, fontWeight: "900" },
  title: { color: COLORS.text, marginLeft: SPACING.md, fontWeight: "900", flex: 1 },
  video: { flex: 1 },
});
