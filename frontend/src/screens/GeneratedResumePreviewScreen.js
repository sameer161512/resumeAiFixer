import React, { useMemo, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Animated,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";

import { useTheme } from "../theme/ThemeContext";
import ScreenHeader from "../components/ScreenHeader";

export default function GeneratedResumePreviewScreen({ navigation, route }) {
  const { colors, mode } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(
    () => makeStyles(colors, mode, insets),
    [colors, mode, insets]
  );

  const generatedResume = route?.params?.generatedResume || null;

  const glowAnim = useRef(new Animated.Value(0)).current;
  const ctaGlowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [glowAnim]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(ctaGlowAnim, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(ctaGlowAnim, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [ctaGlowAnim]);

  if (!generatedResume) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={{ color: colors.text, textAlign: "center", marginTop: 40 }}>
          No resume data found
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        <ScreenHeader
          title="Generated Resume"
          onBack={() => navigation.goBack()}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.heroWrap}>
            <Animated.View
              style={[
                styles.heroGlow,
                {
                  transform: [
                    {
                      translateX: glowAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-18, 20],
                      }),
                    },
                    {
                      translateY: glowAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-6, 8],
                      }),
                    },
                  ],
                },
              ]}
            />

            <LinearGradient
              colors={
                mode === "dark"
                  ? ["#0F172A", "#172554", "#312E81"]
                  : ["#EEF2FF", "#E0E7FF", "#C7D2FE"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.hero}
            >
              <View style={styles.heroChip}>
                <Icon
                  name="sparkles-outline"
                  size={14}
                  color={mode === "dark" ? "#FFFFFF" : "#4F46E5"}
                />
                <Text style={styles.heroChipText}>AI Resume Draft</Text>
              </View>

              <Text style={styles.heroTitle}>Your Resume{"\n"}Is Ready</Text>

              <Text style={styles.heroSub}>
                Review your AI-crafted resume before selecting a template and
                exporting the final version.
              </Text>
            </LinearGradient>
          </View>

          <View style={styles.cardWrap}>
            <LinearGradient
              colors={
                mode === "dark"
                  ? [
                      "rgba(99,102,241,0.40)",
                      "rgba(168,85,247,0.14)",
                      "rgba(255,255,255,0.04)",
                    ]
                  : [
                      "rgba(99,102,241,0.22)",
                      "rgba(168,85,247,0.08)",
                      "rgba(255,255,255,0.90)",
                    ]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardBorder}
            >
              <View style={styles.previewCard}>
                <LinearGradient
                  colors={
                    mode === "dark"
                      ? ["rgba(99,102,241,0.14)", "rgba(168,85,247,0.04)"]
                      : ["rgba(99,102,241,0.08)", "rgba(168,85,247,0.02)"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.previewTopAccent}
                />

                <View style={styles.cardGlow} pointerEvents="none" />

                <View style={styles.topBlock}>
                  <View style={styles.previewBadge}>
                    <Icon name="checkmark-circle" size={13} color="#4F46E5" />
                    <Text style={styles.previewBadgeText}>AI Generated</Text>
                  </View>

                  <Text style={styles.previewName}>
                    {generatedResume?.fullName || "Your Name"}
                  </Text>

                  <Text style={styles.previewRole}>
                    {generatedResume?.targetRole || "Target Role"}
                  </Text>

                  <Text style={styles.previewLine}>
                    {generatedResume?.email || "email@example.com"} •{" "}
                    {generatedResume?.phone || "+91 00000 00000"}
                  </Text>

                  <Text style={styles.previewLine}>
                    {generatedResume?.location ||
                      generatedResume?.city ||
                      "Your City"}
                  </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.sectionCard}>
                  <View style={styles.sectionHeaderRow}>
                    <View style={styles.sectionIconWrap}>
                      <Icon
                        name="document-text-outline"
                        size={16}
                        color="#6366F1"
                      />
                    </View>
                    <Text style={styles.sectionTitle}>Professional Summary</Text>
                  </View>

                  <Text style={styles.sectionText}>
                    {generatedResume?.summary || "No summary available"}
                  </Text>
                </View>

                <View style={styles.sectionCard}>
                  <View style={styles.sectionHeaderRow}>
                    <View style={styles.sectionIconWrap}>
                      <Icon
                        name="sparkles-outline"
                        size={16}
                        color="#6366F1"
                      />
                    </View>
                    <Text style={styles.sectionTitle}>Skills</Text>
                  </View>

                  <View style={styles.skillsWrap}>
                    {Array.isArray(generatedResume?.skills) &&
                    generatedResume.skills.length > 0 ? (
                      generatedResume.skills.map((skill, i) => (
                        <View key={i} style={styles.skillPill}>
                          <Text style={styles.skillText}>{skill}</Text>
                        </View>
                      ))
                    ) : (
                      <Text style={styles.sectionText}>No skills available</Text>
                    )}
                  </View>
                </View>

                <View style={styles.sectionCard}>
                  <View style={styles.sectionHeaderRow}>
                    <View style={styles.sectionIconWrap}>
                      <Icon
                        name="school-outline"
                        size={16}
                        color="#6366F1"
                      />
                    </View>
                    <Text style={styles.sectionTitle}>Education</Text>
                  </View>

                  <Text style={styles.sectionText}>
                    {Array.isArray(generatedResume?.education) &&
                    generatedResume.education.length > 0
                      ? generatedResume.education
                          .map((item) => {
                            if (!item) return "";

                            const degree = item.degree || "";
                            const inst =
                              item.institution || item.school || "";
                            const year = item.year || "";

                            return `${degree}${inst ? ` - ${inst}` : ""}${
                              year ? ` (${year})` : ""
                            }`;
                          })
                          .filter(Boolean)
                          .join("\n")
                      : "No education available"}
                  </Text>
                </View>

                <View style={styles.sectionCard}>
                  <View style={styles.sectionHeaderRow}>
                    <View style={styles.sectionIconWrap}>
                      <Icon
                        name="briefcase-outline"
                        size={16}
                        color="#6366F1"
                      />
                    </View>
                    <Text style={styles.sectionTitle}>Projects</Text>
                  </View>

                  <Text style={styles.sectionText}>
                    {Array.isArray(generatedResume?.projects) &&
                    generatedResume.projects.length > 0
                      ? generatedResume.projects
                          .map((item) => {
                            if (!item) return "";

                            const title = item.title || item.name || "Project";
                            const desc =
                              item.description ||
                              (Array.isArray(item.details)
                                ? item.details.join(" ")
                                : item.details) ||
                              "";

                            return desc ? `${title}: ${desc}` : title;
                          })
                          .filter(Boolean)
                          .join("\n\n")
                      : "No projects available"}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.ctaSection}>
            <Animated.View
              pointerEvents="none"
              style={[
                styles.ctaGlow,
                {
                  opacity: ctaGlowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.14, 0.28],
                  }),
                  transform: [
                    {
                      scale: ctaGlowAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.98, 1.03],
                      }),
                    },
                  ],
                },
              ]}
            />

            <Pressable
              onPress={() =>
                navigation.navigate("TemplateSelect", {
                  generatedResume: generatedResume,
                })
              }
              style={({ pressed }) => [
                styles.primaryBtn,
                pressed && { opacity: 0.95, transform: [{ scale: 0.985 }] },
              ]}
            >
              <LinearGradient
                colors={
                  mode === "dark"
                    ? ["#7C83FF", "#6366F1", "#5B21B6"]
                    : ["#7C83FF", "#6366F1", "#4F46E5"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.primaryGradient}
              >
                <View style={styles.primaryBtnInner}>
                  <Text style={styles.primaryBtnText}>Choose Template</Text>
                  <Icon name="arrow-forward" size={18} color="#FFFFFF" />
                </View>
              </LinearGradient>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (colors, mode, insets) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: mode === "dark" ? "#0B0D12" : "#F6F8FC",
    },

    container: {
      flex: 1,
      backgroundColor: colors.bg,
      paddingHorizontal: 12,
      paddingTop: 6,
    },

    scrollContent: {
      paddingBottom: Math.max(insets.bottom + 30, 36),
    },

    heroWrap: {
      position: "relative",
      marginTop: 8,
      marginBottom: 16,
    },

    heroGlow: {
      position: "absolute",
      top: -24,
      left: -16,
      width: 150,
      height: 150,
      borderRadius: 150,
      backgroundColor: "#6366F1",
      opacity: mode === "dark" ? 0.16 : 0.08,
      zIndex: 0,
    },

    hero: {
      borderRadius: 30,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingRight: 34,
      paddingBottom: 40,
      minHeight: 278,
      justifyContent: "flex-start",
      borderWidth: 1,
      borderColor: mode === "dark" ? "rgba(255,255,255,0.10)" : "#DDE5FF",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: mode === "dark" ? 0.28 : 0.12,
      shadowRadius: 26,
      elevation: 8,
    },

    heroChip: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor:
        mode === "dark" ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.72)",
      borderWidth: 1,
      borderColor:
        mode === "dark" ? "rgba(255,255,255,0.12)" : "rgba(99,102,241,0.14)",
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 999,
      marginBottom: 18,
    },

    heroChipText: {
      color: mode === "dark" ? "#FFFFFF" : "#4F46E5",
      fontSize: 12,
      fontWeight: "800",
      letterSpacing: 0.2,
    },

    heroTitle: {
      color: mode === "dark" ? "#FFFFFF" : "#4F46E5",
      fontSize: 30,
      fontWeight: "900",
      lineHeight: 36,
      letterSpacing: -0.9,
      marginBottom: 18,
      maxWidth: "100%",
    },

    heroSub: {
      color: mode === "dark" ? "rgba(255,255,255,0.84)" : "#5B6475",
      fontSize: 15,
      lineHeight: 26,
      maxWidth: "88%",
      marginBottom: 10,
    },

    cardWrap: {
      width: "100%",
      marginTop: 2,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 25 },
      shadowOpacity: 0.12,
      shadowRadius: 40,
      elevation: 10,
    },

    cardBorder: {
      borderRadius: 32,
      padding: 1.5,
    },

    previewCard: {
      width: "100%",
      borderRadius: 32,
      paddingTop: 26,
      paddingBottom: 28,
      paddingHorizontal: 22,
      backgroundColor: mode === "dark" ? "rgba(15,23,42,0.94)" : "#FFFFFF",
      borderWidth: 1,
      borderColor:
        mode === "dark"
          ? "rgba(255,255,255,0.06)"
          : "rgba(15,23,42,0.05)",
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 18 },
      shadowOpacity: mode === "dark" ? 0.18 : 0.08,
      shadowRadius: 24,
      elevation: 8,
    },

    previewTopAccent: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 104,
    },

    cardGlow: {
      position: "absolute",
      top: -30,
      right: -24,
      width: 160,
      height: 160,
      borderRadius: 100,
      backgroundColor: "rgba(99,102,241,0.12)",
    },

    topBlock: {
      marginBottom: 14,
    },

    previewBadge: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 11,
      paddingVertical: 7,
      borderRadius: 999,
      backgroundColor:
        mode === "dark" ? "rgba(99,102,241,0.14)" : "#EEF2FF",
      borderWidth: 1,
      borderColor: "rgba(99,102,241,0.18)",
      marginBottom: 16,
    },

    previewBadgeText: {
      color: "#4F46E5",
      fontSize: 11,
      fontWeight: "800",
      letterSpacing: 0.2,
    },

    previewName: {
      color: colors.text,
      fontSize: 30,
      fontWeight: "900",
      letterSpacing: -0.6,
      marginBottom: 8,
    },

    previewRole: {
      color: colors.primary,
      fontSize: 18,
      fontWeight: "800",
      marginBottom: 14,
    },

    previewLine: {
      color: colors.mutedText,
      fontSize: 14,
      lineHeight: 23,
      marginBottom: 4,
      flexShrink: 1,
      width: "100%",
    },

    divider: {
      height: 1,
      marginTop: 14,
      marginBottom: 20,
      backgroundColor:
        mode === "dark"
          ? "rgba(255,255,255,0.08)"
          : "rgba(15,23,42,0.06)",
    },

    sectionCard: {
      marginTop: 14,
      paddingHorizontal: 16,
      paddingVertical: 18,
      borderRadius: 20,
      backgroundColor:
        mode === "dark"
          ? "rgba(255,255,255,0.03)"
          : "rgba(15,23,42,0.03)",
      borderWidth: 1,
      borderColor:
        mode === "dark"
          ? "rgba(255,255,255,0.05)"
          : "rgba(15,23,42,0.05)",
    },

    sectionHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },

    sectionIconWrap: {
      width: 34,
      height: 34,
      borderRadius: 11,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
      backgroundColor:
        mode === "dark"
          ? "rgba(99,102,241,0.14)"
          : "rgba(99,102,241,0.10)",
      borderWidth: 1,
      borderColor: "rgba(99,102,241,0.18)",
    },

    sectionTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "900",
      flexShrink: 1,
    },

    sectionText: {
      color: colors.mutedText,
      fontSize: 15,
      lineHeight: 29,
      marginBottom: 2,
      flexShrink: 1,
      width: "100%",
    },

    skillsWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 4,
    },

    skillPill: {
      backgroundColor:
        mode === "dark"
          ? "rgba(99,102,241,0.12)"
          : "rgba(99,102,241,0.08)",
      borderWidth: 1,
      borderColor: "rgba(99,102,241,0.24)",
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 999,
      marginRight: 10,
      marginBottom: 10,
    },

    skillText: {
      color: "#6366F1",
      fontSize: 13,
      fontWeight: "800",
    },

    ctaSection: {
      position: "relative",
      marginTop: 12,
      marginBottom: Math.max(insets.bottom + 6, 14),
      paddingTop: 6,
    },

    ctaGlow: {
      position: "absolute",
      left: 18,
      right: 18,
      top: 16,
      height: 62,
      borderRadius: 22,
      backgroundColor: "#6366F1",
    },

    primaryBtn: {
      height: 60,
      borderRadius: 20,
      overflow: "hidden",
      shadowColor: "#4F46E5",
      shadowOffset: { width: 0, height: 14 },
      shadowOpacity: mode === "dark" ? 0.30 : 0.16,
      shadowRadius: 24,
      elevation: 8,
    },

    primaryGradient: {
      flex: 1,
      width: "100%",
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
    },

    primaryBtnInner: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
    },

    primaryBtnText: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "900",
      letterSpacing: -0.2,
    },
  });