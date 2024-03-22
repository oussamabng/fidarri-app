import { useRouter } from "expo-router";
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  StatusBar,
} from "react-native";
import { Button } from "react-native-paper";

import { black, primary, text2 } from "@/constants/Colors";

const Id = () => {
  const navigation = useRouter();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
      keyboardVerticalOffset={0}
    >
      <StatusBar barStyle="dark-content" />
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
            paddingTop: 70,
            padding: 25,
          }}
        >
          <View
            style={{
              gap: 34,
              flex: 1,
              flexGrow: 1,
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
                  maxWidth: 350,
                }}
              >
                Vérifiez Votre Identité
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: text2,
                }}
              >
                Veuillez noter que tous les documents téléchargés seront stockés
                en toute sécurité et resteront strictement confidentiels. Nous
                prenons votre vie privée très au sérieux et n'utiliserons vos
                informations qu'à des fins de vérification.
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 70,
              }}
            >
              <Image
                source={require("@/assets/images/cardid.png")}
                style={{
                  width: 250,
                  height: 160,
                  objectFit: "contain",
                  paddingVertical: 70,
                }}
                alt="id"
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 40,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              style={{
                borderRadius: 4,
                height: 45,
                justifyContent: "center",
                flex: 1,
              }}
              mode="contained"
              buttonColor={primary}
              onPress={() => navigation.replace("/freelancer/(auth)/scanId")}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "white",
                  fontWeight: "600",
                }}
              >
                Prendre une photo
              </Text>
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Id;
