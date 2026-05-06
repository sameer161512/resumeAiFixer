import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

import { useTheme } from "../theme/ThemeContext";
import spacing from "../theme/spacing";
import ScreenHeader from "../components/ScreenHeader";

const ANALYSIS_HISTORY_KEY = "analysis_history";

export default function HistoryScreen({ navigation }) {
  const { colors, mode } = useTheme();
  const styles = useMemo(() => makeStyles(colors, mode), [colors, mode]);

  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(ANALYSIS_HISTORY_KEY);
      const parsed = stored ? JSON.parse(stored) : [];
      setHistory(parsed);
    } catch (error) {
      console.log("Failed to load history:", error);
      setHistory([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const filteredHistory = history.filter((item) =>
    (item.title || "").toLowerCase().includes(search.toLowerCase())
  );

  const formatHistoryDate = (dateString) => {
    if (!dateString) return "Recently";

    const now = new Date();
    const date = new Date(dateString);
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString();
  };

  const getToneColor = (score) => {
    if (score >= 85) return colors.success;
    if (score >= 70) return colors.warning;
    return colors.danger;
  };

  const clearAllHistory = () => {
    Alert.alert("Clear History", "Delete all history?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem(ANALYSIS_HISTORY_KEY);
          setHistory([]);
        },
      },
    ]);
  };

  const deleteOne = async (id) => {
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    await AsyncStorage.setItem(ANALYSIS_HISTORY_KEY, JSON.stringify(updated));
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        <ScreenHeader title="History" onBack={() => navigation.goBack()} />

        {/* HEADER */}
        <View style={styles.topRow}>
          <View>
            <Text style={styles.heading}>Recent Analyses</Text>
            <Text style={styles.subheading}>
              View and continue your past analyses.
            </Text>
          </View>

          {history.length > 0 && (
            <Pressable onPress={clearAllHistory} style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>Clear</Text>
            </Pressable>
          )}
        </View>

        {/* SEARCH */}
        <View style={styles.searchBox}>
          <Icon name="search-outline" size={18} color={colors.mutedText} />
          <TextInput
            placeholder="Search resumes..."
            placeholderTextColor={colors.mutedText}
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        {/* EMPTY */}
        {filteredHistory.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Icon name="document-text-outline" size={40} color={colors.primary} />
            <Text style={styles.emptyTitle}>No history yet</Text>
            <Text style={styles.emptyText}>
              Your analyzed resumes will appear here.
            </Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {filteredHistory.map((item) => {
              const tone = getToneColor(Number(item.score) || 0);

              return (
                <View key={item.id} style={styles.card}>
                  {/* TOP ROW */}
                  <View style={styles.cardTop}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.title} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={styles.meta}>
                        {formatHistoryDate(item.createdAt)}
                      </Text>
                    </View>

                    <View style={[styles.scorePill, { borderColor: tone }]}>
                      <Text style={[styles.scoreText, { color: tone }]}>
                        {item.score}/100
                      </Text>
                    </View>
                  </View>

                  {/* ACTIONS */}
                  <View style={styles.actionsRow}>
                    <Pressable
                      style={styles.actionBtn}
                      onPress={() =>
                        navigation.navigate("Results", {
                          file: { name: item.title },
                          score: item.score,
                          analysis: item.analysis,
                        })
                      }
                    >
                      <Text style={styles.actionText}>View</Text>
                    </Pressable>

                    <Pressable
                      style={styles.actionBtn}
                      onPress={() =>
                        navigation.navigate("ResumePreview", {
                          file: { name: item.title },
                          analysis: item.analysis,
                        })
                      }
                    >
                      <Text style={styles.actionText}>Fix</Text>
                    </Pressable>

                    <Pressable onPress={() => deleteOne(item.id)}>
                      <Icon name="trash-outline" size={20} color={colors.danger} />
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (colors, mode) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    container: { flex: 1, paddingHorizontal: 12 },

    heading: { color: colors.text, fontSize: 24, fontWeight: "800" },
    subheading: { color: colors.mutedText, marginTop: 4 },

    topRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 12,
    },

    clearBtn: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 12,
      backgroundColor: colors.subtle,
    },
    clearBtnText: { color: colors.danger, fontWeight: "800" },

    searchBox: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      padding: 12,
      borderRadius: 16,
      marginBottom: 14,
    },

    searchInput: {
      marginLeft: 8,
      color: colors.text,
      flex: 1,
    },

    emptyWrap: {
      alignItems: "center",
      marginTop: 80,
    },

    emptyTitle: {
      fontSize: 20,
      fontWeight: "800",
      marginTop: 10,
      color: colors.text,
    },

    emptyText: {
      color: colors.mutedText,
      marginTop: 6,
      textAlign: "center",
    },

    card: {
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 18,
      marginBottom: 10,
    },

    cardTop: {
      flexDirection: "row",
      alignItems: "center",
    },

    title: { color: colors.text, fontWeight: "800" },
    meta: { color: colors.mutedText, fontSize: 12 },

    scorePill: {
      borderWidth: 1.5,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
    },

    scoreText: { fontWeight: "800" },

    actionsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 12,
      alignItems: "center",
    },

    actionBtn: {
      backgroundColor: colors.subtle,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 10,
    },

    actionText: {
      color: colors.primary,
      fontWeight: "700",
    },
  });