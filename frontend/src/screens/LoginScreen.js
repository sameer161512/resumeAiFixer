import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";
import { useTheme } from "../theme/ThemeContext";
import Icon from "react-native-vector-icons/Ionicons";
import { loginApi } from "../config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LinearGradient from "react-native-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { Animated } from "react-native";
import { useEffect, useRef } from "react";

export default function LoginScreen({ navigation }) {
  const { colors, mode } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(colors, mode), [colors, mode]);

  const settingsTop = insets.top + 6;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const glowAnim = useRef(new Animated.Value(0)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    Animated.loop(
      Animated.timing(borderAnim, {
        toValue: 1,
        duration: 6000,
        useNativeDriver: false,
      })
    ).start();
  }, []);

  function validate() {
    const nextErrors = {};
    const mail = email.trim();
    const pass = (password || "").trim();

    if (!mail) nextErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail))
      nextErrors.email = "Enter a valid email";

    if (!pass) nextErrors.password = "Password is required";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function onLogin() {
    if (loading) return;
    if (!validate()) return;

    setLoading(true);

    try {
      const { token, user } = await loginApi({
        email: email.trim(),
        password,
      });

      await AsyncStorage.setItem("TOKEN", token);
      await AsyncStorage.setItem("USER", JSON.stringify(user));

      setLoading(false);
      navigation.reset({
        index: 0,
        routes: [{ name: "Dashboard" }],
      });
    } catch (e) {
      setLoading(false);

      const msg =
        e?.message === "Invalid credentials"
          ? "Wrong email or password."
          : e?.message || "Please try again.";

      Alert.alert("Login failed", msg);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable
          onPress={() => navigation.navigate("Settings")}
          style={[styles.settingsBtn, { top: settingsTop }]}
        >
          <Icon name="settings-outline" size={20} color={colors.text} />
        </Pressable>

        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
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
            <View style={styles.aiChip}>
              <Text style={styles.aiChipText}>AI Resume Assistant</Text>
            </View>

            <Text style={styles.brand}>ResumeAIFixer</Text>

            <MaskedView
              maskElement={
                <Text style={styles.heading}>
                  Fix your resume {"\n"}with precision
                </Text>
              }
            >
              <Animated.View
                style={{
                  borderRadius: 30,
                  transform: [
                    {
                      translateX: borderAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-2, 2],
                      }),
                    },
                  ],
                }}
              >
                <LinearGradient
                  colors={["#A5B4FC", "#6366F1", "#4F46E5"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={[styles.heading, { opacity: 0 }]}>
                    Fix your resume {"\n"}with precision
                  </Text>
                </LinearGradient>
              </Animated.View>
            </MaskedView>

            <View style={styles.featureRow}>
              <View style={styles.featureChip}>
                <Text style={styles.featureText}>ATS Optimized</Text>
              </View>

              <View style={styles.featureChip}>
                <Text style={styles.featureText}>AI Powered</Text>
              </View>

              <View style={styles.featureChip}>
                <Text style={styles.featureText}>Better Formatting</Text>
              </View>
            </View>
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
                <Text style={styles.cardTitle}>Login To Continue</Text>

                <AppInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email}
                />

                <View style={styles.passwordWrap}>
                  <AppInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    secureTextEntry={!showPassword}
                    error={errors.password}
                  />

                  <Pressable
                    onPress={() => setShowPassword((prev) => !prev)}
                    style={styles.eyeButton}
                  >
                    <Icon
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color={colors.mutedText}
                    />
                  </Pressable>
                </View>

                <Pressable
                  onPress={() => navigation.navigate("ForgotPassword")}
                  style={styles.forgot}
                >
                  <Text style={styles.forgotText}>Forgot password?</Text>
                </Pressable>

                <AppButton title="Login" onPress={onLogin} loading={loading} />

                <View style={styles.signupRow}>
                  <Text style={styles.signupText}>New here?</Text>

                  <Pressable onPress={() => navigation.navigate("Signup")}>
                    <Text style={styles.signupLink}> Create account</Text>
                  </Pressable>
                </View>
              </View>
            </LinearGradient>
          </View>
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
      paddingHorizontal: 22,
      paddingTop: 40,
      paddingBottom: 30,
    },

    settingsBtn: {
      position: "absolute",
      right: 20,
      zIndex: 20,
      width: 44,
      height: 44,
      borderRadius: 16,
      backgroundColor: colors.card,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.border,

      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.12,
      shadowRadius: 20,
      elevation: 6,
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
      opacity: 0.07,
    },

    aiChip: {
      alignSelf: "flex-start",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      backgroundColor: colors.subtle,
      marginBottom: 16,
    },

    aiChipText: {
      color: colors.primary,
      fontWeight: "700",
      fontSize: 12,
    },

    brand: {
      color: colors.mutedText,
      fontSize: 14,
      marginBottom: 10,
    },

    heading: {
      fontSize: 40,
      fontWeight: "800",
      lineHeight: 44,
      letterSpacing: -1,
    },

    featureRow: {
      flexDirection: "row",
      marginTop: 8,
      flexWrap: "wrap",
    },

    featureChip: {
      backgroundColor: colors.subtle,
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      marginRight: 10,
      marginBottom: 10,
    },

    featureText: {
      color: colors.text,
      fontSize: 12,
      fontWeight: "600",
    },

    cardBorderWrap: {
      borderRadius: 30,
      marginTop: 8,
    },

    cardBorder: {
      borderRadius: 30,
      padding: 1.2,
    },

    card: {
      backgroundColor: colors.card,
      borderRadius: 29,
      padding: 22,
      borderWidth: 1,
      borderColor: mode === "dark" ? "rgba(255,255,255,0.04)" : colors.border,

      shadowColor: "#000",
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: mode === "dark" ? 0.18 : 0.08,
      shadowRadius: 40,
      elevation: 8,
    },

    cardTitle: {
      color: colors.text,
      fontSize: 22,
      fontWeight: "800",
      marginBottom: 14,
    },

    passwordWrap: {
      position: "relative",
    },

    eyeButton: {
      position: "absolute",
      right: 14,
      top: 22,
      zIndex: 10,
    },

    forgot: {
      alignItems: "flex-end",
      marginBottom: 5,
    },

    forgotText: {
      color: colors.primary,
      fontSize: 13,
      fontWeight: "700",
    },

    signupRow: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 18,
    },

    signupText: {
      color: colors.mutedText,
    },

    signupLink: {
      color: colors.primary,
      fontWeight: "700",
    },
  });