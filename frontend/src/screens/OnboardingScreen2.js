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
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../theme/ThemeContext";
import spacing from "../theme/spacing";

export default function OnboardingScreen2({ navigation }) {
  const { mode } = useTheme();
  const styles = useMemo(() => makeStyles(mode), [mode]);

  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardY = useRef(new Animated.Value(30)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textY = useRef(new Animated.Value(24)).current;
  const glowScale = useRef(new Animated.Value(0.9)).current;
  const glowOpacity = useRef(new Animated.Value(0.34)).current;
  const scanAnim = useRef(new Animated.Value(0)).current;

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
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 1600,
          useNativeDriver: false,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [cardOpacity, cardY, textOpacity, textY, glowScale, glowOpacity, scanAnim]);

  const scanWidth = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["12%", "100%"],
  });

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
          <Pressable onPress={() => navigation.replace("Login")}>
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
            <View style={styles.previewTop}>
              <View style={styles.iconWrap}>
                <Icon name="sparkles-outline" size={28} color="#FFFFFF" />
              </View>

              <View style={styles.topTextWrap}>
                <Text style={styles.previewEyebrow}>STEP 2</Text>
                <Text style={styles.previewTitle}>AI Analysis</Text>
              </View>
            </View>

            <View style={styles.scanCard}>
              <View style={styles.scanHeaderRow}>
                <Text style={styles.scanLabel}>Analysis Running</Text>
                <View style={styles.livePill}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
              </View>

              <View style={styles.progressTrack}>
                <Animated.View
                  style={[styles.progressFill, { width: scanWidth }]}
                />
              </View>

              <View style={styles.metricsList}>
                <View style={styles.metricRow}>
                  <View style={styles.metricLeft}>
                    <Icon
                      name="checkmark-circle"
                      size={16}
                      color="#22C55E"
                    />
                    <Text style={styles.metricText}>ATS Scan</Text>
                  </View>
                  <Text style={styles.metricStatus}>Done</Text>
                </View>

                <View style={styles.metricRow}>
                  <View style={styles.metricLeft}>
                    <Icon
                      name="checkmark-circle"
                      size={16}
                      color="#22C55E"
                    />
                    <Text style={styles.metricText}>Grammar Check</Text>
                  </View>
                  <Text style={styles.metricStatus}>Done</Text>
                </View>

                <View style={styles.metricRow}>
                  <View style={styles.metricLeft}>
                    <Icon
                      name="time-outline"
                      size={16}
                      color={mode === "dark" ? "#C7D2FE" : "#4F46E5"}
                    />
                    <Text style={styles.metricText}>Keywords Match</Text>
                  </View>
                  <Text style={styles.metricPending}>Scanning</Text>
                </View>

                <View style={styles.metricRow}>
                  <View style={styles.metricLeft}>
                    <Icon
                      name="ellipse-outline"
                      size={16}
                      color={mode === "dark" ? "#94A3B8" : "#64748B"}
                    />
                    <Text style={styles.metricText}>Formatting</Text>
                  </View>
                  <Text style={styles.metricMuted}>Queued</Text>
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
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
          </View>

          <Text style={styles.title}>Get smart AI insights</Text>

          <Text style={styles.subtitle}>
            Our AI checks ATS strength, grammar, keywords and formatting to
            reveal exactly what needs improvement.
          </Text>

          <View style={styles.buttonRow}>
            <Pressable
              onPress={() => navigation.replace("Login")}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>Skip</Text>
            </Pressable>

            <Pressable
              onPress={() => navigation.navigate("Onboarding3")}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>Next</Text>
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

    previewTop: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 22,
    },

    iconWrap: {
      width: 64,
      height: 64,
      borderRadius: 22,
      backgroundColor: "#4F46E5",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 14,
      shadowColor: "#4F46E5",
      shadowOpacity: 0.35,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    },

    topTextWrap: {
      flex: 1,
    },

    previewEyebrow: {
      fontSize: 11,
      fontWeight: "800",
      letterSpacing: 1.4,
      color: mode === "dark" ? "#94A3B8" : "#64748B",
      marginBottom: 4,
    },

    previewTitle: {
      fontSize: 24,
      fontWeight: "800",
      color: mode === "dark" ? "#F8FAFC" : "#0F172A",
    },

    scanCard: {
      borderRadius: 20,
      padding: 16,
      backgroundColor:
        mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(79,70,229,0.05)",
      borderWidth: 1,
      borderColor:
        mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(79,70,229,0.08)",
    },

    scanHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 14,
    },

    scanLabel: {
      fontSize: 15,
      fontWeight: "700",
      color: mode === "dark" ? "#E2E8F0" : "#0F172A",
    },

    livePill: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor:
        mode === "dark" ? "rgba(79,70,229,0.16)" : "rgba(79,70,229,0.10)",
    },

    liveDot: {
      width: 6,
      height: 6,
      borderRadius: 99,
      backgroundColor: "#4F46E5",
      marginRight: 6,
    },

    liveText: {
      fontSize: 11,
      fontWeight: "800",
      color: "#4F46E5",
      letterSpacing: 0.6,
    },

    progressTrack: {
      height: 8,
      borderRadius: 999,
      backgroundColor:
        mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(79,70,229,0.10)",
      overflow: "hidden",
      marginBottom: 16,
    },

    progressFill: {
      height: "100%",
      backgroundColor: "#4F46E5",
      borderRadius: 999,
    },

    metricsList: {
      gap: 12,
    },

    metricRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    metricLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      marginRight: 12,
    },

    metricText: {
      marginLeft: 10,
      fontSize: 14,
      fontWeight: "600",
      color: mode === "dark" ? "#E2E8F0" : "#0F172A",
    },

    metricStatus: {
      fontSize: 12,
      fontWeight: "700",
      color: "#22C55E",
    },

    metricPending: {
      fontSize: 12,
      fontWeight: "700",
      color: "#4F46E5",
    },

    metricMuted: {
      fontSize: 12,
      fontWeight: "700",
      color: mode === "dark" ? "#94A3B8" : "#64748B",
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