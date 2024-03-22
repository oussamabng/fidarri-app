import { useState } from "react";
import { useRouter } from "expo-router";

import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { TextInput, Button } from "react-native-paper";

import { black, primary, text2 } from "@/constants/Colors";

const UpdateEmail = () => {
  const navigation = useRouter();

  const [method, setMethod] = useState("email");

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
            padding: 25,
            gap: 24,
          }}
        >
          <View
            style={{
              gap: 34,
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
                Adresse E-Mail
              </Text>
            </View>

            <TextInput
              style={{
                width: "100%",
                backgroundColor: "white",
                fontSize: 14,
                color: black,
              }}
              keyboardType="email-address"
              mode="outlined"
              outlineColor="#E0E1E4"
              activeOutlineColor={primary}
              label="Adresse e-mail"
              returnKeyType="done"
            />
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
              Mise à jour
            </Text>
          </Button>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default UpdateEmail;
