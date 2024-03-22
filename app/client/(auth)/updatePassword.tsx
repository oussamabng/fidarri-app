import { useMemo, useState } from "react";
import { router, useRouter } from "expo-router";

import { View, Text, SafeAreaView, Pressable, Keyboard } from "react-native";
import { Button } from "react-native-paper";

import { black, primary } from "@/constants/Colors";
import { RFValue } from "react-native-responsive-fontsize";
import Input from "@/components/input";
import { updatePassword } from "@/graphql/services/auth.service";
import { useAuthStore } from "@/store/useAuthStore";
import AuthProvider from "@/components/authProvider";
import { useTranslation } from "react-i18next";
import KeyboardAvoidingViewWrapper from "@/components/keyboardAvoidingViewWrapper";

const UpdatePassword = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const { access } = useAuthStore((state: any) => ({
    access: state.access,
  }));

  const [loading, setLoading] = useState(false);

  const [inputs, setInputs] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [errors, setErrors] = useState({
    oldPassword: null,
    newPassword: null,
  });

  const handleError = (errorMessage: string | null, input: string) => {
    setErrors((prevState) => ({ ...prevState, [input]: errorMessage }));
  };

  const handleOnChange = (text: string, input: string) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };

  const validate = useMemo(() => {
    return () => {
      Keyboard.dismiss();
      let valid = true;

      if (!inputs.oldPassword) {
        handleError("Ce champ est obligatoire", "oldPassword");
        valid = false;
      }
      if (!inputs.newPassword) {
        handleError("Ce champ est obligatoire", "newPassword");
        valid = false;
      } else if (inputs.newPassword.length < 8) {
        handleError(
          "Le mot de passe doit comporter au moins 8 caractères",
          "newPassword"
        );
        valid = false;
      }

      return valid;
    };
  }, [inputs]);

  const handleChangePassword = async () => {
    setLoading(true);
    const { data, error } = await updatePassword(
      inputs.oldPassword,
      inputs.newPassword,
      access
    );
    console.log("UPDATE PASSWORD FREELANCER");
    console.log(data);
    if (error) {
      setLoading(false);
      return alert(data);
    } else {
      setLoading(false);
      router.back();
    }
  };

  return (
    <AuthProvider>
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
                    textAlign: isArabic ? "right" : "left",
                  }}
                >
                  {t("Mot de passe")}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "column",
                  gap: RFValue(12),
                }}
              >
                <Input
                  arabic={isArabic}
                  label={t("Ancien mot de passe")}
                  disabledBg
                  value={inputs.oldPassword}
                  onChangeText={(text: string) =>
                    handleOnChange(text, "oldPassword")
                  }
                  error={errors.oldPassword}
                  onFocus={() => {
                    handleError(null, "oldPassword");
                  }}
                  password
                />
                <Input
                  arabic={isArabic}
                  label={t("Nouveau mot de passe")}
                  disabledBg
                  value={inputs.newPassword}
                  onChangeText={(text: string) =>
                    handleOnChange(text, "newPassword")
                  }
                  error={errors.newPassword}
                  onFocus={() => {
                    handleError(null, "newPassword");
                  }}
                  password
                />
              </View>
            </View>
            <View
              style={{
                paddingTop: RFValue(10),
                flexDirection: "column",
                gap: RFValue(20),
              }}
            >
              <Button
                style={{
                  borderRadius: 4,
                  height: 45,
                  justifyContent: "center",
                }}
                loading={loading}
                mode="contained"
                buttonColor={primary}
                onPress={() => {
                  const valid = validate();

                  if (valid) {
                    handleChangePassword();
                  }
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "white",
                    fontWeight: "600",
                  }}
                >
                  {t("Mise à jour")}
                </Text>
              </Button>
              {/*   <Pressable
                onPress={() => {
                  navigation.push("/forgetPassword");
                }}
                style={{
                  alignItems: isArabic ? "flex-start" : "flex-end",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: primary,
                    fontWeight: "500",
                  }}
                >
                  {t("Mot de passe oublié ?")}
                </Text>
              </Pressable> */}
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingViewWrapper>
    </AuthProvider>
  );
};

export default UpdatePassword;
