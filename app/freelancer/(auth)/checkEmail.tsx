import { useRouter } from "expo-router";
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Image,
} from "react-native";
import { TextInput, Button } from "react-native-paper";

import { black, primary, text2 } from "@/constants/Colors";

const CheckEmail = () => {
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
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flexDirection: "column",
            flex: 1,
            paddingTop: 70,
            padding: 25,
            gap: 24,
          }}
        >
          <View
            style={{
              gap: 34,
              flex: 1,
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
                }}
              >
                Vérifier votre e-mail
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: text2,
                }}
              >
                Nous avons envoyé une instruction de récupération de mot de
                passe à votre adresse e-mail. veuillez vérifier votre boîte de
                réception.
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: 20,
              }}
            >
              <Image
                style={{
                  width: 200,
                  height: 120,
                  objectFit: "contain",
                }}
                source={require("@/assets/images/checkEmail.png")}
                alt="check-email"
              />
            </View>
          </View>
          <Button
            style={{
              borderRadius: 4,
              height: 45,
              justifyContent: "center",
            }}
            mode="contained"
            buttonColor={primary}
            onPress={() => {}}
          >
            <Text
              style={{
                fontSize: 16,
                color: "white",
                fontWeight: "600",
              }}
            >
              Ouvrir la boite E-mail
            </Text>
          </Button>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default CheckEmail;
