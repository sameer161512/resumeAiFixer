import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import spacing from "../theme/spacing";
import AppButton from "../components/AppButton";
import ScreenHeader from "../components/ScreenHeader";

import { pick, types, isErrorWithCode, errorCodes } from "@react-native-documents/picker";
import { useTheme } from "../theme/ThemeContext";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { Animated } from "react-native";
import { useEffect, useRef } from "react";

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
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.timing(borderAnim, {
        toValue: 1,
        duration: 6000,
        useNativeDriver: false,
      })
    ).start();
  }, []);

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
    <View style={styles.container}>
      <ScreenHeader
        title="Upload Resume"
        onBack={() => {
          if (navigation.canGoBack()) navigation.goBack();
          else navigation.replace("Dashboard");
        }}
      />

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
                    outputRange: [-30, 30],
                  }),
                },
              ],
            },
          ]}
        />

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
                Upload Your{"\n"}Resume
              </Text>
            </LinearGradient>
          </Animated.View>
        </MaskedView>

        <Text style={styles.subheading}>
          Upload your resume and get instant AI feedback on ATS readiness, wording, and overall impact.
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
            <Pressable
              onPress={onPickResume}
              style={({ pressed }) => [styles.dropZone, pressed && styles.pressed]}
            >
              <View style={styles.dropIconWrap}>
                <Icon name="document-text-outline" size={28} color={colors.primary} />
              </View>

              <Text style={styles.dropTitle}>
                {file ? "Change file" : "Tap to choose resume"}
              </Text>

              <Text style={styles.dropHint}>
                Supported: PDF, DOC, DOCX, Images
              </Text>
            </Pressable>

            {file ? (
              <View style={styles.fileCard}>
                <View style={{ flex: 1 }}>
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
                    <Icon name="bulb-outline" size={25} color={colors.primary} />
                  </View>

                  <Text style={styles.emptyText}>
                    Export your resume as PDF for best formatting and stronger ATS
                    results.
                  </Text>
                </View>
              </View>
            )}

            <AppButton
              title={file ? "Continue" : "Choose Resume"}
              onPress={onContinue}
              disabled={!file}
              loading={loading}
            />
          </View>
        </LinearGradient>
      </View>
    </View>
  );
}

const makeStyles = (colors, mode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
      padding: spacing.md,
      paddingTop:spacing
    },
    header: {
      marginTop: 8,
      marginBottom: 18,
      position: "relative",
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
      fontSize: 16,
      lineHeight: 22,
      maxWidth: "95%",
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 24,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.06,
      shadowRadius: 20,
      elevation: 4,
    },
    dropZone: {
      borderRadius: 22,
      borderWidth: 2,
      borderStyle: "dashed",
      borderColor: colors.border,
      paddingVertical: 34,
      paddingHorizontal: 20,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: spacing.lg,
      backgroundColor: colors.subtle,
    },
    pressed: {
      opacity: 0.9,
    },

    dropTitle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "800",
      textAlign: "center",
    },
    dropHint: {
      marginTop: 6,
      color: colors.mutedText,
      fontSize: 12,
      lineHeight: 18,
      textAlign: "center",
      maxWidth: "88%",
    },
    fileCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      backgroundColor: colors.subtle,
      borderRadius: 14,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.md,
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
      paddingVertical: 8,
      paddingHorizontal: 12,
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
      borderRadius: 18,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.md,
    },
    emptyText: {
      flex: 1,
      color: colors.mutedText,
      fontSize: 13,
      lineHeight: 20,
    },
    dropIconWrap: {
      width: 58,
      height: 58,
      borderRadius: 18,
      backgroundColor: colors.bg,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },

    heroChip: {
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

    heroChipText: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: "700",
    },

    tipRow: {
      flexDirection: "row",
      alignItems: "flex-start",
    },

    tipIconWrap: {
      width: 40,
      height: 50,
      borderRadius: 12,
      backgroundColor: colors.bg,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },

    cardBorderWrap: {
      borderRadius: 30,
      marginTop: 8,
    },

    cardBorder: {
      borderRadius: 30,
      padding: 1.2,
    },
    heroGlow: {
      position: "absolute",
      top: -170,
      left: -140,
      width: 360,
      height: 360,
      borderRadius: 360,
      backgroundColor: "#6366F1",
      opacity: 0.07,
    },
  });