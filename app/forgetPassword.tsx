import { useMemo, useState } from "react";
import { useRouter } from "expo-router";

import { View, Text, SafeAreaView, Keyboard } from "react-native";
import { Button } from "react-native-paper";

import { black, primary, text2 } from "@/constants/Colors";
import KeyboardAvoidingViewWrapper from "@/components/keyboardAvoidingViewWrapper";
import { RFValue } from "react-native-responsive-fontsize";
import Input from "@/components/input";
import { requestResetPassword } from "@/graphql/services/auth.service";
import { isValidEmail } from "@/constants/Helpers";
import AuthProvider from "@/components/authProvider";
import { useTranslation } from "react-i18next";

const ForgetPassword = () => {
  const navigation = useRouter();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [loading, setLoading] = useState(false);

  const [inputs, setInputs] = useState({
    email: "",
  });

  const [errors, setErrors] = useState({
    email: null,
  });

  const validate = useMemo(() => {
    return () => {
      Keyboard.dismiss();
      let valid = true;
      if (!inputs.email) {
        handleError("Ce champ est obligatoire", "email");
        valid = false;
      } else if (!isValidEmail(inputs.email)) {
        handleError("Adresse email non valide", "email");
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

  const handleRequestResetPassword = async () => {
    const valid = validate();

    if (valid) {
      setLoading(true);
      const { data, error } = await requestResetPassword(inputs.email);
      if (error) {
        setLoading(false);
        alert(data);
      } else {
        setLoading(false);
        navigation.replace({
          pathname: "/freelancer/changePassword",
          params: {
            email: inputs.email,
          },
        });
      }
    }
  };

  return (
    <AuthProvider checkLogout>
      <KeyboardAvoidingViewWrapper>
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
              gap: RFValue(20),
            }}
          >
            <View
              style={{
                gap: RFValue(20),
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  gap: RFValue(6),
                }}
              >
                <Text
                  style={{
                    fontSize: RFValue(24),
                    color: black,
                    fontWeight: "600",
                  }}
                >
                  Mot de passe oublié
                </Text>
                <Text
                  style={{
                    fontSize: RFValue(12),
                    color: text2,
                  }}
                >
                  Ne vous inquiétez pas ! Cela arrivera. Veuillez saisir
                  l'e-mail associé pour recevoir les instructions de
                  réinitialisation du mot de passe
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "column",
                  paddingVertical: RFValue(16),
                }}
              >
                <Input
                  keyboardType="email-address"
                  onChangeText={(text: string) => handleOnChange(text, "email")}
                  placeholder="johndoe@gmail.com"
                  label="Adresse e-mail"
                  error={errors.email}
                  onFocus={() => {
                    handleError(null, "email");
                  }}
                />
              </View>
            </View>
            <Button
              style={{
                borderRadius: 4,
                height: 45,
                justifyContent: "center",
              }}
              loading={loading}
              mode="contained"
              buttonColor={primary}
              onPress={handleRequestResetPassword}
            >
              <Text
                style={{
                  fontSize: RFValue(14),
                  color: "white",
                  fontWeight: "600",
                }}
              >
                Envoyer des instructions
              </Text>
            </Button>
            {/*   <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <Pressable
              onPress={() => {
                setMethod((prevState) =>
                  prevState === "email" ? "phone" : "email"
                );
              }}
            >
              <Text
                style={{
                  color: primary,
                  fontSize: RFValue(12),
                  fontWeight: "500",
                }}
              >
                Essayez une autre façon
              </Text>
            </Pressable>
          </View> */}
          </View>
        </SafeAreaView>
      </KeyboardAvoidingViewWrapper>
    </AuthProvider>
  );
};

export default ForgetPassword;
