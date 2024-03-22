import { useMemo, useState } from "react";
import { router, useLocalSearchParams, useRouter } from "expo-router";

import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { Button } from "react-native-paper";

import { black, primary, text2 } from "@/constants/Colors";
import Input from "@/components/input";

const ChangePassword = () => {
  const { email }: any = useLocalSearchParams();

  const [inputs, setInputs] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    password: null,
    confirmPassword: null,
  });

  const validate = useMemo(() => {
    return () => {
      Keyboard.dismiss();
      let valid = true;
      if (!inputs.password) {
        handleError("Ce champ est obligatoire", "password");
        valid = false;
      } else if (inputs.password.length < 6) {
        handleError(
          "Le mot de passe doit comporter au moins 8 caractères",
          "password"
        );
        valid = false;
      }

      if (!inputs.confirmPassword) {
        handleError("Ce champ est obligatoire", "confirmPassword");
        valid = false;
      } else if (inputs.confirmPassword !== inputs.password) {
        handleError(
          "Les mot de passes doivent etre identique",
          "confirmPassword"
        );
        valid = false;
      }

      return valid;
    };
  }, [inputs]);

  const handleError = (errorMessage: string | null, input: string) => {
    setErrors((prevState) => ({ ...prevState, [input]: errorMessage }));
  };

  const handleOnChange = (text: string, input: string) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };

  const handleChangePassword = async () => {
    const valid = validate();

    if (valid) {
      router.push({
        pathname: "/reset-otp",
        params: {
          password: inputs.password,
          email,
        },
      });
    }
  };

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
                Réinitialiser votre mot de passe
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: text2,
                }}
              >
                Les mots de passe forts comprennent des chiffres, des lettres et
                des signes de ponctuation.
              </Text>
            </View>
            <View
              style={{
                flexDirection: "column",
                gap: 16,
                paddingTop: 60,
              }}
            >
              <Input
                textContentType={"oneTimeCode"}
                password
                keyboardType="visible-password"
                onChangeText={(text: string) =>
                  handleOnChange(text, "password")
                }
                placeholder="****************"
                label="Mot de passe"
                error={errors.password}
                onFocus={() => {
                  handleError(null, "password");
                }}
              />
              <Input
                textContentType={"oneTimeCode"}
                password
                keyboardType="visible-password"
                onChangeText={(text: string) =>
                  handleOnChange(text, "confirmPassword")
                }
                placeholder="****************"
                label="Confirmer Mot de passe"
                error={errors.confirmPassword}
                onFocus={() => {
                  handleError(null, "confirmPassword");
                }}
              />
            </View>
          </View>
          <Button
            style={{
              borderRadius: 4,
              height: 45,
              justifyContent: "center",
              marginTop: 16,
            }}
            mode="contained"
            buttonColor={primary}
            onPress={handleChangePassword}
          >
            <Text
              style={{
                fontSize: 16,
                color: "white",
                fontWeight: "600",
              }}
            >
              Réinitialiser
            </Text>
          </Button>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default ChangePassword;
