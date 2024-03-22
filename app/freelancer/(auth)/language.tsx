import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";

import { black } from "@/constants/Colors";
import { RFValue } from "react-native-responsive-fontsize";
import { Feather } from "@expo/vector-icons";

import { useTranslation } from "react-i18next";

const Language = () => {
  const { i18n, t } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <View
        style={{
          flexDirection: "column",
          flex: 1,
          padding: RFValue(25),
          gap: RFValue(16),
        }}
      >
        <Text
          style={{
            fontSize: RFValue(24),
            color: black,
            fontWeight: "600",
            textAlign: isArabic ? "right" : "left"
          }}
        >
          {t("language")}
        </Text>
        <View
          style={{
            flexDirection: "column",
            paddingTop: RFValue(20),
          }}
        >
          <TouchableOpacity
            onPress={() => {
              i18n.language !== "fr" && i18n.changeLanguage("fr");
            }}
            style={{
              flexDirection: isArabic ? "row-reverse" : "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingVertical: RFValue(30),
            }}
          >
            <View

            >
              <Text
                style={{
                  fontSize: RFValue(14),
                  color: "#555555",
                }}
              >
                {i18n.language === "fr"
                  ? " Français"
                  : i18n.language === "en"
                    ? "French"
                    : "الفرنسية"}
              </Text>
            </View>

            {i18n.language === "fr" && (
              <Feather name="check" size={24} color="#46A56B" />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            i18n.language !== "en" && i18n.changeLanguage("en");
          }}
            style={{
              flexDirection: isArabic ? "row-reverse" : "row",
              alignItems: "center",
              justifyContent: "space-between", paddingBottom: RFValue(30)

            }}
          >
            <View

            >
              <Text
                style={{
                  fontSize: RFValue(14),
                  color: "#555555",
                }}
              >
                {i18n.language === "fr"
                  ? "Anglais"
                  : i18n.language === "en"
                    ? "English"
                    : "الإنجليزية"}
              </Text>
            </View>

            {i18n.language === "en" && (
              <Feather name="check" size={24} color="#46A56B" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              i18n.language !== "ar" && i18n.changeLanguage("ar");
            }}
            style={{
              flexDirection: isArabic ? "row-reverse" : "row",
              alignItems: "center",
              justifyContent: "space-between", paddingBottom: RFValue(30)

            }}
          >
            <View

            >
              <Text
                style={{
                  fontSize: RFValue(14),
                  color: "#555555",
                }}
              >
                {i18n.language === "fr"
                  ? "Arabe"
                  : i18n.language === "en"
                    ? "Arabic"
                    : "العربية"}
              </Text>
            </View>

            {i18n.language === "ar" && (
              <Feather name="check" size={24} color="#46A56B" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Language;
