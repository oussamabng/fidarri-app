import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { primary } from "@/constants/Colors";
import { useMenuStore } from "@/store/useMenuStore";
import { useEffect, useRef } from "react";
import { Animated, View, Platform } from "react-native";
import { useTranslation } from "react-i18next";
import { RFValue } from "react-native-responsive-fontsize";

const ClientLayout = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const translateMenu = useRef(new Animated.Value(0)).current;
  const translateYMenu = useRef(new Animated.Value(0)).current;
  const scaleBtn = useRef(new Animated.Value(1)).current;

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
        tabBarItemStyle: {
          height: RFValue(60),
        },
        tabBarStyle: {
          position: "absolute",
          bottom: Platform.OS === "android" ? 10 : 25,
          left: 20,
          right: 20,
          borderTopWidth: 0,
          backgroundColor: "#FAFAFA",
          borderRadius: 15,
          height: RFValue(60),
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
          flexDirection: "row",
        },
      }}
    >
      {isArabic ? (
        <Tabs.Screen
          name="bookmark"
          options={{
            tabBarIcon: ({ color, size }) => (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Feather name="bookmark" size={size} color={color} />
              </View>
            ),
          }}
        />
      ) : (
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color, size }) => (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Feather name="home" size={size} color={color} />
              </View>
            ),
          }}
        />
      )}

      <Tabs.Screen
        name="freelancers"
        options={{
          tabBarIcon: ({ color, size }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
              }}
            >
              <Feather name="users" size={size} color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="offers"
        options={{
          tabBarIcon: ({ color, size }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather name="check-circle" size={size} color={color} />
            </View>
          ),
        }}
      />
      {isArabic ? (
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color, size }) => (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Feather name="home" size={size} color={color} />
              </View>
            ),
          }}
        />
      ) : (
        <Tabs.Screen
          name="bookmark"
          options={{
            tabBarIcon: ({ color, size }) => (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Feather name="bookmark" size={size} color={color} />
              </View>
            ),
          }}
        />
      )}
    </Tabs>
  );
};

export default ClientLayout;
