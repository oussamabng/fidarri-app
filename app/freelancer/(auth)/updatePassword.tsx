import { useMemo, useState } from "react";
import { router, useRouter } from "expo-router";

import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Keyboard,
} from "react-native";
import { TextInput, Button } from "react-native-paper";

import { black, primary, text2 } from "@/constants/Colors";
import { RFValue } from "react-native-responsive-fontsize";
import Input from "@/components/input";
import { updatePassword } from "@/graphql/services/auth.service";
import { useAuthStore } from "@/store/useAuthStore";

const UpdatePassword = () => {
  const navigation = useRouter();

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
                Mot de passe
              </Text>
            </View>

            <View
              style={{
                flexDirection: "column",
                gap: RFValue(12),
              }}
            >
              <Input
                label="Ancien mot de passe"
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
                label="Nouveau mot de passe"
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
                Mise à jour
              </Text>
            </Button>
            <Pressable
              onPress={() => {
                navigation.push("/forgetPassword");
              }}
              style={{
                alignItems: "flex-end",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: primary,
                  fontWeight: "500",
                }}
              >
                Mot de passe oublié ?
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default UpdatePassword;
