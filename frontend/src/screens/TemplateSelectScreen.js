import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Animated, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import { useTheme } from "../theme/ThemeContext";
import spacing from "../theme/spacing";
import ScreenHeader from "../components/ScreenHeader";

const TEMPLATES = [
  {
    id: "modern",
    name: "Modern",
    tag: "Clean + bold",
    desc: "Best for tech, product, and design roles.",
  },
  {
    id: "professional",
    name: "Professional",
    tag: "Classic ATS",
    desc: "Best for corporate and general job applications.",
  },
  {
    id: "minimal",
    name: "Minimal",
    tag: "Simple + elegant",
    desc: "Best for freshers and clean one-page resumes.",
  },
  {
    id: "executive",
    name: "Executive",
    tag: "Premium corporate",
    desc: "Best for senior roles, managers, and leadership profiles.",
  },
  {
    id: "compact",
    name: "Compact",
    tag: "High information",
    desc: "Best for fitting more content into a strong single-page layout.",
  },
  {
    id: "sidebar",
    name: "Sidebar",
    tag: "Structured layout",
    desc: "Best for highlighting skills, contact info, and certifications.",
  },
  {
    id: "elegant",
    name: "Elegant",
    tag: "Soft premium",
    desc: "Best for polished professional resumes with a refined look.",
  },
  {
    id: "creative",
    name: "Creative",
    tag: "Stylish modern",
    desc: "Best for designers, creators, and portfolio-based roles.",
  },
  {
    id: "photo",
    name: "Photo Profile",
    tag: "With profile image",
    desc: "Best for roles where a profile-style resume is preferred.",
  },
  {
    id: "singlepage",
    name: "Single Page Pro",
    tag: "One-page resume",
    desc: "Best for strong ATS-friendly one-page applications.",
  },
];

const TEMPLATE_PREVIEW_IMAGES = {
  modern: require("../assets/template-previews/modern.png"),
  professional: require("../assets/template-previews/professional.png"),
  minimal: require("../assets/template-previews/minimal.png"),
  executive: require("../assets/template-previews/executive.png"),
  compact: require("../assets/template-previews/compact.png"),
  sidebar: require("../assets/template-previews/sidebar.png"),
  elegant: require("../assets/template-previews/elegant.png"),
  creative: require("../assets/template-previews/creative.png"),
  photo: require("../assets/template-previews/photo.png"),
  singlepage: require("../assets/template-previews/singlepage.png"),
};

