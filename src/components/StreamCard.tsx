import React from "react";
import { Pressable, Text, View, StyleSheet, Image } from "react-native";
import { COLORS, RADIUS, SPACING } from "../theme";

export default function StreamCard({
  title,
  icon,
  onPress,
}: {
  title: string;
  icon?: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, { opacity: pressed ? 0.85 : 1 }]}>
      {icon ? (
        <Image source={{ uri: icon }} style={styles.icon} resizeMode="contain" />
      ) : (
        <View style={styles.placeholder} />
      )}
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 210,
    height: 120,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SPACING.md,
    overflow: "hidden",
    padding: SPACING.md,
    justifyContent: "space-between",
  },
  icon: { width: "100%", height: 54, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.04)" },
  placeholder: { width: "100%", height: 54, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.06)" },
  title: { color: COLORS.text, fontSize: 14, fontWeight: "800" },
});
