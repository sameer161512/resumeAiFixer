import React, { useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  StatusBar,
  Easing,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { useTheme } from "../theme/ThemeContext";

export default function SplashScreen({ navigation }) {
  const { mode } = useTheme();
  const styles = useMemo(() => makeStyles(mode), [mode]);

  const badgeOpacity = useRef(new Animated.Value(0)).current;
  const badgeY = useRef(new Animated.Value(12)).current;

  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroScale = useRef(new Animated.Value(0.9)).current;
  const heroFloat = useRef(new Animated.Value(0)).current;

  const brandOpacity = useRef(new Animated.Value(0)).current;
  const brandY = useRef(new Animated.Value(16)).current;

  const textOpacity = useRef(new Animated.Value(0)).current;
  const textY = useRef(new Animated.Value(18)).current;

  const orbScale = useRef(new Animated.Value(0.92)).current;
  const orbOpacity = useRef(new Animated.Value(0.12)).current;

  const shimmerX = useRef(new Animated.Value(0)).current;
  const loaderProgress = useRef(new Animated.Value(0)).current;

  const spark1 = useRef(new Animated.Value(0.2)).current;
  const spark2 = useRef(new Animated.Value(0.4)).current;
  const spark3 = useRef(new Animated.Value(0.25)).current;
  const spark4 = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    let mounted = true;

    Animated.parallel([
      Animated.timing(badgeOpacity, {
        toValue: 1,
        duration: 550,
        delay: 80,
        useNativeDriver: true,
      }),
      Animated.timing(badgeY, {
        toValue: 0,
        duration: 550,
        delay: 80,
        useNativeDriver: true,
      }),

      Animated.timing(heroOpacity, {
        toValue: 1,
        duration: 850,
        delay: 120,
        useNativeDriver: true,
      }),
      Animated.spring(heroScale, {
        toValue: 1,
        friction: 6,
        tension: 70,
        useNativeDriver: true,
      }),

      Animated.timing(brandOpacity, {
        toValue: 1,
        duration: 650,
        delay: 260,
        useNativeDriver: true,
      }),
      Animated.timing(brandY, {
        toValue: 0,
        duration: 650,
        delay: 260,
        useNativeDriver: true,
      }),

      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 700,
        delay: 360,
        useNativeDriver: true,
      }),
      Animated.timing(textY, {
        toValue: 0,
        duration: 700,
        delay: 360,
        useNativeDriver: true,
      }),

      Animated.timing(loaderProgress, {
        toValue: 1,
        duration: 2100,
        delay: 220,
        useNativeDriver: false,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(heroFloat, {
          toValue: -8,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(heroFloat, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(orbScale, {
          toValue: 1.06,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(orbScale, {
          toValue: 1,
          duration: 1600,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(orbOpacity, {
          toValue: 0.22,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(orbOpacity, {
          toValue: 0.12,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(shimmerX, {
        toValue: 1,
        duration: 1700,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    const sparkLoop = (anim, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 1000,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.25,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      );

    sparkLoop(spark1, 100).start();
    sparkLoop(spark2, 500).start();
    sparkLoop(spark3, 250).start();
    sparkLoop(spark4, 700).start();

    const timer = setTimeout(async () => {
      try {
        const token =
          (await AsyncStorage.getItem("TOKEN")) ||
          (await AsyncStorage.getItem("user_token")) ||
          (await AsyncStorage.getItem("token"));

        console.log("SPLASH TOKEN:", token);
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
    }, 2700);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [
    navigation,
    badgeOpacity,
    badgeY,
    heroOpacity,
    heroScale,
    heroFloat,
    brandOpacity,
    brandY,
    textOpacity,
    textY,
    orbScale,
    orbOpacity,
    shimmerX,
    loaderProgress,
    spark1,
    spark2,
    spark3,
    spark4,
  ]);

  const progressWidth = loaderProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const shimmerTranslateX = shimmerX.interpolate({
    inputRange: [0, 1],
    outputRange: [-180, 220],
  });

  return (
    <LinearGradient
      colors={
        mode === "dark"
          ? ["#050816", "#0C1326", "#111A31"]
          : ["#FBFCFF", "#F3F5FF", "#EEF2FF"]
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

      <View style={styles.content}>
        <Animated.View
          style={[
            styles.badgeWrap,
            {
              opacity: badgeOpacity,
              transform: [{ translateY: badgeY }],
            },
          ]}
        >
          <View style={styles.badge}>
            <Icon
              name="sparkles-outline"
              size={16}
              color={mode === "dark" ? "#C7D2FE" : "#655CFF"}
            />
            <Text style={styles.badgeText}>AI Resume Studio</Text>
          </View>
        </Animated.View>

        <View style={styles.heroArea}>
          <Animated.View
            style={[
              styles.glowOrb,
              {
                opacity: orbOpacity,
                transform: [{ scale: orbScale }],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.spark,
              styles.sparkOne,
              { opacity: spark1, transform: [{ scale: spark1 }] },
            ]}
          />
          <Animated.View
            style={[
              styles.spark,
              styles.sparkTwo,
              { opacity: spark2, transform: [{ scale: spark2 }] },
            ]}
          />
          <Animated.View
            style={[
              styles.spark,
              styles.sparkThree,
              { opacity: spark3, transform: [{ scale: spark3 }] },
            ]}
          />
          <Animated.View
            style={[
              styles.spark,
              styles.sparkFour,
              { opacity: spark4, transform: [{ scale: spark4 }] },
            ]}
          />

          <Animated.View
            style={[
              styles.heroCard,
              {
                opacity: heroOpacity,
                transform: [{ scale: heroScale }, { translateY: heroFloat }],
              },
            ]}
          >
            <LinearGradient
              colors={
                mode === "dark"
                  ? ["rgba(96,104,255,0.34)", "rgba(236,72,153,0.14)"]
                  : ["rgba(120,129,255,0.20)", "rgba(236,72,153,0.10)"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroBorder}
            >
              <View style={styles.heroInner}>
                <Image
                  source={require("../assets/app-icon.png")}
                  style={styles.heroImage}
                  resizeMode="cover"
                />
              </View>
            </LinearGradient>
          </Animated.View>
        </View>

        <Animated.View
          style={[
            styles.brandWrap,
            {
              opacity: brandOpacity,
              transform: [{ translateY: brandY }],
            },
          ]}
        >
          <Text style={styles.brand}>AIRESUMEASSISTANT</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.textWrap,
            {
              opacity: textOpacity,
              transform: [{ translateY: textY }],
            },
          ]}
        >
          <Text style={styles.title}>AI Resume Builder</Text>
          <Text style={styles.title}>& Fixer</Text>

          <Text style={styles.subtitle}>
            Build new resumes or improve existing ones with AI
          </Text>
        </Animated.View>
      </View>

      <View style={styles.bottomWrap}>
        <View style={styles.loaderHalo} />

        <View style={styles.loaderTrack}>
          <Animated.View
            style={[styles.loaderFillWrap, { width: progressWidth }]}
          >
            <LinearGradient
              colors={["#5B4FF6", "#69A8FF", "#F0ABFC"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.loaderFill}
            />
            <Animated.View
              style={[
                styles.loaderShimmer,
                { transform: [{ translateX: shimmerTranslateX }] },
              ]}
            />
          </Animated.View>
        </View>

        <Text style={styles.loadingText}>Preparing your workspace...</Text>
      </View>
    </LinearGradient>
  );
}

const makeStyles = (mode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },

    content: {
      flex: 1,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 40,
    },

    badgeWrap: {
      marginBottom: 26,
      alignSelf: "center",
    },

    badge: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 999,
      backgroundColor:
        mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.88)",
      borderWidth: 1,
      borderColor:
        mode === "dark" ? "rgba(255,255,255,0.10)" : "rgba(99,102,241,0.08)",
      shadowColor: "#8B82FF",
      shadowOpacity: 0.08,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 6 },
      elevation: 2,
    },

    badgeText: {
      marginLeft: 8,
      fontSize: 13,
      fontWeight: "700",
      color: mode === "dark" ? "#C7D2FE" : "#655CFF",
      textAlign: "center",
    },

    heroArea: {
      width: "100%",
      height: 330,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      marginBottom: 20,
    },

    glowOrb: {
      position: "absolute",
      width: 320,
      height: 320,
      borderRadius: 160,
      backgroundColor:
        mode === "dark" ? "rgba(99,102,241,0.18)" : "rgba(166,177,255,0.10)",
      shadowColor: "#8B82FF",
      shadowOpacity: 0.28,
      shadowRadius: 52,
      shadowOffset: { width: 0, height: 0 },
      elevation: 6,
      alignSelf: "center",
    },

    heroCard: {
      width: 258,
      height: 258,
      borderRadius: 56,
      shadowColor: "#8B82FF",
      shadowOpacity: mode === "dark" ? 0.24 : 0.12,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 10 },
      elevation: 8,
      alignSelf: "center",
    },

    heroBorder: {
      flex: 1,
      borderRadius: 56,
      padding: 4,
    },

    heroInner: {
      flex: 1,
      borderRadius: 52,
      backgroundColor:
        mode === "dark" ? "rgba(12,16,30,0.96)" : "rgba(15,20,38,0.96)",
      overflow: "hidden",
      alignItems: "center",
      justifyContent: "center",
    },

    heroImage: {
      width: "100%",
      height: "100%",
      borderRadius: 52,
      alignSelf: "center",
    },

    spark: {
      position: "absolute",
      borderRadius: 999,
      backgroundColor: "#FFFFFF",
    },

    sparkOne: {
      top: 40,
      left: 58,
      width: 6,
      height: 6,
      shadowColor: "#FFFFFF",
      shadowOpacity: 0.95,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 0 },
    },

    sparkTwo: {
      top: 76,
      right: 64,
      width: 5,
      height: 5,
      shadowColor: "#F0ABFC",
      shadowOpacity: 0.95,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 0 },
    },

    sparkThree: {
      bottom: 66,
      left: 72,
      width: 5,
      height: 5,
      shadowColor: "#93C5FD",
      shadowOpacity: 0.95,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 0 },
    },

    sparkFour: {
      bottom: 42,
      right: 82,
      width: 4,
      height: 4,
      shadowColor: "#E9D5FF",
      shadowOpacity: 0.95,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 0 },
    },

    brandWrap: {
      width: "100%",
      alignItems: "center",
      marginBottom: 14,
    },

    brand: {
      fontSize: 24,
      lineHeight: 30,
      fontWeight: "900",
      letterSpacing: 0.6,
      color: mode === "dark" ? "#F8FAFC" : "#353A7A",
      textAlign: "center",
    },

    textWrap: {
      alignItems: "center",
      width: "100%",
      paddingHorizontal: 0,
    },

    title: {
      fontSize: 25,
      lineHeight: 31,
      fontWeight: "800",
      color: mode === "dark" ? "#D5DAF8" : "#7D84AF",
      textAlign: "center",
    },

    subtitle: {
      marginTop: 18,
      fontSize: 16,
      lineHeight: 24,
      fontWeight: "500",
      color: mode === "dark" ? "#9CA3AF" : "#8C93B1",
      textAlign: "center",
      maxWidth: 320,
      alignSelf: "center",
    },

    bottomWrap: {
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      paddingBottom: 46,
    },

    loaderHalo: {
      position: "absolute",
      top: -2,
      width: 230,
      height: 30,
      borderRadius: 999,
      backgroundColor:
        mode === "dark" ? "rgba(99,102,241,0.10)" : "rgba(168,85,247,0.08)",
      shadowColor: "#C4B5FD",
      shadowOpacity: 0.32,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 0 },
    },

    loaderTrack: {
      width: 205,
      height: 12,
      borderRadius: 999,
      overflow: "hidden",
      backgroundColor:
        mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(123,129,255,0.16)",
      marginBottom: 16,
    },

    loaderFillWrap: {
      height: "100%",
      borderRadius: 999,
      overflow: "hidden",
    },

    loaderFill: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 999,
    },

    loaderShimmer: {
      position: "absolute",
      top: -6,
      width: 70,
      height: 24,
      borderRadius: 999,
      backgroundColor: "rgba(255,255,255,0.35)",
    },

    loadingText: {
      fontSize: 13,
      fontWeight: "600",
      color: mode === "dark" ? "#94A3B8" : "#66748B",
      textAlign: "center",
    },
  });


