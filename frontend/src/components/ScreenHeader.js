import React, { useMemo } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import spacing from "../theme/spacing";
import { useTheme } from "../theme/ThemeContext";
import Icon from "react-native-vector-icons/Ionicons";

export default function ScreenHeader({ title, onBack }) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={onBack}
        hitSlop={10}
        style={({ pressed }) => [
          styles.backBtn,
          pressed && styles.pressed,
        ]}
      >
        <Icon name="chevron-back" size={20} color={colors.text} />
      </Pressable>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      <View style={styles.rightSpacer} />
    </View>
  );
}

const makeStyles = (colors) =>
  StyleSheet.create({
    wrap: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: spacing.lg,
      marginBottom: spacing.md,
      minHeight: 48,
    },

    backBtn: {
      width: 42,
      height: 42,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,

      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 3,
    },

    title: {
      flex: 1,
      textAlign: "center",
      color: colors.text,
      fontSize: 18,
      fontWeight: "800",
      letterSpacing: -0.3,
      marginHorizontal: spacing.md,
    },

    rightSpacer: {
      width: 42,
      height: 42,
    },

    pressed: {
      opacity: 0.7,
      transform: [{ scale: 0.98 }],
    },
  });