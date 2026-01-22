import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { COLORS, SPACING } from "../theme";

export default function CategoryPill({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.pill, active && styles.active]}>
      <Text style={[styles.text, active && styles.activeText]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SPACING.sm,
    maxWidth: 240,
  },
  active: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  text: { color: COLORS.text, fontWeight: "800" },
  activeText: { color: "#fff" },
});
