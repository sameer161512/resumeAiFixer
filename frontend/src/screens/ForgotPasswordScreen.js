import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import spacing from "../theme/spacing";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";
import { useTheme } from "../theme/ThemeContext";
import { forgotPasswordApi } from "../config/api";
import LinearGradient from "react-native-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";

export default function ForgotPasswordScreen({ navigation }) {
  const { colors, mode } = useTheme();
  const styles = useMemo(() => makeStyles(colors, mode), [colors, mode]);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

  function validate() {
    const nextErrors = {};
    const trimmed = email.trim();

    if (!trimmed) nextErrors.email = "Email is required";
    else if (!trimmed.includes("@")) nextErrors.email = "Enter a valid email";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function onSendLink() {
    if (!validate()) return;

    setLoading(true);

    try {
      await forgotPasswordApi(email.trim());

      setLoading(false);

      Alert.alert(
        "OTP Sent 📩",
        "If an account exists for this email, you'll receive an OTP.",
        [
          {
            text: "OK",
            onPress: () =>
              navigation.navigate("ForgotOtp", { email: email.trim() }),
          },
        ]
      );
    } catch (e) {
      setLoading(false);

      Alert.alert(
        "Error",
        e.message || "Something went wrong. Please try again."
      );
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={styles.safe}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
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
                  Reset Your {"\n"}Password
                </Text>
              }
            >
              <LinearGradient
                colors={["#A5B4FC", "#6366F1", "#4F46E5"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={[styles.heading, { opacity: 0 }]}>
                  Reset your {"\n"}password
                </Text>
              </LinearGradient>
            </MaskedView>

            <Text style={styles.subheading}>
              Enter your email and we’ll send you an OTP to securely reset your password.
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
                  label="Email"
                  value={email}
                  onChangeText={(t) => {
                    setEmail(t);
                    if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                  }}
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  autoCapitalize="none"
                  autoCorrect={false}
                  error={errors.email}
                  returnKeyType="done"
                  onSubmitEditing={onSendLink}
                />

                <AppButton
                  title="Send OTP"
                  onPress={onSendLink}
                  loading={loading}
                />

                <View style={styles.row}>
                  <Pressable onPress={() => navigation.replace("Login")}>
                    <Text style={styles.link}>Back to Login</Text>
                  </Pressable>
                </View>



              </View>
            </LinearGradient>
          </View>

          {/* bottom padding so content doesn’t hug the home indicator */}
          <View style={{ height: spacing.xl }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const makeStyles = (colors, mode) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    container: {
      flexGrow: 1,
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.xl,
      paddingBottom: spacing.xl,
    },
    brand: {
      color: colors.mutedText,
      fontSize: 14,
      letterSpacing: 1,
      marginBottom: spacing.sm,
    },
    heading: {
      color: colors.text,
      fontSize: 32,
      fontWeight: "800",
    },
    subheading: {
      color: colors.mutedText,
      marginTop: spacing.sm,
      marginBottom: spacing.lg,
      fontSize: 14,
      lineHeight: 20,
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

    cardBorderWrap: {
      borderRadius: 30,
      marginTop: 18,
    },

    cardBorder: {
      borderRadius: 30,
      padding: 1.2,
    },
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
    row: {
      alignItems: "center",
      marginTop: spacing.md,
    },
    link: {
      color: colors.primary,
      fontSize: 13,
      fontWeight: "700",
    },
    helper: {
      marginTop: spacing.lg,
      color: colors.mutedText,
      fontSize: 12,
      lineHeight: 18,
      textAlign: "center",
    },
  });