import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import spacing from "../theme/spacing";
import ScreenHeader from "../components/ScreenHeader";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";
import { useTheme } from "../theme/ThemeContext";
import { verifyForgotOtpApi } from "../config/api";
import LinearGradient from "react-native-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";

export default function ForgotOtpScreen({ navigation, route }) {
  const { colors, mode } = useTheme();
  const styles = useMemo(() => makeStyles(colors, mode), [colors, mode]);

  const email = route?.params?.email || "";
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const otpInputRef = useRef(null);

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

  async function onVerify() {
    const code = otp.trim();
    if (!code) {
      Alert.alert("OTP required", "Enter the OTP you received on email.");
      return;
    }

    setLoading(true);
    try {
      const res = await verifyForgotOtpApi({ email, otp: code });
      setLoading(false);

      // go to reset password screen with resetToken
      navigation.replace("ResetPassword", { email, resetToken: res.resetToken });
    } catch (e) {
      setLoading(false);
      Alert.alert("Verification failed", e?.message || "Please try again.");
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <KeyboardAvoidingView style={styles.safe} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.container}>
          <ScreenHeader title="Verify OTP" onBack={() => navigation.goBack()} />

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: spacing.xl }}
          >
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
                    Enter Verification {"\n"}Code
                  </Text>
                }
              >
                <LinearGradient
                  colors={["#A5B4FC", "#6366F1", "#4F46E5"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={[styles.heading, { opacity: 0 }]}>
                    Enter verification {"\n"}code
                  </Text>
                </LinearGradient>
              </MaskedView>

              <Text style={styles.subheading}>
                We sent a code to{" "}
                <Text style={{ fontWeight: "800", color: colors.text }}>
                  {email}
                </Text>
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
                  <View style={styles.otpSection}>
                    <Text style={styles.otpLabel}>Verification code</Text>

                    <Pressable onPress={() => otpInputRef.current?.focus()}>
                      <View style={styles.otpRow}>
                        {[0, 1, 2, 3, 4, 5].map((i) => {
                          const char = otp[i] || "";
                          return (
                            <View
                              key={i}
                              style={[
                                styles.otpBox,
                                otp.length === i && styles.otpBoxActive,
                              ]}
                            >
                              <Text style={styles.otpChar}>{char}</Text>
                            </View>
                          );
                        })}
                      </View>
                    </Pressable>

                    <TextInput
                      ref={otpInputRef}
                      value={otp}
                      onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, "").slice(0, 6))}
                      keyboardType="number-pad"
                      returnKeyType="done"
                      onSubmitEditing={onVerify}
                      style={styles.hiddenOtpInput}
                      autoFocus
                      maxLength={6}
                    />
                  </View>

                  <AppButton title="Verify OTP" onPress={onVerify} loading={loading} />
                </View>
              </LinearGradient>
            </View>
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
      marginTop: 18,
    },

    cardBorder: {
      borderRadius: 30,
      padding: 1.2,
    },
    card: { backgroundColor: colors.card, borderRadius: 20, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },

    otpSection: {
      marginBottom: spacing.md,
    },

    otpLabel: {
      color: colors.mutedText,
      marginBottom: 10,
      fontSize: 13,
      fontWeight: "600",
      letterSpacing: 0.3,
    },

    otpRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 8,
    },

    otpBox: {
      flex: 1,
      height: 58,
      borderRadius: 18,
      backgroundColor: mode === "dark" ? "rgba(255,255,255,0.04)" : colors.subtle,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",

      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: mode === "dark" ? 0.12 : 0.04,
      shadowRadius: 18,
      elevation: mode === "dark" ? 2 : 1,
    },

    otpChar: {
      color: colors.text,
      fontSize: 22,
      fontWeight: "800",
    },

    hiddenOtpInput: {
      position: "absolute",
      opacity: 0,
      width: 1,
      height: 1,
    },

    otpBoxActive: {
      borderColor: colors.primary,
    },
  });