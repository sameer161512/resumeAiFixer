import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Animated,
  BackHandler,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../theme/ThemeContext";
import spacing from "../theme/spacing";
import ScreenHeader from "../components/ScreenHeader";
import { generateFixedResumeApi } from "../config/api";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";

export default function ResumePreviewScreen({ navigation, route }) {
  const { colors, mode } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(colors, mode, insets), [colors, mode, insets]);

  const file = route?.params?.file || null;
  const analysis = route?.params?.analysis || null;

  const [loading, setLoading] = useState(true);
  const [fixedResume, setFixedResume] = useState(null);

  const glowAnim = useRef(new Animated.Value(0)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;
  const ctaGlowAnim = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: !loading,
      headerBackVisible: !loading,
    });

    let beforeRemoveListener = null;

    if (loading) {
      beforeRemoveListener = navigation.addListener("beforeRemove", (e) => {
        if (
          e.data.action.type === "GO_BACK" ||
          e.data.action.type === "POP" ||
          e.data.action.type === "POP_TO_TOP"
        ) {
          e.preventDefault();
        }
      });
    }

    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      if (loading) return true;
      return false;
    });

    return () => {
      if (beforeRemoveListener) beforeRemoveListener();
      backHandler.remove();
    };
  }, [navigation, loading]);

  useEffect(() => {
    let mounted = true;

    async function run() {
      try {
        const data = await generateFixedResumeApi(file, analysis);
        if (!mounted) return;
        setFixedResume(data.fixedResume);
      } catch (e) {
        if (!mounted) return;
        Alert.alert("Failed", e.message || "Could not generate fixed resume.", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    run();

    return () => {
      mounted = false;
    };
  }, [file, analysis, navigation]);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        <ScreenHeader title="Resume Preview" onBack={() => !loading && navigation.goBack()} />

        <View style={styles.hero}>
          <Animated.View
            style={[
              styles.heroGlow,
              {
                transform: [
                  {
                    translateX: glowAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-32, 34],
                    }),
                  },
                  {
                    translateY: glowAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-10, 12],
                    }),
                  },
                ],
              },
            ]}
          />

          <View style={styles.heroGlowSecondary} />

          <View style={styles.aiChip}>
            <Icon name="sparkles-outline" size={14} color={colors.primary} />
            <Text style={styles.aiChipText}>AI Resume Preview</Text>
          </View>

          <MaskedView
            maskElement={
              <Text style={styles.heading}>
                Your Fixed{"\n"}Resume
              </Text>
            }
          >
            <Animated.View
              style={{
                transform: [
                  {
                    translateX: borderAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-4, 4],
                    }),
                  },
                ],
              }}
            >
              <LinearGradient
                colors={
                  mode === "dark"
                    ? ["#C4B5FD", "#818CF8", "#6366F1"]
                    : ["#A5B4FC", "#6366F1", "#4F46E5"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={[styles.heading, { opacity: 0 }]}>
                  Your Fixed{"\n"}Resume
                </Text>
              </LinearGradient>
            </Animated.View>
          </MaskedView>

          <Text style={styles.subheading}>
            Review the AI-improved version of your resume before choosing a template.
          </Text>
        </View>

        {loading ? (
          <View style={styles.cardBorderWrap}>
            <LinearGradient
              colors={
                mode === "dark"
                  ? ["rgba(99,102,241,0.48)", "rgba(168,85,247,0.18)", "rgba(255,255,255,0.04)"]
                  : ["rgba(99,102,241,0.24)", "rgba(168,85,247,0.10)", "rgba(255,255,255,0.92)"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardBorder}
            >
              <View style={styles.loadingCard}>
                <View style={styles.loadingChip}>
                  <Icon name="sparkles-outline" size={14} color={colors.primary} />
                  <Text style={styles.loadingChipText}>AI Processing</Text>
                </View>

                <Text style={styles.loadingTitle}>Generating your resume preview...</Text>
                <Text style={styles.loadingText}>
                  We’re building a polished AI-updated resume for you.
                </Text>
              </View>
            </LinearGradient>
          </View>
        ) : (
          <>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              <View style={styles.cardBorderWrap}>
                <LinearGradient
                  colors={
                    mode === "dark"
                      ? ["rgba(99,102,241,0.48)", "rgba(168,85,247,0.18)", "rgba(255,255,255,0.04)"]
                      : ["rgba(99,102,241,0.24)", "rgba(168,85,247,0.10)", "rgba(255,255,255,0.92)"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardBorder}
                >
                  <View style={styles.resumeCard}>
                    <LinearGradient
                      colors={
                        mode === "dark"
                          ? ["rgba(99,102,241,0.14)", "rgba(168,85,247,0.04)"]
                          : ["rgba(99,102,241,0.08)", "rgba(168,85,247,0.02)"]
                      }
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.resumeTopAccent}
                    />

                    <View style={styles.resumeOrb} />

                    <View style={styles.headerBlock}>
                      <View style={styles.previewBadge}>
                        <Icon name="checkmark-circle" size={13} color="#4F46E5" />
                        <Text style={styles.previewBadgeText}>AI Refined</Text>
                      </View>

                      <Text style={styles.nameText}>
                        {fixedResume?.fullName || "Your Name"}
                      </Text>

                      <Text style={styles.roleText}>
                        {fixedResume?.jobTitle || "Professional Title"}
                      </Text>

                      <Text style={styles.contactText}>
                        {[fixedResume?.email, fixedResume?.phone, fixedResume?.location]
                          .filter(Boolean)
                          .join(" • ")}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>

                {!!fixedResume?.summary && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Professional Summary</Text>
                    <Text style={styles.sectionBody}>{fixedResume.summary}</Text>
                  </View>
                )}

                {!!fixedResume?.experience?.length && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Experience</Text>

                    {fixedResume.experience.map((item, index) => (
                      <View key={index} style={styles.entryBlock}>
                        <View style={styles.entryTopRow}>
                          <Text style={styles.entryTitle}>
                            {item?.role || "Role"}
                          </Text>
                          {!!item?.duration && (
                            <Text style={styles.entryMeta}>{item.duration}</Text>
                          )}
                        </View>

                        {!!item?.company && (
                          <Text style={styles.entrySubtitle}>{item.company}</Text>
                        )}

                        {item?.bullets?.map((bullet, i) => (
                          <Text key={i} style={styles.bulletText}>
                            • {bullet}
                          </Text>
                        ))}
                      </View>
                    ))}
                  </View>
                )}

                {!!fixedResume?.projects?.length && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Projects</Text>

                    {fixedResume.projects.map((item, index) => (
                      <View key={index} style={styles.entryBlock}>
                        <Text style={styles.entryTitle}>{item?.name || "Project"}</Text>
                        {item?.details?.map((detail, i) => (
                          <Text key={i} style={styles.bulletText}>
                            • {detail}
                          </Text>
                        ))}
                      </View>
                    ))}
                  </View>
                )}

                {!!fixedResume?.education?.length && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Education</Text>

                    {fixedResume.education.map((item, index) => (
                      <View key={index} style={styles.entryBlock}>
                        <View style={styles.entryTopRow}>
                          <Text style={styles.entryTitle}>
                            {item?.degree || "Degree"}
                          </Text>
                          {!!item?.year && (
                            <Text style={styles.entryMeta}>{item.year}</Text>
                          )}
                        </View>

                        {!!item?.school && (
                          <Text style={styles.entrySubtitle}>{item.school}</Text>
                        )}
                      </View>
                    ))}
                  </View>
                )}

                {!!fixedResume?.skills?.length && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Skills</Text>
                    <View style={styles.skillsWrap}>
                      {fixedResume.skills.map((skill, index) => (
                        <View key={index} style={styles.skillChip}>
                          <Text style={styles.skillChipText}>{skill}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>

            <View style={styles.ctaWrap}>
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.ctaGlow,
                  {
                    opacity: ctaGlowAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.18, 0.34],
                    }),
                    transform: [
                      {
                        scale: ctaGlowAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.96, 1.04],
                        }),
                      },
                    ],
                  },
                ]}
              />

              <Pressable
                style={({ pressed }) => [
                  styles.primaryBtn,
                  pressed && { opacity: 0.96, transform: [{ scale: 0.985 }] },
                ]}
                onPress={() =>
                  navigation.navigate("TemplateSelect", {
                    file,
                    analysis,
                    fixedResume,
                  })
                }
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
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (colors, mode, insets) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.bg,
    },

    container: {
      flex: 1,
      backgroundColor: colors.bg,
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.xl,
    },

    scrollContent: {
      paddingBottom: 18,
    },

    hero: {
      marginTop: 2,
      marginBottom: spacing.md,
      position: "relative",
      overflow: "visible",
    },

    heroGlow: {
      position: "absolute",
      top: -172,
      left: -132,
      width: 372,
      height: 372,
      borderRadius: 372,
      backgroundColor: "#6366F1",
      opacity: mode === "dark" ? 0.13 : 0.08,
    },

    heroGlowSecondary: {
      position: "absolute",
      top: 8,
      right: -40,
      width: 140,
      height: 140,
      borderRadius: 140,
      backgroundColor: mode === "dark" ? "rgba(168,85,247,0.08)" : "rgba(168,85,247,0.05)",
    },

    aiChip: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 13,
      paddingVertical: 8,
      borderRadius: 999,
      backgroundColor: colors.subtle,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 16,

      shadowColor: "#6366F1",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: mode === "dark" ? 0.18 : 0.08,
      shadowRadius: 18,
      elevation: 3,
    },

    aiChipText: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: "800",
      letterSpacing: 0.2,
    },

    heading: {
      color: colors.text,
      fontSize: 31,
      fontWeight: "900",
      lineHeight: 35,
      letterSpacing: -1.2,
    },

    subheading: {
      color: colors.mutedText,
      marginTop: 10,
      marginBottom: spacing.md,
      fontSize: 16,
      lineHeight: 25,
      maxWidth: "95%",
    },

    cardBorderWrap: {
      borderRadius: 32,
      marginTop: 4,
      marginBottom: 8,
    },

    cardBorder: {
      borderRadius: 32,
      padding: 1.2,
    },

    resumeCard: {
      backgroundColor: "#FFFFFF",
      borderRadius: 30,
      paddingTop: 24,
      paddingBottom: 28,
      paddingHorizontal: 24,
      borderWidth: 1,
      borderColor: mode === "dark" ? "rgba(255,255,255,0.04)" : colors.border,
      marginTop: spacing.md,
      overflow: "hidden",

      shadowColor: "#000",
      shadowOffset: { width: 0, height: 18 },
      shadowOpacity: mode === "dark" ? 0.18 : 0.09,
      shadowRadius: 28,
      elevation: 8,
    },

    resumeTopAccent: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 92,
    },

    resumeOrb: {
      position: "absolute",
      top: -18,
      right: -18,
      width: 104,
      height: 104,
      borderRadius: 104,
      backgroundColor: "rgba(99,102,241,0.07)",
    },

    headerBlock: {
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: "#E5E7EB",
      marginBottom: 22,
    },

    previewBadge: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: "#EEF2FF",
      borderWidth: 1,
      borderColor: "#E0E7FF",
      marginBottom: 14,
    },

    previewBadgeText: {
      color: "#4338CA",
      fontSize: 11,
      fontWeight: "800",
      letterSpacing: 0.25,
    },

    nameText: {
      fontSize: 31,
      fontWeight: "900",
      color: "#111827",
      letterSpacing: -0.7,
      lineHeight: 35,
    },

    roleText: {
      marginTop: 7,
      fontSize: 16,
      fontWeight: "800",
      color: "#4F46E5",
      letterSpacing: 0.2,
    },

    contactText: {
      marginTop: 11,
      fontSize: 12,
      lineHeight: 20,
      color: "#6B7280",
    },

    section: {
      marginBottom: 22,
    },

    sectionTitle: {
      fontSize: 12,
      fontWeight: "900",
      letterSpacing: 1.2,
      textTransform: "uppercase",
      color: "#111827",
      marginBottom: 11,
    },

    sectionBody: {
      fontSize: 14,
      lineHeight: 24,
      color: "#374151",
    },

    entryBlock: {
      marginBottom: 16,
    },

    entryTopRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: spacing.md,
    },

    entryTitle: {
      flex: 1,
      fontSize: 15,
      fontWeight: "800",
      color: "#111827",
      lineHeight: 20,
    },

    entrySubtitle: {
      marginTop: 5,
      fontSize: 13,
      fontWeight: "700",
      color: "#4B5563",
    },

    entryMeta: {
      fontSize: 12,
      fontWeight: "700",
      color: "#6B7280",
      marginLeft: 10,
    },

    bulletText: {
      marginTop: 7,
      fontSize: 14,
      lineHeight: 23,
      color: "#374151",
    },

    skillsWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },

    skillChip: {
      backgroundColor: "#EEF2FF",
      borderRadius: 999,
      paddingHorizontal: 13,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: "#E0E7FF",
    },

    skillChipText: {
      color: "#4338CA",
      fontSize: 12,
      fontWeight: "800",
    },

    loadingCard: {
      backgroundColor: colors.card,
      borderRadius: 26,
      padding: spacing.xl,
      borderWidth: 1,
      borderColor: mode === "dark" ? "rgba(255,255,255,0.04)" : colors.border,
      marginTop: spacing.md,

      shadowColor: "#000",
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: mode === "dark" ? 0.16 : 0.08,
      shadowRadius: 26,
      elevation: 6,
    },

    loadingChip: {
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

    loadingChipText: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: "700",
    },

    loadingTitle: {
      color: colors.text,
      fontSize: 24,
      fontWeight: "800",
      letterSpacing: -0.5,
    },

    loadingText: {
      color: colors.mutedText,
      fontSize: 15,
      lineHeight: 24,
      marginTop: spacing.sm,
    },

    ctaWrap: {
      position: "relative",
      paddingTop: 4,
      paddingBottom: Math.max(insets.bottom + 6, 16),
    },

    ctaGlow: {
      position: "absolute",
      left: 18,
      right: 18,
      bottom: Math.max(insets.bottom + 16, 26),
      height: 66,
      borderRadius: 24,
      backgroundColor: "#6366F1",
      opacity: 0.24,
    },

    primaryBtn: {
      height: 60,
      borderRadius: 20,
      overflow: "hidden",

      shadowColor: "#4F46E5",
      shadowOffset: { width: 0, height: 14 },
      shadowOpacity: mode === "dark" ? 0.34 : 0.18,
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
      letterSpacing: -0.25,
    },
  });