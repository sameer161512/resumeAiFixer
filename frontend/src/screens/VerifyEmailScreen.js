import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import spacing from "../theme/spacing";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";
import ScreenHeader from "../components/ScreenHeader";
import { useTheme } from "../theme/ThemeContext";
import { verifyEmailApi } from "../config/api";

export default function VerifyEmailScreen({ navigation, route }) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const email = route?.params?.email || "";
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  async function onVerify() {
    const code = otp.trim();
    if (!code || code.length < 4) {
      Alert.alert("Invalid OTP", "Please enter the OTP you received.");
      return;
    }

    setLoading(true);
    try {
      const res = await verifyEmailApi({ email, otp: code });
      setLoading(false);

      Alert.alert("Verified", res.message || "Email verified. Please log in.", [
        {
          text: "OK",
          onPress: () => navigation.replace("Login", { email }),
        },
      ]);
    } catch (e) {
      setLoading(false);
      Alert.alert("Verification failed", e?.message || "Please try again.");
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.safe}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          <ScreenHeader title="Verify Email" onBack={() => navigation.goBack()} />

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: spacing.xl }}
          >
            <Text style={styles.heading}>Enter OTP</Text>
            <Text style={styles.subheading}>
              We sent an OTP to:{" "}
              <Text style={{ fontWeight: "800", color: colors.text }}>{email}</Text>
            </Text>

            <View style={styles.card}>
              <AppInput
                label="OTP"
                value={otp}
                onChangeText={setOtp}
                placeholder="6-digit code"
                keyboardType="number-pad"
                returnKeyType="done"
                onSubmitEditing={onVerify}
              />

              <AppButton title="Verify" onPress={onVerify} loading={loading} />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const makeStyles = (colors) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    container: { flex: 1, backgroundColor: colors.bg, padding: spacing.md },

    heading: { color: colors.text, fontSize: 26, fontWeight: "900" },
    subheading: {
      color: colors.mutedText,
      marginTop: spacing.sm,
      marginBottom: spacing.lg,
      fontSize: 13,
      lineHeight: 18,
    },

    card: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
    },
  });