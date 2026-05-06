import React, { useEffect, useMemo, useRef } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Animated } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import spacing from "../theme/spacing";
import ScreenHeader from "../components/ScreenHeader";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";

export default function ResultsScreen({ navigation, route }) {
  const { colors, mode } = useTheme();
  const styles = useMemo(() => makeStyles(colors, mode), [colors, mode]);

  const file = route?.params?.file || null;
  const analysis = route?.params?.analysis || null;
  const savedScore = route?.params?.score ?? null;

  const glowAnim = useRef(new Animated.Value(0)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;

  const score =
    analysis?.overallScore ??
    analysis?.atsScore ??
    analysis?.scores?.overall ??
    savedScore ??
    78;

  const grammarScore =
    analysis?.scores?.clarity ??
    analysis?.grammarScore ??
    0;

  const keywordsScore =
    analysis?.scores?.keywords ??
    analysis?.keywordsScore ??
    0;

  const formattingScore =
    analysis?.scores?.formatting ??
    analysis?.formattingScore ??
    0;

  const summaryChips = [
    {
      label: "Grammar",
      value: grammarScore >= 75 ? "Good" : grammarScore >= 50 ? "Medium" : "Needs work",
    },
    {
      label: "Keywords",
      value: keywordsScore >= 75 ? "Strong" : keywordsScore >= 50 ? "Medium" : "Low",
    },
    {
      label: "Formatting",
      value: formattingScore >= 75 ? "Strong" : formattingScore >= 50 ? "Medium" : "Needs work",
    },
  ];

  const fixes =
    analysis?.suggestions?.length
      ? analysis.suggestions.map((item, index) => ({
          title: item,
          note:
            analysis?.weaknesses?.[index] ||
            "Recommended improvement based on AI analysis.",
          level: index < 2 ? "High" : index < 4 ? "Medium" : "Low",
        }))
      : [
          {
            title: "Add stronger section headings",
            note: "Use: Summary, Experience, Projects, Skills.",
            level: "High",
          },
          {
            title: "Add measurable impact",
            note: "Include numbers: +20%, 10k users, ₹5L saved.",
            level: "High",
          },
          {
            title: "Improve keyword match",
            note: "Add role keywords in skills + bullets naturally.",
            level: "Medium",
          },
          {
            title: "Shorten long bullet points",
            note: "Aim 1–2 lines per bullet for readability.",
            level: "Low",
          },
        ];

  const scoreLabel = useMemo(() => {
    if (score >= 85) return { text: "Excellent", tone: "success" };
    if (score >= 70) return { text: "Good", tone: "warning" };
    return { text: "Needs work", tone: "danger" };
  }, [score]);

  const barWidth = `${Math.max(0, Math.min(100, score))}%`;

  const toneColor =
    scoreLabel.tone === "success"
      ? colors.success
      : scoreLabel.tone === "warning"
      ? colors.warning
      : colors.danger;

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
  }, [glowAnim]);

  useEffect(() => {
    Animated.loop(
      Animated.timing(borderAnim, {
        toValue: 1,
        duration: 6000,
        useNativeDriver: false,
      })
    ).start();
  }, [borderAnim]);

  function LevelTag({ level }) {
    const bg =
      level === "High"
        ? "rgba(239,68,68,0.12)"
        : level === "Medium"
        ? "rgba(245,158,11,0.14)"
        : colors.subtle;

    const fg =
      level === "High"
        ? "#EF4444"
        : level === "Medium"
        ? "#F59E0B"
        : colors.mutedText;

    return (
      <View style={[styles.tag, { backgroundColor: bg }]}>
        <Text style={[styles.tagText, { color: fg }]}>{level}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Results"
        onBack={() => navigation.replace("UploadResume")}
      />

      <ScrollView
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

          <View style={styles.aiChip}>
            <Icon name="sparkles-outline" size={14} color={colors.primary} />
            <Text style={styles.aiChipText}>AI Resume Results</Text>
          </View>

          <MaskedView
            maskElement={
              <Text style={styles.heading}>
                Your Resume{"\n"}Score
              </Text>
            }
          >
            <Animated.View
              style={{
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
                  Your Resume{"\n"}Score
                </Text>
              </LinearGradient>
            </Animated.View>
          </MaskedView>

          <Text style={styles.subheading} numberOfLines={2}>
            {file?.name ? `Analyzed: ${file.name}` : "Your resume analysis is ready."}
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
            <View style={styles.heroCard}>
              <View style={styles.heroTopRow}>
                <View>
                  <Text style={styles.heroLabel}>ATS Score</Text>
                  <Text style={styles.heroScore}>
                    {score}
                    <Text style={styles.heroOutOf}>/100</Text>
                  </Text>
                </View>

                <View
                  style={[
                    styles.pill,
                    { backgroundColor: colors.subtle, borderColor: colors.border },
                  ]}
                >
                  <View style={[styles.dot, { backgroundColor: toneColor }]} />
                  <Text style={styles.pillText}>{scoreLabel.text}</Text>
                </View>
              </View>

              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: barWidth, backgroundColor: toneColor },
                  ]}
                />
              </View>

              <Text style={styles.heroHint}>
                {analysis?.summary ||
                  "Tip: Improving headings + keywords usually gives the fastest ATS boost."}
              </Text>

              <View style={styles.chipsRow}>
                {summaryChips.map((c) => (
                  <View key={c.label} style={styles.chip}>
                    <Text style={styles.chipLabel}>{c.label}</Text>
                    <Text style={styles.chipValue}>{c.value}</Text>
                  </View>
                ))}
              </View>
            </View>
          </LinearGradient>
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
              <Text style={styles.sectionTitle}>Top fixes</Text>

              {fixes.map((f, index) => {
                const isLast = index === fixes.length - 1;

                return (
                  <View
                    key={`${f.title}-${index}`}
                    style={[styles.fixRow, isLast && { borderBottomWidth: 0 }]}
                  >
                    <View style={{ flex: 1 }}>
                      <View style={styles.fixTitleRow}>
                        <Text style={styles.fixTitle}>{f.title}</Text>
                        <LevelTag level={f.level} />
                      </View>
                      <Text style={styles.fixNote}>{f.note}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </LinearGradient>
        </View>

        <Pressable
          onPress={() =>
            navigation.navigate("ResumePreview", {
              file,
              analysis,
            })
          }
          style={({ pressed }) => [
            styles.primaryBtn,
            { marginTop: spacing.lg },
            pressed && { opacity: 0.9 },
          ]}
        >
          <LinearGradient
            colors={
              mode === "dark"
                ? ["#6366F1", "#7C3AED"]
                : ["#6366F1", "#4F46E5"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.primaryGradient}
          >
            <Text style={styles.primaryBtnText}>Fix My Resume</Text>
          </LinearGradient>
        </Pressable>

        <Pressable
          onPress={() => navigation.replace("UploadResume")}
          style={({ pressed }) => [styles.secondaryBtn, pressed && { opacity: 0.9 }]}
        >
          <Text style={styles.secondaryBtnText}>Analyze another resume</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const makeStyles = (colors, mode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
      padding: spacing.sm,
      paddingTop: spacing.xl,
      paddingBottom: 0,
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
      lineHeight: 22,
      maxWidth: "95%",
    },

    heroCard: {
      backgroundColor: colors.card,
      borderRadius: 24,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: mode === "dark" ? "rgba(255,255,255,0.04)" : colors.border,

      shadowColor: "#000",
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: mode === "dark" ? 0.16 : 0.08,
      shadowRadius: 26,
      elevation: 6,
    },
    heroTopRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: spacing.md,
      gap: spacing.md,
    },
    heroLabel: {
      color: colors.mutedText,
      fontSize: 13,
      fontWeight: "700",
    },
    heroScore: {
      color: colors.text,
      fontSize: 46,
      fontWeight: "900",
      marginTop: 4,
      letterSpacing: -1,
    },
    heroOutOf: {
      color: colors.mutedText,
      fontSize: 18,
      fontWeight: "800",
    },
    pill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      borderWidth: 1,
      alignSelf: "flex-start",
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 999,
    },
    pillText: {
      color: colors.text,
      fontSize: 12,
      fontWeight: "800",
    },

    progressTrack: {
      height: 14,
      borderRadius: 999,
      backgroundColor: colors.subtle,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      borderRadius: 999,
    },
    heroHint: {
      marginTop: spacing.md,
      color: colors.mutedText,
      fontSize: 13,
      lineHeight: 20,
    },
    chipsRow: {
      flexDirection: "row",
      gap: spacing.sm,
      marginTop: spacing.lg,
    },
    chip: {
      flex: 1,
      backgroundColor: colors.subtle,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 18,
      padding: spacing.md,
    },
    chipLabel: {
      color: colors.mutedText,
      fontSize: 12,
      fontWeight: "700",
    },
    chipValue: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "800",
      marginTop: 6,
    },

    card: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.lg,
    },
    sectionTitle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "900",
      marginBottom: spacing.md,
      letterSpacing: -0.3,
    },

    fixRow: {
      paddingVertical: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    fixTitleRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: spacing.md,
    },
    fixTitle: {
      color: colors.text,
      fontSize: 15,
      fontWeight: "800",
      flex: 1,
      lineHeight: 20,
    },
    fixNote: {
      marginTop: 8,
      color: colors.mutedText,
      fontSize: 13,
      lineHeight: 20,
    },

    tag: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
    },
    tagText: {
      fontSize: 11,
      fontWeight: "900",
    },

    primaryBtn: {
      height: 58,
      borderRadius: 18,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",

      shadowColor: "#000",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: mode === "dark" ? 0.18 : 0.08,
      shadowRadius: 22,
      elevation: 6,
    },
    primaryBtnText: {
      color: "white",
      fontSize: 17,
      fontWeight: "800",
    },

    secondaryBtn: {
      height: 58,
      borderRadius: 18,
      backgroundColor: colors.subtle,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
      marginTop: spacing.md,

      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: mode === "dark" ? 0.1 : 0.04,
      shadowRadius: 16,
      elevation: 3,
    },
    secondaryBtnText: {
      color: colors.text,
      fontSize: 17,
      fontWeight: "800",
    },

    hero: {
      marginTop: 8,
      marginBottom: spacing.lg,
      position: "relative",
    },

    heroGlow: {
      position: "absolute",
      top: -160,
      left: -120,
      width: 360,
      height: 360,
      borderRadius: 360,
      backgroundColor: "#6366F1",
      opacity: 0.07,
    },

    aiChip: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 999,
      backgroundColor: colors.subtle,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 16,
    },

    aiChipText: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: "700",
    },

    cardBorderWrap: {
      borderRadius: 30,
      marginTop: 8,
      marginBottom: spacing.lg,
    },

    cardBorder: {
      borderRadius: 30,
      padding: 1.2,
    },

    primaryGradient: {
      flex: 1,
      width: "100%",
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
    },
  });