import { useMemo, useState } from "react";

import { black, primary, text2 } from "@/constants/Colors";
import {
  View,
  Text,
  Pressable,
  Dimensions,
  Keyboard,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { Button, Switch } from "react-native-paper";

import { useRouter } from "expo-router";

import { RFValue } from "react-native-responsive-fontsize";
import { isValidEmail } from "@/constants/Helpers";
import Input from "@/components/input";
import { useRegisterStore } from "@/store/useRegisterStore";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  checkEmailAvailability,
  checkPhoneNumberAvailability,
} from "@/graphql/services/auth.service";
import AuthProvider from "@/components/authProvider";

const Register = () => {
  const navigation = useRouter();
  const { registerForm, clearName } = useRegisterStore((state: any) => ({
    registerForm: state.registerForm,
    clearName: state.clearName,
  }));

  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [loading, setLoading] = useState(false);

  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    firstName: null,
    lastName: null,
    phone: null,
    email: null,
    password: null,
    confirmPassword: null,
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
      if (!inputs.password) {
        handleError("Ce champ est obligatoire", "password");
        valid = false;
      } else if (inputs.password.length < 6) {
        handleError(
          "Le mot de passe doit comporter au moins 8 caractères",
          "password"
        );
        valid = false;
      } else if (
        inputs.confirmPassword &&
        inputs.password !== inputs.confirmPassword
      ) {
        handleError(
          "Les mots de passe ne correspondent pas",
          "confirmPassword"
        );
        valid = false;
      }

      if (!inputs.confirmPassword) {
        handleError("Ce champ est obligatoire", "confirmPassword");
        valid = false;
      }

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
      }

      if (!inputs.firstName) {
        handleError("Ce champ est obligatoire", "firstName");
        valid = false;
      }
      if (!inputs.lastName) {
        handleError("Ce champ est obligatoire", "lastName");
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

  const WIDTH = Dimensions.get("screen").width;

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  const checkEmail = async (email: string) => {
    const { error, data } = await checkEmailAvailability(email);
    if (data === "409001: User with this email already exists true") {
      return alert("Email déjà utilisé");
    } else {
      return !error;
    }
  };

  const checkPhone = async (phoneNumber: string) => {
    const { error } = await checkPhoneNumberAvailability(phoneNumber);

    return !error;
  };

  const handleSignup = async () => {
    setLoading(true);
    clearName();

    const phoneNumber = "+213" + inputs.phone;

    const { error, data } = await checkEmailAvailability(inputs.email);
    if (error) {
      if (data === "409001: User with this email already exists") {
        handleError("Email déjà utilisé", "email");
        return setLoading(false);
      } else {
        handleError("Email non valide", "email");
        return setLoading(false);
      }
    }

    const phoneChecked = await checkPhone(phoneNumber);

    if (!phoneChecked) {
      handleError("Numéro de téléphone non valide", "phone");
      return setLoading(false);
    }

    registerForm(
      inputs.firstName,
      inputs.lastName,
      inputs.email,
      phoneNumber,
      inputs.password,
      isSwitchOn ? "freelancer" : "client"
    );

    setLoading(false);
    navigation.replace("/username");
  };

  return (
    <AuthProvider checkLogout>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "white",
        }}
      >
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
            backgroundColor: "white",
          }}
        >
          <KeyboardAwareScrollView>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
                gap: RFValue(40),
                paddingTop: RFValue(40),
              }}
            >
              <StatusBar barStyle="dark-content" />

              <View
                style={{
                  flexDirection: "column",
                  gap: RFValue(20),
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "column",
                    gap: RFValue(6),
                    alignItems: "center",
                    maxWidth: WIDTH - 50,
                  }}
                >
                  <Text
                    style={{
                      fontSize: RFValue(24),
                      color: black,
                      fontWeight: "600",
                    }}
                  >
                    S'inscrire
                  </Text>
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: RFValue(14),
                      color: text2,
                    }}
                  >
                    Inscrivez-vous maintenant pour commencer avec un compte.{" "}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  width: "100%",
                  paddingHorizontal: RFValue(25),
                  gap: RFValue(16),
                }}
              >
                <Input
                  textContentType="familyName"
                  onChangeText={(text: string) =>
                    handleOnChange(text, "firstName")
                  }
                  label="Nom"
                  error={errors.firstName}
                  onFocus={() => {
                    handleError(null, "firstName");
                  }}
                />
                <Input
                  textContentType="name"
                  onChangeText={(text: string) =>
                    handleOnChange(text, "lastName")
                  }
                  label="Prénom"
                  error={errors.lastName}
                  onFocus={() => {
                    handleError(null, "lastName");
                  }}
                />

                <Input
                  textContentType="telephoneNumber"
                  onChangeText={(text: string) => handleOnChange(text, "phone")}
                  label="Numéro téléphone"
                  error={errors.phone}
                  phone
                  onFocus={() => {
                    handleError(null, "phone");
                  }}
                />

                <Input
                  textContentType="emailAddress"
                  keyboardType="email-address"
                  onChangeText={(text: string) => handleOnChange(text, "email")}
                  label="Adresse e-mail"
                  error={errors.email}
                  onFocus={() => {
                    handleError(null, "email");
                  }}
                  autoCapitalize="none"
                />

                <Input
                  keyboardType="visible-password"
                  textContentType={"oneTimeCode"}
                  onChangeText={(text: string) =>
                    handleOnChange(text, "password")
                  }
                  label="Mot de passe"
                  error={errors.password}
                  onFocus={() => {
                    handleError(null, "password");
                  }}
                  password
                />

                <Input
                  textContentType={"oneTimeCode"}
                  keyboardType="visible-password"
                  onChangeText={(text: string) =>
                    handleOnChange(text, "confirmPassword")
                  }
                  label="Confirmez mot de passe"
                  error={errors.confirmPassword}
                  onFocus={() => {
                    handleError(null, "confirmPassword");
                  }}
                  password
                />

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: RFValue(8),
                  }}
                >
                  <Switch
                    color={primary}
                    style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                    value={isSwitchOn}
                    onValueChange={onToggleSwitch}
                  />
                  <Text
                    style={{
                      color: black,
                      fontSize: RFValue(12),
                    }}
                  >
                    S'inscrire en tant que Freelancer
                  </Text>
                </View>
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
                      handleSignup();
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
                    S'inscrire
                  </Text>
                </Button>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: RFValue(16),
                    paddingVertical: RFValue(8),
                    paddingBottom: RFValue(15),
                  }}
                >
                  <Text
                    style={{
                      fontSize: RFValue(10),
                      color: text2,
                    }}
                  >
                    Vous n'avez pas de compte ?
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.replace("/login")}
                  >
                    <Text
                      style={{
                        fontSize: RFValue(12),
                        color: primary,
                        fontWeight: "500",
                      }}
                    >
                      Se connecter
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </ScrollView>
      </SafeAreaView>
    </AuthProvider>
  );
};

export default Register;
