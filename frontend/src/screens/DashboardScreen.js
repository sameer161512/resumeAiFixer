import React, { useMemo, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

import { useTheme } from "../theme/ThemeContext";
import spacing from "../theme/spacing";
import LinearGradient from "react-native-linear-gradient";

export default function DashboardScreen({ navigation }) {
  const { colors, mode } = useTheme();
  const styles = useMemo(() => makeStyles(colors, mode), [colors, mode]);

  const glowAnim = useRef(new Animated.Value(0)).current;

  const [avgAts, setAvgAts] = useState(0);
  const [analyzedCount, setAnalyzedCount] = useState(0);
  const [lastScore, setLastScore] = useState(0);

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

    const getRandomInt = (min, max) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    setAvgAts(getRandomInt(65, 92));
    setAnalyzedCount(getRandomInt(1, 12));
    setLastScore(getRandomInt(68, 95));
  }, [glowAnim]);

  const recent = [
    { id: "1", title: "Software Engineer Resume", score: 78, date: "Today" },
    { id: "2", title: "Product Manager Resume", score: 71, date: "Yesterday" },
    { id: "3", title: "Data Analyst Resume", score: 83, date: "3 days ago" },
  ];

  function ScorePill({ score }) {
    const tone =
      score >= 85 ? colors.success : score >= 70 ? colors.warning : colors.danger;

    return (
      <View style={[styles.scorePill, { borderColor: tone }]}>
        <Text style={[styles.scoreText, { color: tone }]}>{score}/100</Text>
      </View>
    );
  }

  function goSettings() {
    navigation.push("Settings");
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: spacing.xl }}
          keyboardShouldPersistTaps="handled"
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

            <View style={styles.topRow}>
              <View style={styles.heroChip}>
                <Icon name="sparkles-outline" size={14} color={colors.primary} />
                <Text style={styles.heroChipText}>AI Resume Workspace</Text>
              </View>

              <Pressable
                onPress={goSettings}
                hitSlop={14}
                style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.6 }]}
              >
                <Icon name="settings-outline" size={22} color={colors.text} />
              </Pressable>
            </View>

            <Text style={styles.heading}>Upgrade Your Resume{"\n"}With AI Precision</Text>

            <Text style={styles.sectionSubtitle}>
              Build a new resume with AI or improve your existing one with ATS insights.
            </Text>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Dashboard</Text>
            <Text style={styles.sectionSubtitle}>
              Upload a resume and get ATS + keyword + formatting fixes.
            </Text>
          </View>

          <Pressable
            onPress={() => navigation.navigate("CreateResume")}
            style={({ pressed }) => [{ opacity: pressed ? 0.96 : 1 }]}
          >
            <LinearGradient
              colors={
                mode === "dark"
                  ? ["#0F172A", "#1E293B", "#334155"]
                  : ["#111827", "#1F2937", "#374151"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.ctaCard, { borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" }]}
            >
              <View style={styles.ctaHeaderRow}>
                <View style={styles.ctaIconWrap}>
                  <Icon name="sparkles-outline" size={24} color="white" />
                </View>

                <View
                  style={[
                    styles.ctaBadge,
                    { backgroundColor: "rgba(255,255,255,0.22)" }
                  ]}
                >
                  <Text style={styles.ctaBadgeText}>AI Powered</Text>
                </View>
              </View>

              <View style={{ paddingLeft: 15, marginBottom: 8 }}>
                <Text
                  style={{
                    color: "rgba(255,255,255,0.72)",
                    fontSize: 11,
                    fontWeight: "800",
                    letterSpacing: 0.8,
                    textTransform: "uppercase",
                  }}
                >
                  No resume yet?
                </Text>
              </View>

              <Text style={styles.ctaTitle}>Create Resume with AI</Text>
              <Text style={styles.ctaDesc}>
                Start from your skills, education, and goals. Let AI build your first ATS-ready resume from scratch.
              </Text>

              <View style={styles.ctaFooterRow}>
                <View style={styles.ctaButton}>
                  <Text style={styles.ctaButtonText}>Build Now</Text>
                </View>

                <View style={styles.ctaArrowWrap}>
                  <Icon name="arrow-forward" size={18} color="white" />
                </View>
              </View>
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate("UploadResume")}
            style={({ pressed }) => [{ opacity: pressed ? 0.96 : 1 }]}
          >
            <LinearGradient
              colors={
                mode === "dark"
                  ? ["#4F46E5", "#6366F1", "#7C3AED"]
                  : ["#4F46E5", "#6366F1", "#818CF8"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ctaCard}
            >
              <View style={styles.ctaHeaderRow}>
                <View style={styles.ctaIconWrap}>
                  <Icon name="document-text-outline" size={24} color="white" />
                </View>

                <View style={styles.ctaBadge}>
                  <Text style={styles.ctaBadgeText}>Improve Existing</Text>
                </View>
              </View>

              <Text style={styles.ctaTitle}>Upload Resume</Text>

              <Text style={styles.ctaDesc}>
                Start a new AI-powered analysis in under 10 seconds and improve ATS,
                formatting, and clarity.
              </Text>

              <View style={styles.ctaFooterRow}>
                <View style={styles.ctaButton}>
                  <Text style={styles.ctaButtonText}>Get Started</Text>
                </View>

                <View style={styles.ctaArrowWrap}>
                  <Icon name="arrow-forward" size={18} color="white" />
                </View>
              </View>
            </LinearGradient>
          </Pressable>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Avg ATS</Text>
              <Text style={styles.statValue}>{avgAts}</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Analyzed</Text>
              <Text style={styles.statValue}>{analyzedCount}</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Last Score</Text>
              <Text style={styles.statValue}>{lastScore}</Text>
            </View>
          </View>

          <View style={styles.quickGrid}>
            <Pressable
              style={({ pressed }) => [styles.quickCard, pressed && { opacity: 0.92 }]}
            >
              <View style={styles.quickIconWrap}>
                <Icon name="scan-outline" size={20} color={colors.primary} />
              </View>
              <Text style={styles.quickTitle}>ATS Scan</Text>
              <Text style={styles.quickDesc}>Check readiness</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.quickCard, pressed && { opacity: 0.92 }]}
            >
              <View style={styles.quickIconWrap}>
                <Icon name="color-wand-outline" size={20} color={colors.primary} />
              </View>
              <Text style={styles.quickTitle}>Fix Resume</Text>
              <Text style={styles.quickDesc}>Improve instantly</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.quickCard, pressed && { opacity: 0.92 }]}
            >
              <View style={styles.quickIconWrap}>
                <Icon name="layers-outline" size={20} color={colors.primary} />
              </View>
              <Text style={styles.quickTitle}>Templates</Text>
              <Text style={styles.quickDesc}>Better layouts</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.quickCard, pressed && { opacity: 0.92 }]}
            >
              <View style={styles.quickIconWrap}>
                <Icon name="sparkles-outline" size={20} color={colors.primary} />
              </View>
              <Text style={styles.quickTitle}>AI Tips</Text>
              <Text style={styles.quickDesc}>Smart suggestions</Text>
            </Pressable>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.sectionTitle}>Recent analyses</Text>
              <Pressable>
                <Text style={styles.link}>View all</Text>
              </Pressable>
            </View>

            {recent.map((r, index) => {
              const isLast = index === recent.length - 1;

              return (
                <Pressable
                  key={r.id}
                  onPress={() =>
                    navigation.navigate("Results", { file: { name: r.title } })
                  }
                  style={({ pressed }) => [
                    styles.recentRow,
                    !isLast && styles.recentRowBorder,
                    pressed && { opacity: 0.9 },
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.recentTitle} numberOfLines={1}>
                      {r.title}
                    </Text>
                    <Text style={styles.recentMeta}>{r.date}</Text>
                  </View>

                  <ScorePill score={r.score} />
                </Pressable>
              );
            })}
          </View>

          <View style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <View style={styles.tipIconWrap}>
                <Icon name="bulb-outline" size={18} color={colors.primary} />
              </View>
              <Text style={styles.tipTitle}>AI Tip For Today</Text>
            </View>

            <Text style={styles.tipText}>
              Quantify achievements wherever possible. Replacing generic lines with measurable impact usually improves resume strength fast.
            </Text>
          </View>

          <Pressable
            onPress={() => navigation.navigate("UploadResume")}
            style={({ pressed }) => [
              styles.secondaryBtn,
              pressed && { opacity: 0.92 },
            ]}
          >
            <Text style={styles.secondaryBtnText}>Analyze another resume</Text>
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (colors, mode) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: mode === "dark" ? "#0B0D12" : "#F6F8FC",
    },
    container: {
      flex: 1,
      backgroundColor: colors.bg,
      paddingHorizontal: 12,
      paddingBottom: 0,
    },

    hero: {
      marginTop: 0,
      marginBottom: 6,
      position: "relative",
    },
    heroGlow: {
      position: "absolute",
      top: -220,
      left: -140,
      width: 420,
      height: 420,
      borderRadius: 420,
      backgroundColor: "#6366F1",
      opacity: 0.06,
    },

    heroChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 999,
      backgroundColor: colors.subtle,
      borderWidth: 1,
      borderColor: colors.border,
      maxWidth: "78%",
    },

    heroChipText: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: "700",
    },

    brand: {
      color: colors.mutedText,
      fontSize: 14,
      letterSpacing: 1,
      fontWeight: "700",
    },
    smallHint: {
      marginTop: 4,
      color: colors.mutedText,
      fontSize: 12,
    },

    topRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 18,
    },

    iconBtn: {
      width: 50,
      height: 50,
      borderRadius: 18,
      backgroundColor: colors.card,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.border,
      marginTop: 10,

      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: mode === "dark" ? 0.12 : 0.06,
      shadowRadius: 18,
      elevation: 4,
    },
    fallbackText: {
      color: colors.text,
      fontSize: 13,
      fontWeight: "800",
    },

    heading: {
      color: colors.text,
      fontSize: 30,
      fontWeight: "800",
      lineHeight: 34,
      letterSpacing: -1,
    },

    subheading: {
      color: colors.mutedText,
      marginTop: spacing.sm,
      marginBottom: spacing.lg,
      fontSize: 16,
      lineHeight: 20,
    },
    ctaCard: {
      borderRadius: 28,
      marginBottom: 16,
      overflow: "hidden",

      shadowColor: "#000",
      shadowOffset: { width: 0, height: 14 },
      shadowOpacity: mode === "dark" ? 0.22 : 0.12,
      shadowRadius: 24,
    },

    ctaHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 5,
      padding: 15,
    },

    ctaIconWrap: {
      width: 46,
      height: 46,
      borderRadius: 16,
      backgroundColor: "rgba(255,255,255,0.16)",
      alignItems: "center",
      justifyContent: "center",
    },

    ctaBadge: {
      paddingHorizontal: 16,
      paddingVertical: 9,
      borderRadius: 999,
      backgroundColor: "rgba(255,255,255,0.14)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.18)",
      alignItems: "center",
      justifyContent: "center",
    },

    ctaBadgeText: {
      color: "#FFFFFF",
      fontSize: 12,
      fontWeight: "700",
    },

    ctaTitle: {
      color: "#FFFFFF",
      fontSize: 17,
      fontWeight: "900",
      lineHeight: 24,
      marginBottom: 12,
      paddingLeft: 15,
    },

    ctaDesc: {
      color: "rgba(255,255,255,0.92)",
      fontSize: 14,
      lineHeight: 22,
      marginBottom: 24,
      paddingLeft: 15,
    },

    ctaFooterRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingLeft: 15,
      paddingBottom: 15,
      paddingRight: 15,
    },

    ctaButton: {
      backgroundColor: "rgba(255,255,255,0.18)",
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 14,
    },

    ctaButtonText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "800",
    },

    ctaArrowWrap: {
      width: 36,
      height: 36,
      borderRadius: 12,
      backgroundColor: "rgba(255,255,255,0.14)",
      alignItems: "center",
      justifyContent: "center",
    },
    statsRow: {
      flexDirection: "row",
      gap: spacing.sm,
      marginBottom: spacing.lg,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: mode === "dark" ? "rgba(255,255,255,0.05)" : colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: mode === "dark" ? 0.12 : 0.05,
      shadowRadius: 18,
      elevation: 3,
    },
    statLabel: {
      color: colors.mutedText,
      fontSize: 12,
      fontWeight: "700",
    },
    statValue: {
      marginTop: 8,
      color: colors.text,
      fontSize: 20,
      fontWeight: "900",
    },

    card: {
      backgroundColor: colors.card,
      borderRadius: 24,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: mode === "dark" ? "rgba(255,255,255,0.05)" : colors.border,
      marginBottom: spacing.lg,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: mode === "dark" ? 0.14 : 0.06,
      shadowRadius: 20,
      elevation: 4,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: spacing.md,
    },
    link: {
      color: colors.primary,
      fontSize: 13,
      fontWeight: "800",
    },

    recentRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: spacing.md,
      gap: spacing.md,
    },
    recentRowBorder: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    recentTitle: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "800",
    },
    recentMeta: {
      marginTop: 5,
      color: colors.mutedText,
      fontSize: 12,
    },

    scorePill: {
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 999,
      borderWidth: 1.5,
      backgroundColor: colors.subtle,
    },
    scoreText: {
      fontSize: 12,
      fontWeight: "900",
    },

    secondaryBtn: {
      height: 56,
      borderRadius: 18,
      backgroundColor: colors.subtle,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: mode === "dark" ? 0.1 : 0.04,
      shadowRadius: 16,
      elevation: 2,
    },
    secondaryBtnText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "800",
    },

    quickGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginBottom: spacing.lg,
    },

    quickCard: {
      width: "48.5%",
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: mode === "dark" ? "rgba(255,255,255,0.05)" : colors.border,
      marginBottom: spacing.sm,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: mode === "dark" ? 0.12 : 0.05,
      shadowRadius: 18,
      elevation: 3,
    },

    quickIconWrap: {
      width: 42,
      height: 42,
      borderRadius: 14,
      backgroundColor: colors.subtle,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
    },

    quickTitle: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "800",
    },

    quickDesc: {
      color: colors.mutedText,
      fontSize: 12,
      marginTop: 4,
    },

    tipCard: {
      backgroundColor: colors.card,
      borderRadius: 22,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: mode === "dark" ? "rgba(255,255,255,0.05)" : colors.border,
      marginBottom: spacing.lg,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: mode === "dark" ? 0.12 : 0.05,
      shadowRadius: 18,
      elevation: 3,
    },

    tipHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },

    tipIconWrap: {
      width: 36,
      height: 36,
      borderRadius: 12,
      backgroundColor: colors.subtle,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 10,
    },

    tipTitle: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "800",
    },

    tipText: {
      color: colors.mutedText,
      fontSize: 13,
      lineHeight: 20,
    },

    sectionHeader: {
      marginTop: 16,
      marginBottom: 18,
    },

    sectionTitle: {
      color: colors.text,
      fontSize: 25,
      fontWeight: "800",
      letterSpacing: -0.3,
    },

    sectionSubtitle: {
      color: colors.mutedText,
      marginTop: 6,
      fontSize: 15,
      lineHeight: 18,
    },
  });