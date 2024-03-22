import { useMemo, useState } from "react";
import { router } from "expo-router";

import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { Button } from "react-native-paper";

import { black, primary } from "@/constants/Colors";
import Input from "@/components/input";
import { checkPhoneNumberAvailability } from "@/graphql/services/auth.service";
import { updatePhone } from "@/graphql/services/profile.service";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileStore } from "@/store/useProfileStore";
import { useTranslation } from "react-i18next";
import KeyboardAvoidingViewWrapper from "@/components/keyboardAvoidingViewWrapper";

const UpdatePhone = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const { id, access } = useAuthStore((state: any) => ({
    id: state.id,
    access: state.access,
  }));

  const { updatePhone: updateStorePhone } = useProfileStore((state: any) => ({
    updatePhone: state.updatePhone,
  }));

  const [inputs, setInputs] = useState({
    phone: "",
  });

  const [errors, setErrors] = useState({
    phone: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChangePhone = async () => {
    const phoneNumber = "+213" + inputs.phone;

    setLoading(true);
    const { data, error } = await updatePhone(
      parseInt(id),
      access,
      phoneNumber
    );

    if (error) {
      setLoading(false);
      return alert(`Error : ${data}`);
    } else {
      updateStorePhone(phoneNumber);
      setLoading(false);

      setTimeout(() => {
        router.back();
      }, 1000);
    }
  };

  const checkPhone = async (phoneNumber: string) => {
    const { error } = await checkPhoneNumberAvailability(phoneNumber);

    return !error;
  };

  const validate = useMemo(() => {
    return () => {
      Keyboard.dismiss();
      let valid = true;

      const phoneNumber = "+213" + inputs.phone;

      if (!inputs.phone) {
        handleError("Ce champ est obligatoire", "phone");
        valid = false;
      } else if (
        phoneNumber.length !== 13 ||
        !(
          inputs.phone[0] === "5" ||
          inputs.phone[0] === "6" ||
          inputs.phone[0] === "7"
        )
      ) {
        handleError(
          "Numéro de téléphone non valide. Exemple : +213 559093326",
          "phone"
        );
        valid = false;
      } else {
        const available = checkPhone(phoneNumber);
        if (!available) {
          handleError("Numéro de téléphone non disponible.", "phone");
          valid = false;
        }
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

  return (
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
                {t("Numéro téléphone")}
              </Text>
            </View>
            <Input
              keyboardType="phone-pad"
              onChangeText={(text: string) => handleOnChange(text, "phone")}
              label={t("Numéro téléphone")}
              error={errors.phone}
              phone
              onFocus={() => {
                handleError(null, "phone");
              }}
            />
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
            onPress={handleChangePhone}
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
        </View>
      </SafeAreaView>
    </KeyboardAvoidingViewWrapper>
  );
};

export default UpdatePhone;
