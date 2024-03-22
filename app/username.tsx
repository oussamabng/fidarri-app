import { useRouter } from "expo-router";
import {
  View,
  Text,
  SafeAreaView,
  Keyboard,
  Dimensions,
  Platform,
} from "react-native";
import { Appbar, Button } from "react-native-paper";

import { black, primary, text2 } from "@/constants/Colors";
import Input from "@/components/input";
import { useMemo, useState } from "react";
import { useRegisterStore } from "@/store/useRegisterStore";
import { RFValue } from "react-native-responsive-fontsize";
import KeyboardAvoidingViewWrapper from "@/components/keyboardAvoidingViewWrapper";
import { checkUsernameAvailability } from "@/graphql/services/auth.service";

const WIDTH = Dimensions.get("screen").width;

const Username = () => {
  const navigation = useRouter();

  const [loading, setLoading] = useState(false);

  const { addName, user } = useRegisterStore((state: any) => ({
    addName: state.addName,
    user: state.user,
  }));

  const [inputs, setInputs] = useState({
    username: "",
  });

  const [errors, setErrors] = useState({
    username: null,
  });

  const validate = useMemo(() => {
    return () => {
      Keyboard.dismiss();
      let valid = true;

      if (!inputs.username) {
        handleError("Ce champ est obligatoire", "username");
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

  const handleUsername = async () => {
    setLoading(true);
    const { error } = await checkUsernameAvailability(inputs.username);

    if (error) {
      setLoading(false);
      return handleError("Nom utilisateur non valide", "username");
    }

    addName(inputs.username);

    if (user.type === "client") {
      setLoading(false);

      navigation.replace("/address");
    } else {
      setLoading(false);

      navigation.replace("/dateOfBirth");
    }
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
        paddingTop: Platform.OS === "android" ? RFValue(25) : 0,
      }}
    >
      <Appbar.BackAction
        color="black"
        onPress={() => {
          navigation.replace("/register");
        }}
      />
      <View
        style={{
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
          padding: RFValue(25),
        }}
      >
        <KeyboardAvoidingViewWrapper>
          <View
            style={{
              gap: RFValue(20),
              flex: 1,
            }}
          >
            <View
              style={{
                flexDirection: "column",
                gap: RFValue(6),
                maxWidth: WIDTH - 50,
                paddingBottom: RFValue(20),
              }}
            >
              <Text
                style={{
                  fontSize: RFValue(24),
                  color: black,
                  fontWeight: "600",
                }}
              >
                Nom d'utilisateur
              </Text>
              <Text
                style={{
                  fontSize: RFValue(12),
                  color: text2,
                }}
              >
                L'ajout d'un{" "}
                <Text
                  style={{
                    color: primary,
                  }}
                >
                  nom d'utilisateur
                </Text>{" "}
                à votre compte garantit un travail sûr et sécurisé tout en
                protégeant vos informations personnelles .
              </Text>
            </View>
            <Input
              textContentType="nickname"
              onChangeText={(text: string) => handleOnChange(text, "username")}
              label="Surnom"
              autoCapitalize="none"
              error={errors.username}
              onFocus={() => {
                handleError(null, "username");
              }}
            />
          </View>
        </KeyboardAvoidingViewWrapper>
        <View style={{ flexDirection: "column", gap: 16 }}>
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
              const validation = validate();
              if (validation) {
                handleUsername();
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
              Continuer
            </Text>
          </Button>
          {/*        <Button
              style={{
                borderRadius: 4,
                height: 45,
                justifyContent: "center",
              }}
              mode="text"
              rippleColor="#923FB310"
              onPress={() => {
                console.log("ok");
              }}
            >
              <Text
                style={{
                  fontSize: RFValue(14),
                  color: black,
                  fontWeight: "600",
                }}
              >
                Passer
              </Text>
            </Button> */}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Username;
