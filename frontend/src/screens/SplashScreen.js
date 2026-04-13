import React, { useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  StatusBar,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";
import { useTheme } from "../theme/ThemeContext";
import spacing from "../theme/spacing";

export default function SplashScreen({ navigation }) {
  const { colors, mode } = useTheme();
  const styles = useMemo(() => makeStyles(colors, mode), [colors, mode]);

  const logoScale = useRef(new Animated.Value(0.9)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const glowScale = useRef(new Animated.Value(0.85)).current;
  const glowOpacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    let mounted = true;

    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 850,
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 850,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(glowScale, {
          toValue: 1.05,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(glowScale, {
          toValue: 1,
          duration: 1100,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 0.68,
          duration: 1100,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 1100,
        delay: 350,
        useNativeDriver: true,
      }),
    ]).start();

 const timer = setTimeout(async () => {
  try {
    const token = await AsyncStorage.getItem("TOKEN");
    const onboardingDone = await AsyncStorage.getItem("ONBOARDING_DONE");

    if (!mounted) return;

    let nextRoute = "Login";

    if (onboardingDone !== "true") {
      nextRoute = "Onboarding1";
    } else if (token) {
      nextRoute = "Dashboard";
    }

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: nextRoute }],
      })
    );
  } catch (error) {
    if (!mounted) return;

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }],
      })
    );
  }
}, 2400);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [
    navigation,
    glowOpacity,
    glowScale,
    logoOpacity,
    logoScale,
    textOpacity,
  ]);

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

      <View style={styles.centerWrap}>
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
            styles.logoWrap,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Image
            source={require("../assets/app-icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View style={[styles.textWrap, { opacity: textOpacity }]}>
          <Text style={styles.title}>AIRESUMEFIXER</Text>
          <Text style={styles.tagline}>Fix your resume with precision</Text>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const makeStyles = (colors, mode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },

    centerWrap: {
      alignItems: "center",
      justifyContent: "center",
    },

    glow: {
      position: "absolute",
      width: 300,
      height: 300,
      borderRadius: 150,
      backgroundColor:
        mode === "dark" ? "rgba(99,102,241,0.28)" : "rgba(79,70,229,0.18)",
      shadowColor: mode === "dark" ? "#7C3AED" : "#6366F1",
      shadowOpacity: 1,
      shadowRadius: 55,
      shadowOffset: { width: 0, height: 0 },
      elevation: 24,
    },

    logoWrap: {
      width: 190,
      height: 190,
      borderRadius: 44,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: spacing.xl,
    },

    logo: {
      width: 170,
      height: 170,
      borderRadius: 34,
    },

    textWrap: {
      alignItems: "center",
      paddingHorizontal: spacing.xl,
    },

    title: {
      fontSize: 30,
      fontWeight: "800",
      letterSpacing: 2,
      color: mode === "dark" ? "#F8FAFC" : "#0F172A",
      textAlign: "center",
    },

    tagline: {
      marginTop: 10,
      fontSize: 14,
      fontWeight: "500",
      letterSpacing: 0.3,
      color: mode === "dark" ? "#94A3B8" : "#64748B",
      textAlign: "center",
    },
  });