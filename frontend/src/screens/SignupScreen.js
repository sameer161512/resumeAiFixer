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
import { registerApi } from "../config/api";
import LinearGradient from "react-native-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import Icon from "react-native-vector-icons/Ionicons";

export default function SignupScreen({ navigation }) {
  const { colors, mode } = useTheme();
  const styles = useMemo(() => makeStyles(colors, mode), [colors, mode]);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    const name = fullName.trim();
    const mail = email.trim();
    const pass = password.trim();
    const confirmPass = confirmPassword.trim();

    if (!name) nextErrors.fullName = "Full name is required";
    else if (name.length < 3)
      nextErrors.fullName = "Full name must be at least 3 characters";

    if (!mail) nextErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail))
      nextErrors.email = "Enter a valid email";

    if (!pass) nextErrors.password = "Password is required";
    else if (pass.length < 6)
      nextErrors.password = "Password must be at least 6 characters";

    if (!confirmPass)
      nextErrors.confirmPassword = "Confirm your password";
    else if (pass !== confirmPass)
      nextErrors.confirmPassword = "Passwords do not match";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function onSignup() {
    if (loading) return;
    if (!validate()) return;

    setLoading(true);

    try {
      const res = await registerApi({
        name: fullName.trim(),
        email: email.trim(),
        password,
      });

      setLoading(false);

      Alert.alert(
        "OTP Sent",
        res.message || "OTP sent to your email",
        [
          {
            text: "OK",
            onPress: () =>
              navigation.navigate("VerifyEmail", { email: email.trim() }),
          },
        ]
      );
    } catch (e) {
      setLoading(false);
      Alert.alert("Signup failed", e?.message || "Please try again.");
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
                  Create Your {"\n"}AI Account
                </Text>
              }
            >
              <LinearGradient
                colors={["#A5B4FC", "#6366F1", "#4F46E5"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={[styles.heading, { opacity: 0 }]}>
                  Create Your {"\n"}AI Account
                </Text>
              </LinearGradient>
            </MaskedView>

            <Text style={styles.subheading}>
              Create your account and start improving structure, wording, and ATS performance in minutes.
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
                  value={fullName}
                  onChangeText={(t) => {
                    setFullName(t);
                    if (errors.fullName)
                      setErrors((p) => ({ ...p, fullName: undefined }));
                  }}
                  placeholder="Enter your Full Name"
                  autoCapitalize="words"
                  error={errors.fullName}
                  returnKeyType="next"
                />

                <AppInput
                  value={email}
                  onChangeText={(t) => {
                    setEmail(t);
                    if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                  }}
                  placeholder="Enter your email address"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  autoCapitalize="none"
                  autoCorrect={false}
                  error={errors.email}
                  returnKeyType="next"
                />

                <View style={styles.passwordWrap}>
                  <AppInput
                    value={password}
                    onChangeText={(t) => {
                      setPassword(t);
                      if (errors.password)
                        setErrors((p) => ({ ...p, password: undefined }));
                    }}
                    placeholder="Enter your password "
                    secureTextEntry={!showPassword}
                    textContentType="newPassword"
                    autoCapitalize="none"
                    autoCorrect={false}
                    error={errors.password}
                    returnKeyType="next"
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

                <View style={styles.passwordWrap}>
                  <AppInput
                    value={confirmPassword}
                    onChangeText={(t) => {
                      setConfirmPassword(t);
                      if (errors.confirmPassword)
                        setErrors((p) => ({ ...p, confirmPassword: undefined }));
                    }}
                    placeholder="Re-enter password"
                    secureTextEntry={!showConfirmPassword}
                    textContentType="newPassword"
                    autoCapitalize="none"
                    autoCorrect={false}
                    error={errors.confirmPassword}
                    returnKeyType="done"
                    onSubmitEditing={onSignup}
                  />

                  <Pressable
                    onPress={() => setShowConfirmPassword((prev) => !prev)}
                    style={styles.eyeButton}
                  >
                    <Icon
                      name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color={colors.mutedText}
                    />
                  </Pressable>
                </View>

                <AppButton title="Create Account" onPress={onSignup} loading={loading} />

                <View style={styles.row}>
                  <Text style={styles.rowText}>Already have an account?</Text>
                  <Pressable
                    onPress={() => navigation.replace("Login")}
                    disabled={loading}
                    style={({ pressed }) => pressed && { opacity: 0.6 }}
                  >
                    <Text style={styles.link}> Log in</Text>
                  </Pressable>
                </View>

                <Text style={styles.terms}>
                  By signing up, you agree to our{" "}
                  <Text style={styles.termsBold}>Terms</Text> &{" "}
                  <Text style={styles.termsBold}>Privacy Policy</Text>.
                </Text>
              </View>
            </LinearGradient>
          </View>

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
      fontSize: 40,
      fontWeight: "800",
      lineHeight: 44,
      letterSpacing: -1,
    },
    subheading: {
      color: colors.mutedText,
      marginTop: spacing.sm,
      marginBottom: spacing.lg,
      fontSize: 14,
      lineHeight: 20,
    },
    hero: {
      marginBottom: 15,
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
    passwordWrap: {
      position: "relative",
    },
    eyeButton: {
      position: "absolute",
      right: 14,
      top: 22,
      zIndex: 10,
    },
    row: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: spacing.md,
    },
    rowText: {
      color: colors.mutedText,
      fontSize: 13,
    },
    link: {
      color: colors.primary,
      fontSize: 13,
      fontWeight: "700",
    },
    terms: {
      marginTop: spacing.lg,
      color: colors.mutedText,
      fontSize: 12,
      lineHeight: 18,
      textAlign: "center",
    },
    termsBold: {
      color: colors.text,
      fontWeight: "700",
    },
  });