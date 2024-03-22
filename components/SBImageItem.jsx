import React from "react";
import { StyleSheet, View, ActivityIndicator, Image, Text } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useTranslation } from "react-i18next";

export const SBImageItem = ({ style, index: _index, showIndex = true }) => {
  const { t, i18n } = useTranslation();
  const index = (_index || 0) + 1;
  const source = React.useRef({
    uri: `https://picsum.photos/id/${index}/400/300`,
  }).current;

  const data = [
    {
      title: t("Utilisez le code promo"),
      subtitle: t("Une réduction de 30 % sur votre prochain service."),
    },

    {
      title: t("Pour nos clients fidèles"),
      subtitle: t("Recevez un service gratuit après 10 réservations."),
    },
    {
      title: t("Bienvenue à bord!"),
      subtitle: t(
        "Bénéficiez d'une réduction de 20 % sur votre premier service."
      ),
    },

    {
      title: t("Parrainez un ami"),
      subtitle: t("et obtenez 15 % de réduction lorsque votre ami réserve."),
    },
  ];

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size="small" />
      <Image key={index} style={styles.image} source={source} />
      <View
        style={{
          position: "absolute",
          left: RFValue(0),
          top: RFValue(0),
          bottom: RFValue(0),
          right: RFValue(0),
          backgroundColor: "rgba(0,0,0,0.4)",
        }}
      >
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: i18n.language === "ar" ? "flex-end" : "flex-start",
            gap: 10,
            flexGrow: 1,
            padding: RFValue(20),
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 10,
              fontWeight: "600",
              textAlign: i18n.language === "ar" ? "right" : "left",
            }}
          >
            {data[index - 1].title}
          </Text>
          <Text
            style={{
              color: "white",
              fontSize: 12,
              fontWeight: "bold",
              maxWidth: 180,
              textAlign: i18n.language === "ar" ? "right" : "left",
            }}
          >
            {data[index - 1].subtitle}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 10, // Add a default margin for the first item
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