export default function TemplateSelectScreen({ navigation, route }) {
const generatedResume =
  route?.params?.generatedResume || route?.params?.generatedData || null;
  const { colors, mode } = useTheme();
  const styles = useMemo(() => makeStyles(colors, mode), [colors, mode]);

  const file = route?.params?.file || null;
  const analysis = route?.params?.analysis || null;
  const fixedResume = route?.params?.fixedResume || null;
  

  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const glowAnim = useRef(new Animated.Value(0)).current;

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

  function renderTemplatePreview(item, active) {
    return (
      <View style={[styles.previewImageFrame, active && styles.previewImageFrameActive]}>
        <Image
          source={TEMPLATE_PREVIEW_IMAGES[item.id]}
          style={styles.previewImage}
          resizeMode="cover"
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        <ScreenHeader title="Choose Template" onBack={() => navigation.goBack()} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xl }}>
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

            <View style={styles.heroChip}>
              <Icon name="layers-outline" size={14} color={colors.primary} />
              <Text style={styles.heroChipText}>Template Workspace</Text>
            </View>

            <Text style={styles.heading}>Pick Your Perfect{"\n"}Resume Template</Text>

            <Text style={styles.subheading}>
              Choose a premium layout for your final resume and preview it before export.
            </Text>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Templates</Text>
            <Text style={styles.sectionSubtitle}>
              Choose the style that matches your role and resume personality.
            </Text>
          </View>

          {TEMPLATES.map((item) => {
            const active = selectedTemplate === item.id;

            return (
              <Pressable
                key={item.id}
                onPress={() => setSelectedTemplate(item.id)}
                style={({ pressed }) => [
                  styles.templateCardWrap,
                  pressed && { opacity: 0.97 },
                ]}
              >
                <View
                  style={[
                    styles.templateCard,
                    active && styles.templateCardActive,
                    active && { borderColor: colors.primary },
                  ]}
                >
                  <LinearGradient
                    colors={
                      active
                        ? mode === "dark"
                          ? ["#4F46E5", "#6366F1", "#7C3AED"]
                          : ["#4F46E5", "#6366F1", "#818CF8"]
                        : mode === "dark"
                          ? ["rgba(255,255,255,0.02)", "rgba(255,255,255,0.01)"]
                          : ["#FFFFFF", "#F8FAFC"]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.templateGradient}
                  >
                    <View style={styles.cardTop}>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.cardTitle, active && styles.cardTitleActive]}>
                          {item.name}
                        </Text>

                        <View
                          style={[
                            styles.cardTagPill,
                            active && styles.cardTagPillActive,
                          ]}
                        >
                          <Text style={[styles.cardTag, active && styles.cardTagActive]}>
                            {item.tag}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={[
                          styles.radioOuter,
                          active && styles.radioOuterActive,
                        ]}
                      >
                        {active ? <View style={styles.radioInner} /> : null}
                      </View>
                    </View>

                    <Text style={[styles.cardDesc, active && styles.cardDescActive]}>
                      {item.desc}
                    </Text>

                    <View style={[styles.previewBox, active && styles.previewBoxActive]}>
                      {renderTemplatePreview(item, active)}
                    </View>
                  </LinearGradient>
                </View>
              </Pressable>
            );
          })}

          <View style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <View style={styles.tipIconWrap}>
                <Icon name="bulb-outline" size={18} color={colors.primary} />
              </View>
              <Text style={styles.tipTitle}>Template Tip</Text>
            </View>

            <Text style={styles.tipText}>
              Use Modern or Professional for most job applications. Choose Minimal for a
              cleaner one-page feel and Executive when you want a stronger premium presence.
            </Text>
          </View>

          <Pressable
            onPress={() =>
              navigation.navigate("ResumeTemplatePreview", {
                file,
                analysis,
                fixedResume,
                selectedTemplate,
                generatedResume,
              })
            }
            style={({ pressed }) => [{ opacity: pressed ? 0.96 : 1 }]}
          >
            <LinearGradient
              colors={
                mode === "dark"
                  ? ["#4F46E5", "#6366F1", "#7C3AED"]
                  : ["#4F46E5", "#6366F1", "#818CF8"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ctaCard}
            >
              <View style={styles.ctaHeaderRow}>
                <View style={styles.ctaIconWrap}>
                  <Icon name="document-text-outline" size={24} color="#FFFFFF" />
                </View>

                <View style={styles.ctaBadge}>
                  <Text style={styles.ctaBadgeText}>
                    {selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)} Selected
                  </Text>
                </View>
              </View>

              <Text style={styles.ctaTitle}>Preview & Continue</Text>

              <Text style={styles.ctaDesc}>
                Open the final preview with your selected template and check the polished resume layout.
              </Text>

              <View style={styles.ctaFooterRow}>
                <View style={styles.ctaButton}>
                  <Text style={styles.ctaButtonText}>Open Preview</Text>
                </View>

                <View style={styles.ctaArrowWrap}>
                  <Icon name="arrow-forward" size={18} color="#FFFFFF" />
                </View>
              </View>
            </LinearGradient>
          </Pressable>
        </ScrollView>
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
      paddingHorizontal: 12,
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
    },

    cardTop: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: spacing.md,
      justifyContent: "space-between",
    },

    cardTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "800",
      marginBottom: 10,
    },

    cardTitleActive: {
      color: "#FFFFFF",
    },

    cardTagPill: {
      alignSelf: "flex-start",
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 999,
      backgroundColor: colors.subtle,
      borderWidth: 1,
      borderColor: colors.border,
    },

    cardTagPillActive: {
      backgroundColor: "rgba(255,255,255,0.14)",
      borderColor: "rgba(255,255,255,0.18)",
    },

    cardTag: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: "700",
    },

    cardTagActive: {
      color: "#FFFFFF",
    },

    cardDesc: {
      color: colors.mutedText,
      fontSize: 13,
      lineHeight: 19,
      marginTop: spacing.md,
    },

    cardDescActive: {
      color: "rgba(255,255,255,0.88)",
    },

    radioOuter: {
      width: 24,
      height: 24,
      borderRadius: 999,
      borderWidth: 1.5,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 2,
    },

    radioOuterActive: {
      borderColor: "#FFFFFF",
      backgroundColor: "rgba(255,255,255,0.12)",
    },

    radioInner: {
      width: 10,
      height: 10,
      borderRadius: 999,
      backgroundColor: "#FFFFFF",
    },

    hero: {
      marginTop: 6,
      marginBottom: 20,
      position: "relative",
    },

    heroGlow: {
      position: "absolute",
      top: -220,
      left: -140,
      width: 420,
      height: 420,
      borderRadius: 420,
      backgroundColor: "#6366F1",
      opacity: 0.06,
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
      marginBottom: 18,
    },

    heroChipText: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: "700",
    },

    templateCardWrap: {
      marginBottom: spacing.md,
    },

    templateCard: {
      borderRadius: 24,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: mode === "dark" ? "rgba(255,255,255,0.05)" : colors.border,
      backgroundColor: colors.card,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: mode === "dark" ? 0.14 : 0.06,
      shadowRadius: 20,
      elevation: 4,
    },

    templateCardActive: {
      shadowOpacity: mode === "dark" ? 0.2 : 0.1,
    },

    templateGradient: {
      padding: spacing.lg,
    },

    previewBox: {
      marginTop: spacing.lg,
      borderRadius: 22,
      padding: 14,
      backgroundColor: mode === "dark" ? "rgba(255,255,255,0.06)" : "#EEF2FF",
      borderWidth: 1,
      borderColor: mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(79,70,229,0.08)",
      minHeight: 300,
      overflow: "hidden",
    },

    previewBoxActive: {
      backgroundColor: "rgba(255,255,255,0.14)",
      borderColor: "rgba(255,255,255,0.18)",
    },

    previewImageFrame: {
      width: "100%",
      height: 270,
      borderRadius: 18,
     backgroundColor: "#F8FAFC",
      overflow: "hidden",
      borderWidth: 1,
      borderColor: "#E5E7EB",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 14,
      elevation: 3,
    },

    previewImageFrameActive: {
      borderColor: "rgba(255,255,255,0.7)",
    },

    previewImage: {
  width: "95%",
  height: "100%",
  resizeMode: "contain",
},

    ctaCard: {
      borderRadius: 28,
      marginTop: spacing.lg,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 14 },
      shadowOpacity: mode === "dark" ? 0.22 : 0.12,
      shadowRadius: 24,
      elevation: 4,
    },

    ctaHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 15,
      marginBottom: 5,
    },

    ctaIconWrap: {
      width: 46,
      height: 46,
      borderRadius: 16,
      backgroundColor: "rgba(255,255,255,0.16)",
      alignItems: "center",
      justifyContent: "center",
    },

    ctaBadge: {
      paddingHorizontal: 16,
      paddingVertical: 9,
      borderRadius: 999,
      backgroundColor: "rgba(255,255,255,0.14)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.18)",
      alignItems: "center",
      justifyContent: "center",
    },

    ctaBadgeText: {
      color: "#FFFFFF",
      fontSize: 12,
      fontWeight: "700",
    },

    ctaTitle: {
      color: "#FFFFFF",
      fontSize: 20,
      fontWeight: "900",
      lineHeight: 24,
      marginBottom: 12,
      paddingLeft: 15,
    },

    ctaDesc: {
      color: "rgba(255,255,255,0.92)",
      fontSize: 14,
      lineHeight: 22,
      marginBottom: 24,
      paddingLeft: 15,
      paddingRight: 15,
    },

    ctaFooterRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingLeft: 15,
      paddingRight: 15,
      paddingBottom: 15,
    },

    ctaButton: {
      backgroundColor: "rgba(255,255,255,0.18)",
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 14,
    },

    ctaButtonText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "800",
    },

    ctaArrowWrap: {
      width: 36,
      height: 36,
      borderRadius: 12,
      backgroundColor: "rgba(255,255,255,0.14)",
      alignItems: "center",
      justifyContent: "center",
    },

    sectionHeader: {
      marginTop: 2,
      marginBottom: 16,
    },

    sectionTitle: {
      color: colors.text,
      fontSize: 22,
      fontWeight: "800",
      letterSpacing: -0.4,
    },

    sectionSubtitle: {
      color: colors.mutedText,
      marginTop: 6,
      fontSize: 14,
      lineHeight: 20,
    },

    tipCard: {
      backgroundColor: colors.card,
      borderRadius: 22,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: mode === "dark" ? "rgba(255,255,255,0.05)" : colors.border,
      marginTop: 6,
      marginBottom: spacing.lg,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: mode === "dark" ? 0.12 : 0.05,
      shadowRadius: 18,
      elevation: 3,
    },

    tipHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },

    tipIconWrap: {
      width: 36,
      height: 36,
      borderRadius: 12,
      backgroundColor: colors.subtle,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 10,
    },

    tipTitle: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "800",
    },

    tipText: {
      color: colors.mutedText,
      fontSize: 13,
      lineHeight: 20,
    },
  });