import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import DashboardScreen from "../screens/DashboardScreen";
import SettingsScreen from "../screens/SettingsScreen";
import UploadResumeScreen from "../screens/UploadResumeScreen";
import AnalyzeScreen from "../screens/AnalyzeScreen";
import ResultsScreen from "../screens/ResultsScreen";
import VerifyEmailScreen from "../screens/VerifyEmailScreen";
import ForgotOtpScreen from "../screens/ForgotOtpScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import ResumePreviewScreen from "../screens/ResumePreviewScreen";
import TemplateSelectScreen from "../screens/TemplateSelectScreen";
import ResumeTemplatePreviewScreen from "../screens/ResumeTemplatePreviewScreen";
import SplashScreen from "../screens/SplashScreen";
import OnboardingScreen1 from "../screens/OnboardingScreen1";
import OnboardingScreen2 from "../screens/OnboardingScreen2";
import OnboardingScreen3 from "../screens/OnboardingScreen3";
import CreateResumeScreen from "../screens/CreateResumeScreen";
import GeneratedResumePreviewScreen from "../screens/GeneratedResumePreviewScreen";


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />

      <Stack.Screen name="Onboarding1" component={OnboardingScreen1} />
      <Stack.Screen name="Onboarding2" component={OnboardingScreen2} />
      <Stack.Screen name="Onboarding3" component={OnboardingScreen3} />

      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotOtp" component={ForgotOtpScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />

      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="UploadResume" component={UploadResumeScreen} />
      <Stack.Screen name="Analyze" component={AnalyzeScreen} />
      <Stack.Screen name="Results" component={ResultsScreen} />
      <Stack.Screen name="ResumePreview" component={ResumePreviewScreen} />
      <Stack.Screen name="TemplateSelect" component={TemplateSelectScreen} />
      <Stack.Screen name="CreateResume" component={CreateResumeScreen} />

      <Stack.Screen
        name="GeneratedResumePreview"
        component={GeneratedResumePreviewScreen}
      />
      <Stack.Screen
        name="ResumeTemplatePreview"
        component={ResumeTemplatePreviewScreen}
      />
    </Stack.Navigator>
  );
}