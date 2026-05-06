import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Alert, BackHandler } from "react-native";
import spacing from "../theme/spacing";
import { useTheme } from "../theme/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { analyzeResumeApi } from "../config/api";
import LinearGradient from "react-native-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ANALYSIS_HISTORY_KEY = "analysis_history";

const STEPS = [
  { key: "ats", label: "ATS Scan", desc: "Checking structure, sections & parsing…" },
  { key: "grammar", label: "Grammar", desc: "Fixing clarity, tense & errors…" },
  { key: "keywords", label: "Keywords", desc: "Matching role keywords & impact…" },
  { key: "format", label: "Formatting", desc: "Consistency, spacing & readability…" },
];

const saveAnalysisToHistory = async (item) => {
  try {
    const existing = await AsyncStorage.getItem(ANALYSIS_HISTORY_KEY);
    const parsed = existing ? JSON.parse(existing) : [];

    const updated = [item, ...parsed];

    await AsyncStorage.setItem(
      ANALYSIS_HISTORY_KEY,
      JSON.stringify(updated.slice(0, 20))
    );
  } catch (error) {
    console.log("Failed to save analysis history:", error);
  }
};

export default function AnalyzeScreen({ navigation, route }) {
  const { colors, mode } = useTheme();
  const styles = useMemo(() => makeStyles(colors, mode), [colors, mode]);
  const file = route?.params?.file || null;

  const progressAnim = useRef(new Animated.Value(0)).current; // 0..1
  const glowAnim = useRef(new Animated.Value(0)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
      headerBackVisible: false,
    });

    const beforeRemoveListener = navigation.addListener("beforeRemove", (e) => {
      if (
        e.data.action.type === "GO_BACK" ||
        e.data.action.type === "POP" ||
        e.data.action.type === "POP_TO_TOP"
      ) {
        e.preventDefault();
      }
    });

    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => true);

    return () => {
      beforeRemoveListener();
      backHandler.remove();
    };
  }, [navigation]);

  useEffect(() => {
    const id = progressAnim.addListener(({ value }) => {
      setPercent(Math.min(100, Math.round(value * 100)));
    });

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 6000,
      useNativeDriver: false,
    }).start();

    return () => {
      progressAnim.removeListener(id);
    };
  }, [progressAnim]);

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

  useEffect(() => {
    const timers = [
      setTimeout(() => setActiveStepIndex(0), 0),
      setTimeout(() => setActiveStepIndex(1), 1500),
      setTimeout(() => setActiveStepIndex(2), 3200),
      setTimeout(() => setActiveStepIndex(3), 4800),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function runAnalysis() {
      try {
        if (!file) {
          Alert.alert("Error", "No file found for analysis.");
          navigation.goBack();
          return;
        }

        const result = await analyzeResumeApi(file);

        if (!isMounted) return;

        await saveAnalysisToHistory({
          id: Date.now().toString(),
          title: file?.name || "Resume Analysis",
          roleName:
            result?.analysis?.targetRole ||
            result?.analysis?.role ||
            result?.analysis?.jobRole ||
            "",
          score:
            result?.analysis?.overallScore ??
            result?.analysis?.atsScore ??
            result?.analysis?.scores?.overall ??
            0,
          createdAt: new Date().toISOString(),
          analysis: result?.analysis || null,
        });

        navigation.replace("Results", {
          file,
          analysis: result.analysis,
        });
      } catch (error) {
        if (!isMounted) return;

        Alert.alert(
          "Analysis failed",
          error?.message || "Something went wrong while analyzing the resume.",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      }
    }

    runAnalysis();

    return () => {
      isMounted = false;
    };
  }, [file, navigation]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
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
            <Text style={styles.aiChipText}>AI Resume Analysis</Text>
          </View>

          <MaskedView
            maskElement={
              <Text style={styles.heading}>
                Analyzing Your{"\n"}Resume
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
                  Analyzing Your{"\n"}Resume
                </Text>
              </LinearGradient>
            </Animated.View>
          </MaskedView>

          <Text style={styles.subheading} numberOfLines={2}>
            {file?.name ? `File: ${file.name}` : "Preparing analysis…"}
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
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>Progress</Text>
                <Text style={styles.progressPercent}>{percent}%</Text>
              </View>

              <View style={styles.progressTrack}>
                <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
              </View>

              <Text style={styles.progressHint}>
                This usually takes a few seconds. We’re running multiple checks.
              </Text>
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
            <View style={styles.stepsCard}>
              <Text style={styles.stepsTitle}>What we’re checking</Text>

              {STEPS.map((s, idx) => {
                const done = idx < activeStepIndex;
                const active = idx === activeStepIndex;
                const isLast = idx === STEPS.length - 1;

                return (
                  <View
                    key={s.key}
                    style={[
                      styles.stepRow,
                      !isLast && styles.stepRowBorder,
                    ]}
                  >
                    <View
                      style={[
                        styles.bullet,
                        done && styles.bulletDone,
                        active && styles.bulletActive,
                      ]}
                    >
                      <Text style={styles.bulletText}>
                        {done ? "✓" : active ? "•" : ""}
                      </Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.stepLabel,
                          active && styles.stepLabelActive,
                        ]}
                      >
                        {s.label}
                      </Text>

                      <Text style={styles.stepDesc}>{s.desc}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </LinearGradient>
        </View>
      </View>
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
      flex: 1,
      backgroundColor: colors.bg,
      padding: spacing.xl,
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

    card: {
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

    progressHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: spacing.sm,
    },

    progressTitle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "800",
    },

    progressPercent: {
      color: colors.primary,
      fontSize: 15,
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
      backgroundColor: "#5B5CEB",
    },

    progressHint: {
      marginTop: spacing.md,
      color: colors.mutedText,
      fontSize: 13,
      lineHeight: 20,
    },

    stepsCard: {
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

    stepsTitle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "800",
      marginBottom: spacing.md,
    },

    stepRow: {
      flexDirection: "row",
      gap: spacing.md,
      paddingVertical: 14,
    },

    stepRowBorder: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },

    bullet: {
      width: 30,
      height: 30,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.bg,
      marginTop: 2,
    },

    bulletDone: {
      backgroundColor: colors.subtle,
      borderColor: colors.primary,
    },

    bulletActive: {
      borderColor: colors.primary,
      backgroundColor: colors.subtle,
    },

    bulletText: {
      color: colors.primary,
      fontSize: 13,
      fontWeight: "800",
    },

    stepLabel: {
      color: colors.text,
      fontSize: 15,
      fontWeight: "700",
    },

    stepLabelActive: {
      color: colors.primary,
    },

    stepDesc: {
      marginTop: 4,
      color: colors.mutedText,
      fontSize: 13,
      lineHeight: 18,
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
  });