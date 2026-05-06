import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";

import { generateResumeFromScratchApi } from "../config/api";
import { useTheme } from "../theme/ThemeContext";
import spacing from "../theme/spacing";
import ScreenHeader from "../components/ScreenHeader";

export default function CreateResumeScreen({ navigation }) {
  const { colors, mode } = useTheme();
  const styles = useMemo(() => makeStyles(colors, mode), [colors, mode]);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    targetRole: "",
    email: "",
    phone: "",
    city: "",
    skills: "",
    education: "",
    objective: "",
    projects: "",
  });

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = async () => {
    if (loading) return;

    if (step === 1) {
      setStep(2);
      return;
    }

    if (step === 2) {
      if (
        !form.fullName.trim() ||
        !form.targetRole.trim() ||
        !form.email.trim() ||
        !form.phone.trim() ||
        !form.city.trim()
      ) {
        Alert.alert(
          "Missing details",
          "Please fill all basic details before continuing."
        );
        return;
      }

      setStep(3);
      return;
    }

    if (step === 3) {
      if (
        !form.skills.trim() ||
        !form.education.trim() ||
        !form.objective.trim() ||
        !form.projects.trim()
      ) {
        Alert.alert(
          "Missing details",
          "Please fill all fields before generating your resume."
        );
        return;
      }

      try {
        setLoading(true);

        const data = await generateResumeFromScratchApi(form);

        if (!data?.resume) {
          Alert.alert("Error", "Resume data was not generated.");
          return;
        }

        console.log("FORM SENT:", form);
        console.log("AI RESPONSE:", data);
        console.log("GENERATED RESUME:", data.resume);

        navigation.navigate("GeneratedResumePreview", {
          generatedResume: data.resume,
        });
      } catch (error) {
        Alert.alert("Error", error?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        <ScreenHeader title="Create Resume" onBack={() => navigation.goBack()} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {step === 1 && (
            <LinearGradient
              colors={
                mode === "dark"
                  ? ["#0F172A", "#1E293B", "#334155"]
                  : ["#111827", "#1F2937", "#374151"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroCard}
            >
              <View style={styles.heroIconWrap}>
                <Icon name="sparkles-outline" size={22} color="#FFFFFF" />
              </View>

              <Text style={styles.heroEyebrow}>NO RESUME YET?</Text>

              <Text style={styles.heroTitle}>
                Build Your First Resume{"\n"}With AI
              </Text>

              <Text style={styles.heroDesc}>
                Share your skills, education, and career goals. AI will turn them
                into a polished, ATS-ready resume draft.
              </Text>
            </LinearGradient>
          )}

          {step === 1 && (
            <>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>What you’ll provide</Text>

                {[
                  "Skills and tools you know",
                  "Education details",
                  "Career objective or target role",
                  "Projects, internships, or achievements",
                ].map((item, i) => (
                  <View key={i} style={styles.pointRow}>
                    <Icon
                      name="checkmark-circle-outline"
                      size={18}
                      color={colors.primary}
                    />
                    <Text style={styles.pointText}>{item}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>What AI will do</Text>

                {[
                  "Write a professional summary",
                  "Organize sections clearly",
                  "Make content ATS-friendly",
                  "Prepare the resume for template preview",
                ].map((item, i) => (
                  <View key={i} style={styles.pointRow}>
                    <Icon
                      name="sparkles-outline"
                      size={18}
                      color={colors.primary}
                    />
                    <Text style={styles.pointText}>{item}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {step === 2 && (
            <View style={styles.card}>
              <View style={styles.stepHeader}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>Step 1 of 2</Text>
                </View>

                <Text style={styles.cardTitle}>Basic Details</Text>

                <Text style={styles.stepSubtext}>
                  Enter your basic information to get started.
                </Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  value={form.fullName}
                  onChangeText={(text) => updateField("fullName", text)}
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.placeholder}
                  style={styles.input}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Target Role</Text>
                <TextInput
                  value={form.targetRole}
                  onChangeText={(text) => updateField("targetRole", text)}
                  placeholder="e.g. Frontend Developer"
                  placeholderTextColor={colors.placeholder}
                  style={styles.input}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  value={form.email}
                  onChangeText={(text) => updateField("email", text)}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.placeholder}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Contact</Text>
                <TextInput
                  value={form.phone}
                  onChangeText={(text) => updateField("phone", text)}
                  placeholder="Enter your phone number"
                  placeholderTextColor={colors.placeholder}
                  keyboardType="phone-pad"
                  style={styles.input}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>City</Text>
                <TextInput
                  value={form.city}
                  onChangeText={(text) => updateField("city", text)}
                  placeholder="e.g. Gurgaon, India"
                  placeholderTextColor={colors.placeholder}
                  style={styles.input}
                />
              </View>
            </View>
          )}

          {step === 3 && (
            <View style={styles.card}>
              <View style={styles.stepHeader}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>Step 2 of 2</Text>
                </View>

                <Text style={styles.cardTitle}>Skills & Education</Text>

                <Text style={styles.stepSubtext}>
                  Tell us what you know and what you’ve studied.
                </Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Skills</Text>
                <TextInput
                  value={form.skills}
                  onChangeText={(text) => updateField("skills", text)}
                  placeholder="e.g. React, JavaScript, UI Design, Communication"
                  placeholderTextColor={colors.placeholder}
                  style={[styles.input, styles.textArea]}
                  multiline
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Education</Text>
                <TextInput
                  value={form.education}
                  onChangeText={(text) => updateField("education", text)}
                  placeholder="e.g. B.Tech in Computer Science, ABC University, 2025"
                  placeholderTextColor={colors.placeholder}
                  style={[styles.input, styles.textArea]}
                  multiline
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Career Objective</Text>
                <TextInput
                  value={form.objective}
                  onChangeText={(text) => updateField("objective", text)}
                  placeholder="Describe your goal in a few words"
                  placeholderTextColor={colors.placeholder}
                  style={[styles.input, styles.textArea]}
                  multiline
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Projects / Achievements</Text>
                <TextInput
                  value={form.projects}
                  onChangeText={(text) => updateField("projects", text)}
                  placeholder="Add projects, internships, achievements, or certifications"
                  placeholderTextColor={colors.placeholder}
                  style={[styles.input, styles.textArea]}
                  multiline
                  textAlignVertical="top"
                />
              </View>
            </View>
          )}

          {step > 1 && (
            <Pressable
              onPress={() => setStep((prev) => prev - 1)}
              disabled={loading}
              style={({ pressed }) => [
                styles.backBtn,
                pressed && { opacity: 0.92 },
                loading && { opacity: 0.6 },
              ]}
            >
              <Text style={styles.backBtnText}>Back</Text>
            </Pressable>
          )}

          <Pressable
            onPress={handleNext}
            disabled={loading}
            style={({ pressed }) => [
              styles.primaryBtn,
              (pressed || loading) && { opacity: 0.92 },
            ]}
          >
            <Text style={styles.primaryBtnText}>
              {loading
                ? "Generating..."
                : step === 1
                ? "Continue"
                : step === 2
                ? "Next"
                : "Generate Resume"}
            </Text>
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
      backgroundColor: mode === "dark" ? "#0B0D12" : "#F6F8FC",
    },

    container: {
      flex: 1,
      backgroundColor: colors.bg,
      paddingHorizontal: 12,
      paddingTop: 4,
    },

    content: {
      paddingBottom: spacing.xl,
    },

    heroCard: {
      borderRadius: 28,
      paddingTop: 20,
      paddingHorizontal: 18,
      paddingBottom: 28,
      marginTop: 4,
      marginBottom: 18,
      minHeight: 250,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.10)",
      overflow: "hidden",

      shadowColor: "#000",
      shadowOffset: { width: 0, height: 14 },
      shadowOpacity: mode === "dark" ? 0.22 : 0.12,
      shadowRadius: 24,
      elevation: 4,
    },

    heroIconWrap: {
      width: 48,
      height: 48,
      borderRadius: 16,
      backgroundColor: "rgba(255,255,255,0.14)",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
    },

    heroEyebrow: {
      color: "rgba(255,255,255,0.72)",
      fontSize: 11,
      fontWeight: "800",
      letterSpacing: 1,
      marginBottom: 8,
    },

    heroTitle: {
      color: "#FFFFFF",
      fontSize: 21,
      fontWeight: "900",
      lineHeight: 27,
      marginBottom: 14,
      maxWidth: "84%",
    },

    heroDesc: {
      color: "rgba(255,255,255,0.9)",
      fontSize: 14,
      lineHeight: 25,
      maxWidth: "88%",
    },

    card: {
      backgroundColor: colors.card,
      borderRadius: 24,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: mode === "dark" ? "rgba(255,255,255,0.05)" : colors.border,
      marginBottom: spacing.md,

      shadowColor: "#000",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: mode === "dark" ? 0.14 : 0.06,
      shadowRadius: 20,
      elevation: 4,
    },

    cardTitle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "800",
      marginBottom: 14,
    },

    pointRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginBottom: 12,
    },

    pointText: {
      flex: 1,
      color: colors.text,
      fontSize: 14,
      lineHeight: 20,
      fontWeight: "600",
    },

    inputGroup: {
      marginBottom: 14,
    },

    inputLabel: {
      color: colors.text,
      fontSize: 13,
      fontWeight: "800",
      marginBottom: 8,
    },

    input: {
      height: 54,
      borderRadius: 16,
      paddingHorizontal: 16,
      backgroundColor: colors.subtle,
      borderWidth: 1,
      borderColor: colors.border,
      color: colors.text,
      fontSize: 14,
      fontWeight: "600",
    },

    textArea: {
      height: 120,
      paddingTop: 14,
      paddingBottom: 14,
    },

    stepHeader: {
      marginBottom: 18,
    },

    stepBadge: {
      alignSelf: "flex-start",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: colors.subtle,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 10,
    },

    stepBadgeText: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: "800",
    },

    stepSubtext: {
      color: colors.mutedText,
      fontSize: 13,
      lineHeight: 18,
      marginTop: -4,
    },

    backBtn: {
      marginTop: 4,
      marginBottom: 10,
      height: 52,
      borderRadius: 16,
      backgroundColor: colors.subtle,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },

    backBtnText: {
      color: colors.text,
      fontSize: 15,
      fontWeight: "800",
    },

    primaryBtn: {
      marginTop: 8,
      height: 56,
      borderRadius: 18,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",

      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: mode === "dark" ? 0.18 : 0.08,
      shadowRadius: 18,
      elevation: 3,
    },

    primaryBtnText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "800",
    },
  });