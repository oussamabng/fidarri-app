import { useCallback } from "react";
import { useFocusEffect, useRouter } from "expo-router";

import { View, Text, Image } from "react-native";
import { text2 } from "@/constants/Colors";

const OneMoreStep = () => {
  const navigation = useRouter();

  useFocusEffect(
    useCallback(() => {
      setTimeout(() => {
        navigation.replace("/username");
      }, 2000);
    }, [])
  );
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 70,
        backgroundColor: "white",
      }}
    >
      <Image
        style={{
          width: 200,
          height: 250,
          objectFit: "contain",
        }}
        source={require("@/assets/images/onemore.png")}
        alt="Fidarri"
      />
      <View
        style={{
          flexDirection: "column",
          gap: 6,
          alignItems: "center",
          paddingHorizontal: 25,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            color: "#383737",
            fontWeight: "600",
          }}
        >
          Il reste encore une étape !
        </Text>
        <Text
          style={{
            textAlign: "center",
            fontSize: 14,
            color: text2,
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus, eget
          erat bibendum in magna pretium rhoncus ut.{" "}
        </Text>
      </View>
    </View>
  );
};

export default OneMoreStep;
