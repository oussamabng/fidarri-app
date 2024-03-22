import { Tabs } from "expo-router";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { primary, text4, text5 } from "@/constants/Colors";
import { useMenuStore } from "@/store/useMenuStore";
import { useEffect, useRef } from "react";
import { Animated, View, Text, Image, Pressable, Platform } from "react-native";
import BackHeader from "@/components/backHeader";
import { useTranslation } from "react-i18next";

const FreelancerLayout = () => {
  const translateMenu = useRef(new Animated.Value(0)).current;
  const translateYMenu = useRef(new Animated.Value(0)).current;
  const scaleBtn = useRef(new Animated.Value(1)).current;
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const { opened, update } = useMenuStore((state: any) => ({
    opened: state.opened,
    update: state.update,
  }));

  useEffect(() => {
    Animated.timing(translateMenu, {
      toValue: opened ? (i18n.language === "ar" ? -280 : 280) : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(translateYMenu, {
      toValue: opened ? -40 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(scaleBtn, {
      toValue: opened ? 0.88 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [opened]);

  return (
    <Tabs
      screenOptions={{
        headerShadowVisible: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: primary,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: Platform.OS === "android" ? 10 : 25,
          left: 20,
          right: 20,
          borderTopWidth: 0,
          backgroundColor: "#FAFAFA",
          borderRadius: 15,
          height: 60,
          shadowColor: primary,
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.15,
          shadowRadius: 3.5,
          elevation: 5,
          transform: [
            {
              translateX: translateMenu,
            },
            {
              translateY: translateYMenu,
            },
            {
              scale: scaleBtn,
            },
          ],
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
                top: Platform.OS === "android" ? 0 : 15,
              }}
            >
              <Ionicons name="stats-chart" size={size} color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="missions"
        options={{
          tabBarIcon: ({ color, size }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
                top: Platform.OS === "android" ? 0 : 15,
              }}
            >
              <Feather name="check-circle" size={size} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
};

export default FreelancerLayout;
