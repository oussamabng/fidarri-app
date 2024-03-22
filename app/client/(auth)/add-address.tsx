import AuthProvider from "@/components/authProvider";
import Dropdown from "@/components/dropdown";
import Input from "@/components/input";
import KeyboardAvoidingViewWrapper from "@/components/keyboardAvoidingViewWrapper";
import NumericInput from "@/components/numericInput";
import { black, primary } from "@/constants/Colors";
import { createClientAddresses } from "@/graphql/services/addresses.service";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { View, Text, Keyboard, SafeAreaView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { useTranslation } from "react-i18next";

const AddAddresses = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigation = useRouter();

  const { access, id } = useAuthStore((state: any) => ({
    access: state.access,
    id: state.id,
  }));

  const [inputs, setInputs] = useState({
    adr: "",
    province: "",
    wilaya: "",
    code: "",
    numberOfPieces: 1,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    adr: null,
    province: null,
    wilaya: null,
    code: null,
  });

  const validate = useMemo(() => {
    return () => {
      Keyboard.dismiss();
      let valid = true;

      if (!inputs.adr) {
        handleError("Ce champ est obligatoire", "adr");
        valid = false;
      }

      if (!inputs.wilaya) {
        handleError("Ce champ est obligatoire", "wilaya");
        valid = false;
      }

      if (!inputs.code) {
        handleError("Ce champ est obligatoire", "code");
        valid = false;
      }

      if (!inputs.province) {
        handleError("Ce champ est obligatoire", "province");
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

  const createNewClientHome = async () => {
    setLoading(true);
    const { data, error } = await createClientAddresses(
      id,
      access,
      inputs.wilaya,
      inputs.province,
      inputs.adr,
      inputs.code,
      inputs.numberOfPieces
    );
    console.log("data", data);
    setLoading(false);

    if (error) {
      return alert("Error on creating adr");
    }

    navigation.back();
  };

  return (
    <AuthProvider>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "white",
        }}
      >
        <KeyboardAwareScrollView
          bounces={false}
          style={{
            flex: 1,
            flexDirection: "column",
          }}
        >
          <View
            style={{
              paddingHorizontal: RFValue(25),
            }}
          >
            <Text
              style={{
                fontSize: RFValue(24),
                color: black,
                fontWeight: "600",
                textAlign: isArabic ? "right" : "left",
              }}
            >
              {t("Ajouter une adresse")}
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              paddingHorizontal: RFValue(25),
              paddingVertical: RFValue(50),
            }}
          >
            <View
              style={{
                flexDirection: "column",
                gap: RFValue(20),
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  gap: RFValue(16),
                }}
              >
                <Input
                  onChangeText={(text: string) => handleOnChange(text, "adr")}
                  error={errors.adr}
                  onFocus={() => {
                    handleError(null, "adr");
                  }}
                  arabic={isArabic}
                  label={t("Adresse")}
                />
                <Input
                  arabic={isArabic}
                  label={t("Province")}
                  onChangeText={(text: string) =>
                    handleOnChange(text, "province")
                  }
                  error={errors.province}
                  onFocus={() => {
                    handleError(null, "province");
                  }}
                />
                <Input
                  arabic={isArabic}
                  label={t("Wilaya")}
                  onChangeText={(text: string) =>
                    handleOnChange(text, "wilaya")
                  }
                  error={errors.wilaya}
                  onFocus={() => {
                    handleError(null, "wilaya");
                  }}
                />

                <Input
                  arabic={isArabic}
                  onChangeText={(text: string) => handleOnChange(text, "code")}
                  error={errors.code}
                  onFocus={() => {
                    handleError(null, "code");
                  }}
                  label={t("Code postal")}
                />
                <View
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: isArabic ? "row-reverse" : "row",
                  }}
                >
                  <Text
                    style={{
                      fontSize: RFValue(14),
                      color: "#4F4F50",
                    }}
                  >
                    {t("Nombre de pieces")}
                  </Text>
                  <NumericInput
                    value={inputs.numberOfPieces}
                    plus={() => {
                      setInputs((prevState) => ({
                        ...prevState,
                        numberOfPieces: prevState.numberOfPieces + 1,
                      }));
                    }}
                    minus={() => {
                      setInputs((prevState) => ({
                        ...prevState,
                        numberOfPieces: prevState.numberOfPieces - 1,
                      }));
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <View
          style={{
            flexDirection: "column",
            gap: RFValue(16),
            paddingHorizontal: RFValue(25),
          }}
        >
          <Button
            style={{
              borderRadius: 4,
              height: 45,
              justifyContent: "center",
            }}
            mode="contained"
            buttonColor={primary}
            loading={loading}
            onPress={() => {
              const validation = validate();
              if (validation) {
                createNewClientHome();
              }
            }}
          >
            <Text
              style={{
                fontSize: RFValue(14),
                color: "white",
                fontWeight: "600",
              }}
            >
              {t("Ajouter")}
            </Text>
          </Button>
          <Button
            style={{
              borderRadius: 4,
              height: 45,
              justifyContent: "center",
            }}
            mode="outlined"
            buttonColor={"white"}
            onPress={() => {
              navigation.back();
            }}
          >
            <Text
              style={{
                fontSize: RFValue(14),
                color: "#6F6F6F",
                fontWeight: "600",
              }}
            >
              {t("Annuler")}
            </Text>
          </Button>
        </View>
      </SafeAreaView>
    </AuthProvider>
  );
};

export default AddAddresses;
