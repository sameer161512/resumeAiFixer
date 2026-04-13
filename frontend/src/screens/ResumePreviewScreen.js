import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Animated, BackHandler } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../theme/ThemeContext";
import spacing from "../theme/spacing";
import ScreenHeader from "../components/ScreenHeader";
import { generateFixedResumeApi } from "../config/api";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";

export default function ResumePreviewScreen({ navigation, route }) {
  const { colors, mode } = useTheme();
  const styles = useMemo(() => makeStyles(colors, mode), [colors, mode]);

  const file = route?.params?.file || null;
  const analysis = route?.params?.analysis || null;

  const [loading, setLoading] = useState(true);
  const [fixedResume, setFixedResume] = useState(null);
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
                      outputRange: [-30, 30],
                    }),
                  },
                ],
              },
            ]}
          />

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
                  ? ["rgba(99,102,241,0.45)", "rgba(168,85,247,0.15)", "rgba(255,255,255,0.04)"]
                  : ["rgba(99,102,241,0.22)", "rgba(168,85,247,0.10)", "rgba(255,255,255,0.85)"]
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
              contentContainerStyle={{ paddingBottom: spacing.xl }}
            >
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
                  <View style={styles.resumeCard}>
                    <View style={styles.headerBlock}>
                      <Text style={styles.nameText}>
                        {fixedResume?.fullName || "Your Name"}
                      </Text>
                      <Text style={styles.roleText}>
                        {fixedResume?.jobTitle || "Professional Title"}
                      </Text>

                      <Text style={styles.contactText}>
                        {[
                          fixedResume?.email,
                          fixedResume?.phone,
                          fixedResume?.location,
                        ]
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

            <Pressable
              style={({ pressed }) => [
                styles.primaryBtn,
                pressed && { opacity: 0.92, transform: [{ scale: 0.985 }] },
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
                    ? ["#6366F1", "#7C3AED"]
                    : ["#6366F1", "#4F46E5"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.primaryGradient}
              >
                <Text style={styles.primaryBtnText}>Choose Template</Text>
              </LinearGradient>
            </Pressable>
          </>
        )}
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
      paddingBottom: 0,
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
    resumeCard: {
      backgroundColor: "#FFFFFF",
      borderRadius: 28,
      paddingTop: 28,
      paddingBottom: 28,
      paddingHorizontal: 24,
      borderWidth: 1,
      borderColor: mode === "dark" ? "rgba(255,255,255,0.04)" : colors.border,
      marginTop: spacing.md,
      overflow: "hidden",

      shadowColor: "#000",
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: mode === "dark" ? 0.16 : 0.08,
      shadowRadius: 26,
      elevation: 6,
    },

    headerBlock: {
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: "#E5E7EB",
      marginBottom: 22,
    },
    nameText: {
      fontSize: 30,
      fontWeight: "900",
      color: "#111827",
      letterSpacing: -0.6,
      lineHeight: 34,
    },
    roleText: {
      marginTop: 6,
      fontSize: 15,
      fontWeight: "800",
      color: "#4F46E5",
      letterSpacing: 0.2,
    },
    contactText: {
      marginTop: 10,
      fontSize: 12,
      lineHeight: 19,
      color: "#6B7280",
    },

    section: {
      marginBottom: 22,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: "900",
      letterSpacing: 1.1,
      textTransform: "uppercase",
      color: "#111827",
      marginBottom: 10,
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
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: "#E0E7FF",
    },
    skillChipText: {
      color: "#4338CA",
      fontSize: 12,
      fontWeight: "800",
    },

    primaryBtn: {
      height: 58,
      borderRadius: 18,
      overflow: "hidden",
      marginTop: spacing.lg,

      shadowColor: "#000",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: mode === "dark" ? 0.18 : 0.08,
      shadowRadius: 22,
      elevation: 6,
    },

    primaryGradient: {
      flex: 1,
      width: "100%",
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
    },
    primaryBtnText: {
      color: "white",
      fontSize: 17,
      fontWeight: "800",
      letterSpacing: -0.2,
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

    cardBorderWrap: {
      borderRadius: 30,
      marginTop: 8,
    },

    cardBorder: {
      borderRadius: 30,
      padding: 1.2,
    },

    loadingCard: {
      backgroundColor: colors.card,
      borderRadius: 24,
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
  });