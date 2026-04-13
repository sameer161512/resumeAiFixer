import React, { useMemo } from "react";
import { Pressable, Text, StyleSheet, ActivityIndicator, View } from "react-native";
import spacing from "../theme/spacing";
import { useTheme } from "../theme/ThemeContext";

export default function AppButton({ title, onPress, loading, disabled }) {
  const { colors, mode } = useTheme();
  const styles = useMemo(() => makeStyles(colors, mode), [colors, mode]);

  const isDisabled = disabled || loading;

  return (
    <View style={styles.wrap}>
      <View style={styles.glow} />

      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        style={({ pressed }) => [
          styles.button,
          isDisabled && styles.disabled,
          pressed && styles.pressed,
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.title}>{title}</Text>
        )}
      </Pressable>
    </View>
  );
}

const makeStyles = (colors, mode) =>
  StyleSheet.create({
    wrap: {
      marginTop: spacing.sm,
      position: "relative",
    },

    glow: {
      position: "absolute",
      top: 8,
      left: 12,
      right: 12,
      bottom: -2,
      borderRadius: 22,
      backgroundColor: colors.primary,
      opacity: mode === "dark" ? 0.22 : 0.10,
    },

    button: {
      height: 58,
      borderRadius: 20,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: mode === "dark" ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.18)",

      shadowColor: "#000",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: mode === "dark" ? 0.22 : 0.10,
      shadowRadius: 20,
      elevation: 5,
    },

    title: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "800",
      letterSpacing: 0.2,
    },

    pressed: {
      transform: [{ scale: 0.985 }],
      opacity: 0.96,
    },

    disabled: {
      opacity: 0.55,
    },
  });