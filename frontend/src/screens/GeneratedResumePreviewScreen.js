import React, { useMemo } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "../theme/ThemeContext";
import ScreenHeader from "../components/ScreenHeader";

export default function GeneratedResumePreviewScreen({ navigation }) {
    const { colors, mode } = useTheme();
    const styles = useMemo(() => makeStyles(colors, mode), [colors, mode]);

    return (
        <SafeAreaView style={styles.safe} edges={["top"]}>
            <View style={styles.container}>
                <ScreenHeader
                    title="Generated Resume"
                    onBack={() => navigation.goBack()}
                />

                <View style={styles.body}>
                    <Text style={styles.title}>AI Generated Resume Preview</Text>
                    <Text style={styles.subtitle}>
                        Your generated resume will appear here before template selection.
                    </Text>

                    <View style={styles.previewCard}>
                        <Text style={styles.previewName}>
                            {formData?.fullName || "Your Name"}
                        </Text>

                        <Text style={styles.previewRole}>
                            {formData?.targetRole || "Target Role"}
                        </Text>

                        <Text style={styles.previewLine}>
                            {formData?.email || "email@example.com"} • {formData?.phone || "+91 00000 00000"}
                        </Text>

                        <Text style={styles.previewLine}>
                            {formData?.city || "Your City"}
                        </Text>

                        <Pressable
                            onPress={() =>
                                navigation.navigate("TemplateSelect", {
                                    generatedResume: formData,
                                })
                            }
                            style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.92 }]}
                        >
                            <Text style={styles.primaryBtnText}>Choose Template</Text>
                        </Pressable>
                    </View>
                </View>
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
        body: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
        },
        title: {
            color: colors.text,
            fontSize: 22,
            fontWeight: "900",
            textAlign: "center",
            marginBottom: 10,
        },
        subtitle: {
            color: colors.mutedText,
            fontSize: 14,
            lineHeight: 21,
            textAlign: "center",
        },

        previewCard: {
            width: "100%",
            marginTop: 24,
            backgroundColor: colors.card,
            borderRadius: 24,
            padding: 20,
            borderWidth: 1,
            borderColor: mode === "dark" ? "rgba(255,255,255,0.05)" : colors.border,
        },

        previewName: {
            color: colors.text,
            fontSize: 22,
            fontWeight: "900",
            marginBottom: 6,
        },

        previewRole: {
            color: colors.primary,
            fontSize: 15,
            fontWeight: "800",
            marginBottom: 10,
        },

        previewLine: {
            color: colors.mutedText,
            fontSize: 14,
            lineHeight: 20,
            marginBottom: 4,
        },

        primaryBtn: {
            marginTop: 18,
            width: "100%",
            height: 56,
            borderRadius: 18,
            backgroundColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
        },

        primaryBtnText: {
            color: "#FFFFFF",
            fontSize: 16,
            fontWeight: "800",
        },
    });