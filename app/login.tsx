import { useMemo, useState } from "react";

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  Dimensions,
  Keyboard,
  StatusBar,
  Alert,
  SafeAreaView,
} from "react-native";
import { black, text2, primary } from "@/constants/Colors";
import { Button, Snackbar } from "react-native-paper";
import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";
import KeyboardAvoidingViewWrapper from "@/components/keyboardAvoidingViewWrapper";
import Input from "@/components/input";
import { RFValue } from "react-native-responsive-fontsize";
import { login as loginClient } from "@/graphql/services/auth.service";
import jwt from "jwt-decode";
import { useAuthStore } from "@/store/useAuthStore";
import { isValidEmail } from "@/constants/Helpers";
import { useProfileStore } from "@/store/useProfileStore";
import {
  getClientInformations,
  getFreelancerInformations,
  getUser,
  missionsCompletedForClient,
} from "@/graphql/services/profile.service";
import AuthProvider from "@/components/authProvider";

import { useTranslation } from "react-i18next";
import { usePushNotifications } from "@/notifications/usePushNotifications";

const Login = () => {
  const { t } = useTranslation();
  const { expoPushToken } = usePushNotifications();
  console.log("expoPushToken ----");
  console.log(expoPushToken);
  const WIDTH = Dimensions.get("screen").width;

  const { update } = useAuthStore((state: any) => ({
    update: state.update,
  }));

  const { update: updateProfileStore } = useProfileStore((state: any) => ({
    update: state.update,
  }));

  const navigation = useRouter();

  const [checked, setChecked] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [errMessage, setErrMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: null,
    password: null,
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

  const onToggleSnackBar = (data?: string | null) => {
    setErrMessage(data?.split(":")[1] ?? null);
    setVisible(!visible);
  };

  const onDismissSnackBar = () => setVisible(false);

  const fetchProfile = async (id: number, access: string, role: string) => {
    const { data, error } =
      role === "client"
        ? await getClientInformations(id, access)
        : await getFreelancerInformations(id, access);
    const { data: dataMissions, error: errorMissions } =
      await missionsCompletedForClient(id, access, role);

    if (error || errorMissions) {
      return alert(`Error fetching profile`);
    }

    const newData = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      phoneNumber: data.phoneNumber,
      rating: data.rating,
      accountStatus: data.accountStatus,
      profilePictureUrl: data.profilePictureUrl,
      missionsCompleted: dataMissions.length,
      adr: data.address.street,
    };

    updateProfileStore(newData);
  };

  const handleLogin = async () => {
    setFormLoading(true);
    const { data, error } = await loginClient(
      {
        email: inputs.email,
        password: inputs.password,
      },
      expoPushToken?.data ? String(expoPushToken?.data) : null
    );

    console.log(data);

    if (error) {
      if (data === "400013: Email verification required") {
        navigation.push({
          pathname: "/otp",
          params: {
            email: inputs.email,
          },
        });
      } else {
        onToggleSnackBar(data);
      }
    } else {
      const { access, refresh } = data;

      const decodedAccess: any = jwt(access);
      if (decodedAccess.role === "client") {
        await fetchProfile(
          parseInt(decodedAccess.id),
          access,
          decodedAccess.role
        );
        update(access, refresh, decodedAccess.role, decodedAccess.id, "status");
        navigation.replace("/client/(tabs)");
      } else {
        await fetchProfile(
          parseInt(decodedAccess.id),
          access,
          decodedAccess.role
        );

        const { data, error } = await getUser(decodedAccess.id, access);

        if (error) {
          setFormLoading(false);
          return Alert.alert("Erreur", data);
        }

        update(
          access,
          refresh,
          decodedAccess.role,
          decodedAccess.id,
          data?.applicationStatus
        );

        if (data?.applicationStatus === "Identification") {
          navigation.replace("/freelancer/(auth)/onboarding");
        } else if (data?.applicationStatus === "Interview") {
          navigation.replace("/freelancer/(auth)/interview");
        } else if (
          data?.applicationStatus === "Test" ||
          data?.applicationStatus === "Contract"
        ) {
          navigation.replace("/freelancer/(auth)/waitingOnBoarding");
        } else if (data?.applicationStatus === "Verified") {
          navigation.replace("/freelancer/(tabs)");
        }
      }
    }

    setFormLoading(false);
  };

  return (
    <AuthProvider checkLogout>
      <KeyboardAvoidingViewWrapper>
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          <StatusBar barStyle="dark-content" />

          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
              gap: RFValue(40),
            }}
          >
            <View
              style={{
                flexDirection: "column",
                gap: RFValue(30),
                alignItems: "center",
              }}
            >
              <Image
                alt="Fidarri"
                source={require("@/assets/images/logo.png")}
                style={{
                  objectFit: "contain",
                  width: RFValue(90),
                  height: RFValue(150),
                }}
              />
              <View
                style={{
                  flexDirection: "column",
                  gap: 6,
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
                  Connectez-vous
                </Text>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: RFValue(14),
                    color: text2,
                  }}
                >
                  Bienvenue à nouveau, entrez veuillez vos coordonnées.
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
                keyboardType="email-address"
                onChangeText={(text: string) => handleOnChange(text, "email")}
                placeholder="johndoe@gmail.com"
                label="Adresse e-mail"
                error={errors.email}
                onFocus={() => {
                  handleError(null, "email");
                }}
                autoCapitalize="none"
              />
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
                autoCapitalize="none"
              />

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: RFValue(8),
                }}
              >
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => setChecked((prevState) => !prevState)}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: RFValue(6),
                      alignItems: "center",
                    }}
                  >
                    <Checkbox
                      color={checked ? primary : "#E0E1E4"}
                      value={checked}
                      onValueChange={setChecked}
                    />
                    <Text
                      style={{
                        color: text2,
                        fontSize: RFValue(10),
                        paddingLeft: RFValue(6),
                      }}
                    >
                      Se souvenir de moi
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.push("/forgetPassword")}
                >
                  <Text
                    style={{
                      color: black,
                      fontSize: RFValue(10),
                      fontWeight: "500",
                    }}
                  >
                    Mot de passe oublié?
                  </Text>
                </TouchableOpacity>
              </View>
              <Button
                style={{
                  borderRadius: 4,
                  height: 45,
                  justifyContent: "center",
                }}
                mode="contained"
                loading={formLoading}
                buttonColor={primary}
                onPress={() => {
                  const validation = validate();
                  if (validation) {
                    handleLogin();
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
                  Log in
                </Text>
              </Button>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: RFValue(16),
                  paddingVertical: RFValue(8),
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
                  onPress={() => navigation.replace("/register")}
                >
                  <Text
                    style={{
                      fontSize: RFValue(12),
                      color: primary,
                      fontWeight: "500",
                    }}
                  >
                    S'inscrire
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Snackbar
            visible={visible}
            onDismiss={onDismissSnackBar}
            duration={2000}
            wrapperStyle={{ top: 0 }}
            style={{
              backgroundColor: "#D76262",
            }}
          >
            {errMessage ?? "Error"}
          </Snackbar>
        </View>
      </KeyboardAvoidingViewWrapper>
    </AuthProvider>
  );
};

export default Login;
