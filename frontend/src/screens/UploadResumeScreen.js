import React, { useMemo, useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Pressable, Alert, Animated, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import spacing from "../theme/spacing";
import AppButton from "../components/AppButton";
import ScreenHeader from "../components/ScreenHeader";

import {
  pick,
  types,
  isErrorWithCode,
  errorCodes,
} from "@react-native-documents/picker";
import { useTheme } from "../theme/ThemeContext";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";

export default function UploadResumeScreen({ navigation }) {
  const { colors, mode } = useTheme();
  const styles = useMemo(() => makeStyles(colors, mode), [colors, mode]);

  const glowAnim = useRef(new Animated.Value(0)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

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
    borderAnim.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(borderAnim, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: false,
        }),
        Animated.timing(borderAnim, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [borderAnim]);

  const prettySize = useMemo(() => {
    if (!file?.size && file?.size !== 0) return "";
    const bytes = file.size;
    const kb = bytes / 1024;
    const mb = kb / 1024;
    if (mb >= 1) return `${mb.toFixed(2)} MB`;
    return `${kb.toFixed(0)} KB`;
  }, [file]);

  async function onPickResume() {
    try {
      setLoading(true);

      const result = await pick({
        allowMultiSelection: false,
        type: [types.pdf, types.doc, types.docx, types.images],
      });

      const picked = result?.[0];
      if (!picked) return;

      setFile({
        name: picked.name,
        size: picked.size ?? null,
        type: picked.type ?? null,
        uri: picked.uri,
      });
    } catch (err) {
      if (isErrorWithCode(err) && err.code === errorCodes.OPERATION_CANCELED) {
        return;
      }
      Alert.alert("Couldn’t pick file", "Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function onRemove() {
    setFile(null);
  }

  function onContinue() {
    if (!file) return;
    navigation.navigate("Analyze", { file });
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.container}>
        <ScreenHeader
          title="Upload Resume"
          onBack={() => {
            if (navigation.canGoBack()) navigation.goBack();
            else navigation.replace("Dashboard");
          }}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <Animated.View
              pointerEvents="none"
              style={[
                styles.heroGlow,
                {
                  transform: [
                    {
                      translateX: glowAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-24, 28],
                      }),
                    },
                    {
                      translateY: glowAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 12],
                      }),
                    },
                  ],
                },
              ]}
            />

            <View style={styles.heroChip}>
              <Icon name="sparkles-outline" size={14} color={colors.primary} />
              <Text style={styles.heroChipText}>AI Resume Assistant</Text>
            </View>

            <MaskedView
              maskElement={
                <Text style={styles.heading}>
                  Upload Your{"\n"}Resume
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
                  colors={["#C7D2FE", "#818CF8", "#4F46E5"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={[styles.heading, { opacity: 0 }]}>
                    Upload Your{"\n"}Resume
                  </Text>
                </LinearGradient>
              </Animated.View>
            </MaskedView>

            <Text style={styles.subheading}>
              Upload your resume and get instant AI feedback on ATS readiness,
              wording, and overall impact.
            </Text>
          </View>

          <View style={styles.cardBorderWrap}>
            <LinearGradient
              colors={
                mode === "dark"
                  ? [
                      "rgba(99,102,241,0.38)",
                      "rgba(168,85,247,0.12)",
                      "rgba(255,255,255,0.04)",
                    ]
                  : [
                      "rgba(99,102,241,0.22)",
                      "rgba(168,85,247,0.08)",
                      "rgba(255,255,255,0.92)",
                    ]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardBorder}
            >
              <View style={styles.card}>
                <Pressable
                  onPress={onPickResume}
                  style={({ pressed }) => [
                    styles.dropZone,
                    pressed && styles.pressed,
                  ]}
                >
                  <LinearGradient
                    colors={
                      mode === "dark"
                        ? ["rgba(99,102,241,0.22)", "rgba(99,102,241,0.10)"]
                        : ["rgba(99,102,241,0.12)", "rgba(99,102,241,0.05)"]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.dropIconWrap}
                  >
                    <Icon
                      name="document-text-outline"
                      size={30}
                      color={colors.primary}
                    />
                  </LinearGradient>

                  <Text style={styles.dropTitle}>
                    {file ? "Change selected resume" : "Tap to choose resume"}
                  </Text>

                  <Text style={styles.dropHint}>
                    Supported: PDF, DOC, DOCX, Images
                  </Text>
                </Pressable>

                {file ? (
                  <View style={styles.fileCard}>
                    <View style={styles.fileIconWrap}>
                      <Icon
                        name="document-attach-outline"
                        size={20}
                        color={colors.primary}
                      />
                    </View>

                    <View style={styles.fileInfo}>
                      <Text style={styles.fileName} numberOfLines={1}>
                        {file.name}
                      </Text>

                      <Text style={styles.fileMeta}>
                        {prettySize ? `${prettySize} • ` : ""}
                        {file.type || "Unknown type"}
                      </Text>
                    </View>

                    <Pressable onPress={onRemove} style={styles.removeBtn}>
                      <Text style={styles.removeText}>Remove</Text>
                    </Pressable>
                  </View>
                ) : (
                  <View style={styles.emptyInfo}>
                    <View style={styles.tipRow}>
                      <View style={styles.tipIconWrap}>
                        <Icon
                          name="bulb-outline"
                          size={22}
                          color={colors.primary}
                        />
                      </View>

                      <Text style={styles.emptyText}>
                        Export your resume as PDF for best formatting and
                        stronger ATS results.
                      </Text>
                    </View>
                  </View>
                )}

                <AppButton
                  title={file ? "Continue" : "Choose Resume"}
                  onPress={file ? onContinue : onPickResume}
                  disabled={loading}
                  loading={loading}
                />
              </View>
            </LinearGradient>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (colors, mode) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.bg,
    },

    container: {
      flex: 1,
      backgroundColor: colors.bg,
      paddingHorizontal: spacing.md,
    },

    scrollContent: {
      paddingTop: 20,
      paddingBottom: 28,
    },

    header: {
      marginTop: 18,
      marginBottom: 24,
      position: "relative",
    },

    heroGlow: {
      position: "absolute",
      top: -120,
      left: -110,
      width: 320,
      height: 320,
      borderRadius: 320,
      backgroundColor: "#6366F1",
      opacity: mode === "dark" ? 0.12 : 0.08,
    },

    heroChip: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      backgroundColor: colors.subtle,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 16,
    },

    heroChipText: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: "700",
    },

    heading: {
      color: colors.text,
      fontSize: 32,
      fontWeight: "800",
      lineHeight: 37,
      letterSpacing: -1.1,
    },

    subheading: {
      color: colors.mutedText,
      marginTop: 14,
      fontSize: 16,
      lineHeight: 28,
      maxWidth: "96%",
    },

    cardBorderWrap: {
      borderRadius: 30,
      marginTop: 10,
    },

    cardBorder: {
      borderRadius: 30,
      padding: 1.2,
    },

    card: {
      backgroundColor: colors.card,
      borderRadius: 28,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: mode === "dark" ? 0.2 : 0.07,
      shadowRadius: 24,
      elevation: 5,
    },

    dropZone: {
      borderRadius: 24,
      borderWidth: 2,
      borderStyle: "dashed",
      borderColor: colors.border,
      paddingVertical: 42,
      paddingHorizontal: 22,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: spacing.lg,
      backgroundColor: colors.subtle,
    },

    pressed: {
      opacity: 0.92,
      transform: [{ scale: 0.995 }],
    },

    dropIconWrap: {
      width: 72,
      height: 72,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 18,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.bg,
    },

    dropTitle: {
      color: colors.text,
      fontSize: 17,
      fontWeight: "800",
      textAlign: "center",
    },

    dropHint: {
      marginTop: 8,
      color: colors.mutedText,
      fontSize: 13,
      lineHeight: 20,
      textAlign: "center",
      maxWidth: "90%",
    },

    fileCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.subtle,
      borderRadius: 18,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.md,
    },

    fileIconWrap: {
      width: 44,
      height: 44,
      borderRadius: 14,
      backgroundColor: colors.bg,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.border,
      marginRight: 12,
    },

    fileInfo: {
      flex: 1,
    },

    fileName: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "700",
    },

    fileMeta: {
      marginTop: 4,
      color: colors.mutedText,
      fontSize: 12,
    },

    removeBtn: {
      marginLeft: 10,
      paddingVertical: 9,
      paddingHorizontal: 13,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.bg,
    },

    removeText: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: "700",
    },

    emptyInfo: {
      backgroundColor: colors.subtle,
      borderRadius: 20,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.md,
    },

    tipRow: {
      flexDirection: "row",
      alignItems: "center",
    },

    tipIconWrap: {
      width: 52,
      height: 52,
      borderRadius: 16,
      backgroundColor: colors.bg,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },

    emptyText: {
      flex: 1,
      color: colors.mutedText,
      fontSize: 14,
      lineHeight: 22,
    },
  });