import React, { useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  Pressable,
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
        toValue: 78,
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
          ? ["#050816", "#0D1320", "#11182A"]
          : ["#F8FAFC", "#EEF2FF", "#E0F2FE"]
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
        <View style={styles.headerRow}>
          <Pressable onPress={handleFinish}>
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
            </View>

            <Text style={styles.scoreLabel}>ATS SCORE</Text>
            <Text style={styles.scoreValue}>78/100</Text>

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
                  <Icon name="download-outline" size={18} color="#4F46E5" />
                </View>
                <Text style={styles.metricTitle}>Resume</Text>
                <Text style={styles.metricSub}>Ready</Text>
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

          <Text style={styles.title}>Improve and download with confidence</Text>

          <Text style={styles.subtitle}>
            Turn feedback into a stronger, cleaner resume and download a more
            polished version in just a few taps.
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
    },

    headerRow: {
      paddingTop: 6,
      alignItems: "flex-end",
    },

    skipTop: {
      fontSize: 15,
      fontWeight: "700",
      color: mode === "dark" ? "#94A3B8" : "#64748B",
    },

    heroSection: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      marginTop: -10,
    },

    glow: {
      position: "absolute",
      width: 320,
      height: 320,
      borderRadius: 160,
      backgroundColor:
        mode === "dark" ? "rgba(79,70,229,0.22)" : "rgba(79,70,229,0.12)",
      shadowColor: mode === "dark" ? "#6366F1" : "#4F46E5",
      shadowOpacity: 1,
      shadowRadius: 50,
      shadowOffset: { width: 0, height: 0 },
      elevation: 18,
    },

    previewCard: {
      width: "100%",
      borderRadius: 30,
      padding: 22,
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
      alignItems: "flex-start",
      marginBottom: 18,
    },

    successBadge: {
      flexDirection: "row",
      alignItems: "center",
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

    scoreLabel: {
      fontSize: 12,
      fontWeight: "800",
      letterSpacing: 1.6,
      color: mode === "dark" ? "#94A3B8" : "#64748B",
      marginBottom: 6,
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

    contentSection: {
      paddingBottom: 10,
    },

    dotsWrap: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 22,
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
      fontSize: 34,
      lineHeight: 40,
      fontWeight: "800",
      letterSpacing: 0.2,
      color: mode === "dark" ? "#F8FAFC" : "#0F172A",
      textAlign: "center",
    },

    subtitle: {
      marginTop: 12,
      fontSize: 15,
      lineHeight: 24,
      fontWeight: "500",
      color: mode === "dark" ? "#94A3B8" : "#64748B",
      textAlign: "center",
      paddingHorizontal: 8,
    },

    buttonRow: {
      marginTop: 30,
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