import { useState } from "react";
import { useRouter } from "expo-router";

import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";

import { black } from "@/constants/Colors";
import { RFValue } from "react-native-responsive-fontsize";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

const Settings = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const navigation = useRouter();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flexDirection: "column",
            flex: 1,
            padding: RFValue(25),
            gap: RFValue(24),
          }}
        >
          <View
            style={{
              flexDirection: "column",
              gap: 6,
            }}
          >
            <Text
              style={{
                fontSize: 28,
                color: black,
                fontWeight: "600",
                textAlign: isArabic ? "right" : "left",
              }}
            >
              {t("settingsTitle")}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "column",
              gap: RFValue(25),
              paddingTop: RFValue(30),
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.push("/freelancer/(auth)/language");
              }}
              style={{
                flexDirection: isArabic ? "row-reverse" : "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#555555",
                  fontSize: RFValue(16),
                }}
              >
                {t("language")}
              </Text>
              <Feather
                name={isArabic ? "chevron-left" : "chevron-right"}
                size={20}
                color="#A1A1A1"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.push("/conditionsGenerale");
              }}
              style={{
                flexDirection: isArabic ? "row-reverse" : "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#555555",
                  fontSize: RFValue(16),
                }}
              >
                {t("privacyPolicy")}
              </Text>
              <Feather
                name={isArabic ? "chevron-left" : "chevron-right"}
                size={20}
                color="#A1A1A1"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.push("/politique");
              }}
              style={{
                flexDirection: isArabic ? "row-reverse" : "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#555555",
                  fontSize: RFValue(16),
                }}
              >
                {t("termsOfUse")}
              </Text>
              <Feather
                name={isArabic ? "chevron-left" : "chevron-right"}
                size={20}
                color="#A1A1A1"
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Settings;
