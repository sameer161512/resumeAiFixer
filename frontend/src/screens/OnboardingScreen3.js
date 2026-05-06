import React, { useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  Pressable,
  ScrollView,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../theme/ThemeContext";

export default function OnboardingScreen3({ navigation }) {
  const { mode } = useTheme();
  const styles = useMemo(() => makeStyles(mode), [mode]);

  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardY = useRef(new Animated.Value(30)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textY = useRef(new Animated.Value(24)).current;
  const glowScale = useRef(new Animated.Value(0.9)).current;
  const glowOpacity = useRef(new Animated.Value(0.34)).current;
  const scoreAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(cardY, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 900,
        delay: 180,
        useNativeDriver: true,
      }),
      Animated.timing(textY, {
        toValue: 0,
        duration: 900,
        delay: 180,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(glowScale, {
          toValue: 1.04,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(glowScale, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 0.48,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.38,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(scoreAnim, {
        toValue: 86,
        duration: 1400,
        useNativeDriver: false,
      }),
    ]).start();
  }, [cardOpacity, cardY, textOpacity, textY, glowScale, glowOpacity, scoreAnim]);

  const progressWidth = scoreAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  const handleFinish = async () => {
    try {
      await AsyncStorage.setItem("ONBOARDING_DONE", "true");
      navigation.replace("Login");
    } catch (error) {
      navigation.replace("Login");
    }
  };

  return (
    <LinearGradient
      colors={
        mode === "dark"
          ? ["#060A16", "#0B1220", "#10192D"]
          : ["#F8FAFC", "#EEF2FF", "#E0E7FF"]
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={mode === "dark" ? "light-content" : "dark-content"}
      />

      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          bounces={false}
        >
          <View style={styles.headerRow}>
            <Pressable onPress={handleFinish} hitSlop={10}>
              <Text style={styles.skipTop}>Skip</Text>
            </Pressable>
          </View>

          <View style={styles.heroSection}>
            <Animated.View
              style={[
                styles.glow,
                {
                  opacity: glowOpacity,
                  transform: [{ scale: glowScale }],
                },
              ]}
            />

            <Animated.View
              style={[
                styles.previewCard,
                {
                  opacity: cardOpacity,
                  transform: [{ translateY: cardY }],
                },
              ]}
            >
              <View style={styles.badgeRow}>
                <View style={styles.successBadge}>
                  <Icon name="checkmark-circle" size={16} color="#22C55E" />
                  <Text style={styles.successText}>Resume Improved</Text>
                </View>

                <View style={styles.templateBadge}>
                  <Icon name="layers-outline" size={15} color="#4F46E5" />
                  <Text style={styles.templateText}>Modern Template</Text>
                </View>
              </View>

              <View style={styles.inlineTopRow}>
                <Text style={styles.scoreLabel}>FINAL ATS SCORE</Text>

                <View style={styles.inlineBadge}>
                  <Icon name="checkmark-done-outline" size={13} color="#FFFFFF" />
                  <Text style={styles.inlineBadgeText}>Ready to Apply</Text>
                </View>
              </View>

              <Text style={styles.scoreValue}>86/100</Text>

              <View style={styles.progressBar}>
                <Animated.View
                  style={[styles.progressFill, { width: progressWidth }]}
                />
              </View>

              <View style={styles.metricsRow}>
                <View style={styles.metricCard}>
                  <View style={styles.metricIconWrap}>
                    <Icon name="document-text-outline" size={18} color="#4F46E5" />
                  </View>
                  <Text style={styles.metricTitle}>Grammar</Text>
                  <Text style={styles.metricSub}>Improved</Text>
                </View>

                <View style={styles.metricCard}>
                  <View style={styles.metricIconWrap}>
                    <Icon name="trending-up-outline" size={18} color="#4F46E5" />
                  </View>
                  <Text style={styles.metricTitle}>Keywords</Text>
                  <Text style={styles.metricSub}>Optimized</Text>
                </View>

                <View style={styles.metricCard}>
                  <View style={styles.metricIconWrap}>
                    <Icon name="color-wand-outline" size={18} color="#4F46E5" />
                  </View>
                  <Text style={styles.metricTitle}>Template</Text>
                  <Text style={styles.metricSub}>Applied</Text>
                </View>
              </View>

              <View style={styles.bottomActionCard}>
                <View style={styles.bottomActionLeft}>
                  <View style={styles.downloadIconWrap}>
                    <Icon
                      name="download-outline"
                      size={18}
                      color={mode === "dark" ? "#A5B4FC" : "#4F46E5"}
                    />
                  </View>

                  <View style={styles.bottomActionContent}>
                    <Text style={styles.bottomActionTitle}>Download Ready</Text>
                    <Text style={styles.bottomActionSub}>
                      Export and share your polished resume in a few taps.
                    </Text>
                  </View>
                </View>
              </View>
            </Animated.View>
          </View>

          <Animated.View
            style={[
              styles.contentSection,
              {
                opacity: textOpacity,
                transform: [{ translateY: textY }],
              },
            ]}
          >
            <View style={styles.dotsWrap}>
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={[styles.dot, styles.activeDot]} />
            </View>

            <Text style={styles.title}>Polish, choose a template, and download</Text>

            <Text style={styles.subtitle}>
              AIRESUMEASSISTANT helps you turn insights into a stronger final
              resume with better wording, cleaner structure, templates, and a
              polished version ready to share.
            </Text>

            <View style={styles.buttonRow}>
              <Pressable onPress={handleFinish} style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Skip</Text>
              </Pressable>

              <Pressable onPress={handleFinish} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Get Started</Text>
                <Icon name="arrow-forward" size={18} color="#FFFFFF" />
              </Pressable>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const makeStyles = (mode) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },

    safe: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 6,
    },

    scrollContent: {
      paddingBottom: 28,
    },

    headerRow: {
      paddingTop: 10,
      paddingRight: 2,
      alignItems: "flex-end",
      zIndex: 20,
      marginBottom: 8,
    },

    skipTop: {
      fontSize: 15,
      fontWeight: "700",
      color: mode === "dark" ? "#94A3B8" : "#64748B",
    },

    heroSection: {
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      marginTop: 0,
    },

    glow: {
      position: "absolute",
      top: 28,
      width: 320,
      height: 320,
      borderRadius: 160,
      backgroundColor:
        mode === "dark" ? "rgba(79,70,229,0.22)" : "rgba(99,102,241,0.14)",
      shadowColor: "#6366F1",
      shadowOpacity: 1,
      shadowRadius: 50,
      shadowOffset: { width: 0, height: 0 },
      elevation: 18,
    },

    previewCard: {
      width: "100%",
      borderRadius: 30,
      paddingHorizontal: 22,
      paddingTop: 18,
      paddingBottom: 18,
      backgroundColor:
        mode === "dark" ? "rgba(21,28,46,0.92)" : "rgba(255,255,255,0.88)",
      borderWidth: 1,
      borderColor:
        mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(79,70,229,0.10)",
      shadowColor: "#000",
      shadowOpacity: mode === "dark" ? 0.28 : 0.08,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 12 },
      elevation: 10,
    },

    badgeRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 18,
      gap: 10,
    },

    successBadge: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      backgroundColor:
        mode === "dark" ? "rgba(34,197,94,0.14)" : "rgba(34,197,94,0.10)",
    },

    successText: {
      marginLeft: 6,
      fontSize: 12,
      fontWeight: "800",
      color: "#22C55E",
    },

    templateBadge: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      backgroundColor:
        mode === "dark" ? "rgba(99,102,241,0.12)" : "rgba(99,102,241,0.08)",
    },

    templateText: {
      marginLeft: 6,
      fontSize: 12,
      fontWeight: "800",
      color: "#4F46E5",
    },

    inlineTopRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
      gap: 12,
    },

    scoreLabel: {
      fontSize: 12,
      fontWeight: "800",
      letterSpacing: 1.6,
      color: mode === "dark" ? "#94A3B8" : "#64748B",
      flex: 1,
    },

    inlineBadge: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderRadius: 999,
      backgroundColor:
        mode === "dark" ? "rgba(99,102,241,0.22)" : "rgba(99,102,241,0.90)",
      borderWidth: 1,
      borderColor:
        mode === "dark"
          ? "rgba(255,255,255,0.08)"
          : "rgba(255,255,255,0.30)",
      shadowColor: "#6366F1",
      shadowOpacity: 0.18,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },

    inlineBadgeText: {
      marginLeft: 6,
      color: "#FFFFFF",
      fontSize: 12,
      fontWeight: "700",
    },

    scoreValue: {
      fontSize: 40,
      lineHeight: 46,
      fontWeight: "800",
      color: mode === "dark" ? "#F8FAFC" : "#0F172A",
      marginBottom: 18,
    },

    progressBar: {
      height: 10,
      borderRadius: 999,
      backgroundColor:
        mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(79,70,229,0.10)",
      overflow: "hidden",
      marginBottom: 20,
    },

    progressFill: {
      height: "100%",
      backgroundColor: "#4F46E5",
      borderRadius: 999,
    },

    metricsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 10,
      marginBottom: 16,
    },

    metricCard: {
      flex: 1,
      borderRadius: 18,
      paddingVertical: 16,
      paddingHorizontal: 10,
      alignItems: "center",
      backgroundColor:
        mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(79,70,229,0.05)",
      borderWidth: 1,
      borderColor:
        mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(79,70,229,0.08)",
      minHeight: 118,
      justifyContent: "center",
    },

    metricIconWrap: {
      width: 34,
      height: 34,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:
        mode === "dark" ? "rgba(99,102,241,0.10)" : "rgba(79,70,229,0.08)",
      marginBottom: 10,
    },

    metricTitle: {
      fontSize: 13,
      fontWeight: "800",
      color: mode === "dark" ? "#E2E8F0" : "#0F172A",
      textAlign: "center",
    },

    metricSub: {
      marginTop: 4,
      fontSize: 12,
      fontWeight: "600",
      color: mode === "dark" ? "#94A3B8" : "#64748B",
      textAlign: "center",
    },

    bottomActionCard: {
      borderRadius: 18,
      padding: 14,
      backgroundColor:
        mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.03)",
      borderWidth: 1,
      borderColor:
        mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.05)",
    },

    bottomActionLeft: {
      flexDirection: "row",
      alignItems: "center",
    },

    bottomActionContent: {
      flex: 1,
    },

    downloadIconWrap: {
      width: 38,
      height: 38,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
      backgroundColor:
        mode === "dark" ? "rgba(99,102,241,0.10)" : "rgba(99,102,241,0.08)",
    },

    bottomActionTitle: {
      fontSize: 13,
      fontWeight: "800",
      color: mode === "dark" ? "#E2E8F0" : "#0F172A",
      marginBottom: 2,
    },

    bottomActionSub: {
      fontSize: 12.5,
      lineHeight: 18,
      fontWeight: "600",
      color: mode === "dark" ? "#94A3B8" : "#64748B",
    },

    contentSection: {
      paddingTop: 16,
      paddingBottom: 12,
    },

    dotsWrap: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 10,
      marginBottom: 16,
    },

    dot: {
      width: 8,
      height: 8,
      borderRadius: 999,
      marginHorizontal: 4,
      backgroundColor:
        mode === "dark" ? "rgba(148,163,184,0.28)" : "rgba(100,116,139,0.24)",
    },

    activeDot: {
      width: 24,
      backgroundColor: "#4F46E5",
    },

    title: {
      fontSize: 25,
      lineHeight: 31,
      fontWeight: "800",
      letterSpacing: 0.2,
      color: mode === "dark" ? "#F8FAFC" : "#0F172A",
      textAlign: "center",
      paddingHorizontal: 8,
    },

    subtitle: {
      marginTop: 10,
      fontSize: 15,
      lineHeight: 24,
      fontWeight: "500",
      color: mode === "dark" ? "#94A3B8" : "#64748B",
      textAlign: "center",
      paddingHorizontal: 8,
    },

    buttonRow: {
      marginTop: 28,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
    },

    secondaryButton: {
      flex: 1,
      height: 54,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:
        mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.04)",
      borderWidth: 1,
      borderColor:
        mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.06)",
    },

    secondaryButtonText: {
      fontSize: 15,
      fontWeight: "700",
      color: mode === "dark" ? "#E2E8F0" : "#0F172A",
    },

    primaryButton: {
      flex: 1.2,
      height: 54,
      borderRadius: 18,
      backgroundColor: "#4F46E5",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#4F46E5",
      shadowOpacity: 0.28,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    },

    primaryButtonText: {
      fontSize: 15,
      fontWeight: "700",
      color: "#FFFFFF",
      marginRight: 8,
    },
  });