import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  Share,
  Linking,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import spacing from "../theme/spacing";
import ScreenHeader from "../components/ScreenHeader";
import { getSessionUser, logoutUser } from "../utils/authStorage";
import { useTheme } from "../theme/ThemeContext";

export default function SettingsScreen({ navigation, route }) {
  const { colors, mode, toggle } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  // ✅ If Settings opened from LoginScreen, hide Profile + Logout
  const fromLogin = route?.params?.from === "login";

  const [profile, setProfile] = useState({ name: "", email: "" });

  useEffect(() => {
    (async () => {
      const user = await getSessionUser();
      if (user) setProfile({ name: user.name, email: user.email });
    })();
  }, []);

  function onEditProfile() {
    navigation.navigate("EditProfile");
  }

  function onRateApp() {
    Linking.openURL("https://example.com");
  }

  async function onShareApp() {
    try {
      await Share.share({
        message: "Check out ResumeAIFixer — Improve your resume with AI 🚀",
      });
    } catch (e) {
      console.log(e);
    }
  }

  function onPrivacy() {
    Alert.alert("Privacy Policy", "Privacy policy page coming soon.");
  }

  function onTerms() {
    Alert.alert("Terms & Conditions", "Terms page coming soon.");
  }

  function onSupport() {
    Alert.alert("Support", "Support page coming soon.");
  }

  function onAbout() {
    Alert.alert(
      "About ResumeAIFixer",
      "ResumeAIFixer helps you improve your resume with ATS, keywords and formatting checks."
    );
  }

  function onLogout() {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          await logoutUser();
          navigation.replace("Login");
        },
      },
    ]);
  }

  function Row({ icon, title, subtitle, onPress, destructive }) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.row, pressed && { opacity: 0.65 }]}
      >
        <View style={[styles.iconWrap, destructive && styles.iconWrapDanger]}>
          <Icon
            name={icon}
            size={18}
            color={destructive ? colors.danger : colors.text}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={[styles.rowTitle, destructive && { color: colors.danger }]}>
            {title}
          </Text>
          {!!subtitle && <Text style={styles.rowSub}>{subtitle}</Text>}
        </View>

        {!destructive && (
          <Icon name="chevron-forward" size={18} color={colors.mutedText} />
        )}
      </Pressable>
    );
  }

  function ToggleRow({ icon, title, subtitle, value, onValueChange }) {
    return (
      <View style={styles.row}>
        <View style={styles.iconWrap}>
          <Icon name={icon} size={18} color={colors.text} />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.rowTitle}>{title}</Text>
          {!!subtitle && <Text style={styles.rowSub}>{subtitle}</Text>}
        </View>

        <Switch value={value} onValueChange={onValueChange} />
      </View>
    );
  }

  function Section({ title, children }) {
    return (
      <View style={{ marginBottom: spacing.lg }}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.card}>{children}</View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        <ScreenHeader title="Settings" onBack={() => navigation.goBack()} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: spacing.xl }}
        >
          {/* ✅ Profile (hidden if opened from Login) */}
          {!fromLogin && (
            <View style={styles.profileCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {profile.name?.trim()?.[0]?.toUpperCase() || "U"}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.profileName}>{profile.name || "User"}</Text>
                <Text style={styles.profileEmail}>
                  {profile.email || "No email"}
                </Text>
              </View>

              <Pressable
                onPress={onEditProfile}
                style={({ pressed }) => [
                  styles.editBtn,
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Icon name="pencil" size={16} color={colors.primary} />
                <Text style={styles.editText}>Edit</Text>
              </Pressable>
            </View>
          )}

          {/* App */}
          <Section title="App">
            <ToggleRow
              icon="moon-outline"
              title="Dark mode"
              subtitle="Switch between light and dark"
              value={mode === "dark"}
              onValueChange={toggle}
            />
            <View style={styles.divider} />

            <Row
              icon="star-outline"
              title="Rate us"
              subtitle="Help us grow on the store"
              onPress={onRateApp}
            />
            <View style={styles.divider} />

            <Row
              icon="share-social-outline"
              title="Share app"
              subtitle="Send to a friend"
              onPress={onShareApp}
            />
          </Section>

          {/* Legal */}
          <Section title="Legal">
            <Row
              icon="lock-closed-outline"
              title="Privacy Policy"
              subtitle="How we handle your data"
              onPress={onPrivacy}
            />
            <View style={styles.divider} />

            <Row
              icon="document-text-outline"
              title="Terms & Conditions"
              subtitle="Read our terms"
              onPress={onTerms}
            />
          </Section>

          {/* Support */}
          <Section title="Support">
            <Row
              icon="help-circle-outline"
              title="Help & Support"
              subtitle="Get help with the app"
              onPress={onSupport}
            />
            <View style={styles.divider} />

            <Row
              icon="information-circle-outline"
              title="About"
              subtitle="Learn more about ResumeAIFixer"
              onPress={onAbout}
            />
          </Section>

          {/* ✅ Account (hidden if opened from Login) */}
          {!fromLogin && (
            <Section title="Account">
              <Row
                icon="log-out-outline"
                title="Log out"
                subtitle="You’ll be returned to login"
                onPress={onLogout}
                destructive
              />
            </Section>
          )}

          <Text style={styles.footer}>Built with ❤️ • Sameer Tyagi</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (colors) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    container: { flex: 1, backgroundColor: colors.bg, padding: spacing.md, paddingBottom:0, },

    profileCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      padding: spacing.md,
      borderRadius: 20,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.lg,
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 999,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarText: { color: "white", fontSize: 18, fontWeight: "900" },
    profileName: { color: colors.text, fontSize: 16, fontWeight: "900" },
    profileEmail: { marginTop: 4, color: colors.mutedText, fontSize: 12 },

    editBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 12,
      backgroundColor: colors.subtle,
      borderWidth: 1,
      borderColor: colors.border,
    },
    editText: { color: colors.primary, fontSize: 13, fontWeight: "800" },

    sectionTitle: {
      color: colors.mutedText,
      fontSize: 12,
      fontWeight: "800",
      letterSpacing: 1,
      marginBottom: spacing.sm,
      paddingLeft: 4,
      textTransform: "uppercase",
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
    },
    iconWrap: {
      width: 34,
      height: 34,
      borderRadius: 12,
      backgroundColor: colors.subtle,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    iconWrapDanger: {
      backgroundColor: "rgba(255,0,0,0.06)",
      borderColor: "rgba(255,0,0,0.15)",
    },
    rowTitle: { color: colors.text, fontSize: 15, fontWeight: "800" },
    rowSub: { marginTop: 3, color: colors.mutedText, fontSize: 12 },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginLeft: spacing.lg + 34 + spacing.md,
    },
    footer: {
      marginTop: spacing.lg,
      textAlign: "center",
      color: colors.mutedText,
      fontSize: 12,
    },
  });