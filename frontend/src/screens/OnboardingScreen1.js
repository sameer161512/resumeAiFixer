import React, { useMemo, useRef, useEffect } from "react";
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

export default function OnboardingScreen1({ navigation }) {
  const { mode } = useTheme();
  const styles = useMemo(() => makeStyles(mode), [mode]);

  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardY = useRef(new Animated.Value(34)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textY = useRef(new Animated.Value(22)).current;
  const glowScale = useRef(new Animated.Value(0.92)).current;
  const glowOpacity = useRef(new Animated.Value(0.22)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

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
        duration: 850,
        delay: 180,
        useNativeDriver: true,
      }),
      Animated.timing(textY, {
        toValue: 0,
        duration: 850,
        delay: 180,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(glowScale, {
          toValue: 1.05,
          duration: 1500,
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
          toValue: 0.34,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.26,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2600,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [
    cardOpacity,
    cardY,
    textOpacity,
    textY,
    glowScale,
    glowOpacity,
    floatAnim,
  ]);

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
              styles.floatingBadge,
              {
                transform: [
                  {
                    translateY: floatAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -8],
                    }),
                  },
                ],
              },
            ]}
          >
            <Icon name="sparkles-outline" size={13} color="#FFFFFF" />
            <Text style={styles.floatingBadgeText}>AI Resume Workspace</Text>
          </Animated.View>

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
                <Icon name="document-text-outline" size={28} color="#FFFFFF" />
              </View>

              <View style={styles.topTextWrap}>
                <Text style={styles.previewEyebrow}>STEP 1</Text>
                <Text style={styles.previewTitle}>Upload or Build Resume</Text>
              </View>
            </View>

            <View style={styles.fileCard}>
              <View style={styles.fileLeft}>
                <View style={styles.fileIconWrap}>
                  <Icon
                    name="document-outline"
                    size={18}
                    color={mode === "dark" ? "#C7D2FE" : "#4F46E5"}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.fileName}>resume_samah.pdf</Text>
                  <Text style={styles.fileMeta}>PDF • 1.8 MB</Text>
                </View>
              </View>

              <View style={styles.readyPill}>
                <Text style={styles.readyText}>Ready</Text>
              </View>
            </View>

            <View style={styles.featureRow}>
              <View style={styles.featureMiniCard}>
                <Icon
                  name="scan-outline"
                  size={16}
                  color={mode === "dark" ? "#A5B4FC" : "#4F46E5"}
                />
                <Text style={styles.featureMiniText}>ATS Scan</Text>
              </View>

              <View style={styles.featureMiniCard}>
                <Icon
                  name="create-outline"
                  size={16}
                  color={mode === "dark" ? "#A5B4FC" : "#4F46E5"}
                />
                <Text style={styles.featureMiniText}>Builder</Text>
              </View>

              <View style={styles.featureMiniCard}>
                <Icon
                  name="sparkles-outline"
                  size={16}
                  color={mode === "dark" ? "#A5B4FC" : "#4F46E5"}
                />
                <Text style={styles.featureMiniText}>AI Fixes</Text>
              </View>
            </View>

            <LinearGradient
              colors={["#6366F1", "#4F46E5"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.uploadBtnMock}
            >
              <Icon name="cloud-upload-outline" size={18} color="#FFFFFF" />
              <Text style={styles.uploadBtnText}>Choose Resume</Text>
            </LinearGradient>
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
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

          <Text style={styles.title}>Start with your resume in seconds</Text>

          <Text style={styles.subtitle}>
            Upload an existing resume or build one from scratch with
            AIRESUMEASSISTANT, then get smarter feedback on formatting,
            wording, ATS strength, and overall impact.
          </Text>

          <View style={styles.buttonRow}>
            <Pressable
              onPress={() => navigation.replace("Login")}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>Skip</Text>
            </Pressable>

            <Pressable
              onPress={() => navigation.navigate("Onboarding2")}
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
      paddingTop: 8,
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
      position: "relative",
      marginTop: -8,
    },

    glow: {
      position: "absolute",
      width: 340,
      height: 340,
      borderRadius: 170,
      backgroundColor:
        mode === "dark" ? "rgba(79,70,229,0.25)" : "rgba(99,102,241,0.15)",
      shadowColor: "#6366F1",
      shadowOpacity: 0.9,
      shadowRadius: 48,
      shadowOffset: { width: 0, height: 0 },
      elevation: 18,
    },

    floatingBadge: {
      position: "absolute",
      top: 18,
      zIndex: 5,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 999,
      backgroundColor:
        mode === "dark" ? "rgba(99,102,241,0.22)" : "rgba(99,102,241,0.90)",
      borderWidth: 1,
      borderColor:
        mode === "dark"
          ? "rgba(255,255,255,0.08)"
          : "rgba(255,255,255,0.28)",
    },

    floatingBadgeText: {
      marginLeft: 6,
      color: "#FFFFFF",
      fontSize: 12,
      fontWeight: "700",
    },

    previewCard: {
      width: "100%",
      borderRadius: 30,
      padding: 22,
      backgroundColor:
        mode === "dark" ? "rgba(17,24,39,0.92)" : "rgba(255,255,255,0.88)",
      borderWidth: 1,
      borderColor:
        mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(99,102,241,0.12)",
      shadowColor: "#000",
      shadowOpacity: mode === "dark" ? 0.3 : 0.08,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 12 },
      elevation: 10,
    },

    previewTop: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
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
      fontSize: 23,
      fontWeight: "800",
      color: mode === "dark" ? "#F8FAFC" : "#0F172A",
    },

    fileCard: {
      borderRadius: 20,
      padding: 16,
      backgroundColor:
        mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(79,70,229,0.05)",
      borderWidth: 1,
      borderColor:
        mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(79,70,229,0.08)",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 14,
    },

    fileLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      marginRight: 12,
    },

    fileIconWrap: {
      width: 40,
      height: 40,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:
        mode === "dark" ? "rgba(99,102,241,0.12)" : "rgba(79,70,229,0.10)",
      marginRight: 12,
    },

    fileName: {
      fontSize: 15,
      fontWeight: "700",
      color: mode === "dark" ? "#E2E8F0" : "#0F172A",
    },

    fileMeta: {
      marginTop: 3,
      fontSize: 12,
      fontWeight: "500",
      color: mode === "dark" ? "#94A3B8" : "#64748B",
    },

    readyPill: {
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 999,
      backgroundColor:
        mode === "dark" ? "rgba(34,197,94,0.16)" : "rgba(34,197,94,0.12)",
    },

    readyText: {
      fontSize: 12,
      fontWeight: "800",
      color: "#22C55E",
    },

    featureRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 18,
      gap: 10,
    },

    featureMiniCard: {
      flex: 1,
      borderRadius: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor:
        mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(99,102,241,0.05)",
      borderWidth: 1,
      borderColor:
        mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(99,102,241,0.08)",
    },

    featureMiniText: {
      marginTop: 7,
      fontSize: 12,
      fontWeight: "700",
      color: mode === "dark" ? "#E2E8F0" : "#334155",
    },

    uploadBtnMock: {
      height: 54,
      borderRadius: 18,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#4F46E5",
      shadowOpacity: 0.3,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    },

    uploadBtnText: {
      marginLeft: 8,
      fontSize: 15,
      fontWeight: "700",
      color: "#FFFFFF",
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
      fontSize: 33,
      lineHeight: 39,
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