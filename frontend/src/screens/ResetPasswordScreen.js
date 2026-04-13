import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import spacing from "../theme/spacing";
import ScreenHeader from "../components/ScreenHeader";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";
import { useTheme } from "../theme/ThemeContext";
import { resetPasswordApi } from "../config/api";
import LinearGradient from "react-native-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";

export default function ResetPasswordScreen({ navigation, route }) {
  const { colors, mode } = useTheme();
  const styles = useMemo(() => makeStyles(colors, mode), [colors, mode]);

  const email = route?.params?.email || "";
  const resetToken = route?.params?.resetToken || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 6000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 6000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  async function onReset() {
    const p1 = newPassword.trim();
    const p2 = confirmNewPassword.trim();

    if (!p1 || p1.length < 6) {
      Alert.alert("Invalid password", "Password must be at least 6 characters.");
      return;
    }
    if (p1 !== p2) {
      Alert.alert("Mismatch", "Passwords do not match.");
      return;
    }
    if (!resetToken) {
      Alert.alert("Error", "Reset token missing. Please restart forgot password.");
      return;
    }

    setLoading(true);
    try {
      const res = await resetPasswordApi({ resetToken, newPassword: p1 });
      setLoading(false);

      Alert.alert("Success", res.message || "Password updated. Please log in.", [
        { text: "OK", onPress: () => navigation.replace("Login", { email }) },
      ]);
    } catch (e) {
      setLoading(false);
      Alert.alert("Reset failed", e?.message || "Please try again.");
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <KeyboardAvoidingView style={styles.safe} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.container}>
          <ScreenHeader title="Password Reset" onBack={() => navigation.goBack()} />

          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View style={styles.hero}>
              <Animated.View
                style={[
                  styles.heroGlow,
                  {
                    transform: [
                      {
                        translateX: glowAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-30, 30],
                        }),
                      },
                    ],
                  },
                ]}
              />

              <Text style={styles.brand}>ResumeAIFixer</Text>

              <MaskedView
                maskElement={
                  <Text style={styles.heading}>
                    Create a New {"\n"}Password
                  </Text>
                }
              >
                <LinearGradient
                  colors={["#A5B4FC", "#6366F1", "#4F46E5"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={[styles.heading, { opacity: 0 }]}>
                    Create a new {"\n"}password
                  </Text>
                </LinearGradient>
              </MaskedView>

              <Text style={styles.subheading}>
                Set a strong new password for{" "}
                <Text style={{ fontWeight: "800", color: colors.text }}>{email}</Text>
              </Text>
            </View>

            <View style={styles.cardBorderWrap}>
              <LinearGradient
                colors={
                  mode === "dark"
                    ? ["rgba(99,102,241,0.45)", "rgba(168,85,247,0.15)", "rgba(255,255,255,0.04)"]
                    : ["rgba(99,102,241,0.22)", "rgba(168,85,247,0.10)", "rgba(255,255,255,0.85)"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardBorder}
              >
                <View style={styles.card}>
                  <AppInput
                    label="New Password"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="At least 6 characters"
                    secureTextEntry
                    returnKeyType="next"
                  />

                  <AppInput
                    label="Confirm New Password"
                    value={confirmNewPassword}
                    onChangeText={setConfirmNewPassword}
                    placeholder="Re-enter new password"
                    secureTextEntry
                    returnKeyType="done"
                    onSubmitEditing={onReset}
                  />

                  <AppButton title="Update Password" onPress={onReset} loading={loading} />
                </View>
              </LinearGradient>
            </View>

            <View style={{ height: spacing.xl }} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const makeStyles = (colors, mode) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    container: { flex: 1, backgroundColor: colors.bg, padding: spacing.md },
    heading: {
      fontSize: 40,
      fontWeight: "800",
      lineHeight: 44,
      letterSpacing: -1,
    },
    subheading: { color: colors.mutedText, marginTop: spacing.sm, marginBottom: spacing.lg, fontSize: 13, lineHeight: 18 },
    card: {
      backgroundColor: colors.card,
      borderRadius: 29,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: mode === "dark" ? "rgba(255,255,255,0.04)" : colors.border,

      shadowColor: "#000",
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: mode === "dark" ? 0.18 : 0.08,
      shadowRadius: 40,
      elevation: 8,
    },
    hero: {
      marginBottom: 28,
      position: "relative",
    },

    heroGlow: {
      position: "absolute",
      top: -120,
      left: -120,
      width: 360,
      height: 360,
      borderRadius: 360,
      backgroundColor: "#6366F1",
      opacity: 0.05,
    },

    brand: {
      color: colors.mutedText,
      fontSize: 14,
      marginBottom: 10,
    },

    cardBorderWrap: {
      borderRadius: 30,
      marginTop: 28,
    },

    cardBorder: {
      borderRadius: 30,
      padding: 1.2,
    },
  });