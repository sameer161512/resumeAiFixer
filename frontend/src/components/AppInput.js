import React, { useMemo } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import spacing from "../theme/spacing";
import { useTheme } from "../theme/ThemeContext";

export default function AppInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType = "default",
  autoCapitalize = "none",
  error,
}) {
  const { colors, mode } = useTheme();
  const styles = useMemo(() => makeStyles(colors, mode), [colors, mode]);

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View style={[styles.inputShell, error ? styles.inputShellError : null]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          style={styles.input}
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const makeStyles = (colors, mode) =>
  StyleSheet.create({
    wrapper: {
      marginBottom: spacing.lg,
    },

    label: {
      color: colors.mutedText,
      marginBottom: 8,
      fontSize: 13,
      fontWeight: "600",
      letterSpacing: 0.3,
    },

    inputShell: {
      minHeight: 58,
      borderRadius: 18,
      paddingHorizontal: 16,
      justifyContent: "center",
      backgroundColor: mode === "dark" ? "rgba(255,255,255,0.04)" : colors.subtle,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: mode === "dark" ? 0.12 : 0.04,
      shadowRadius: 18,
      elevation: mode === "dark" ? 2 : 1,
    },

    inputShellError: {
      borderColor: colors.danger,
    },

    input: {
      color: colors.text,
      fontSize: 14,
    },

    error: {
      marginTop: 7,
      color: colors.danger,
      fontSize: 12,
      fontWeight: "500",
      paddingLeft: 2,
    },
  });