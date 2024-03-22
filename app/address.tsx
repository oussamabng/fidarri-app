import { useRouter } from "expo-router";
import {
  View,
  Text,
  Dimensions,
  Keyboard,
  SafeAreaView,
  Platform,
} from "react-native";
import { Appbar, Button } from "react-native-paper";

import { black, primary, text2 } from "@/constants/Colors";
import { RFValue } from "react-native-responsive-fontsize";
import { useMemo, useState } from "react";
import Input from "@/components/input";
import { useRegisterStore } from "@/store/useRegisterStore";
import { registerClient } from "@/graphql/services/auth.service";
const WIDTH = Dimensions.get("screen").width;
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { usePushNotifications } from "@/notifications/usePushNotifications";

const Username = () => {
  const navigation = useRouter();
  const { user, addAdr, clearAll } = useRegisterStore((state: any) => ({
    user: state.user,
    addAdr: state.addAdr,
    clearAll: state.clearAll,
  }));

  const [loading, setLoading] = useState(false);

  const [inputs, setInputs] = useState({
    adr: "",
    province: "",
    wilaya: "",
    code: "",
  });

  const [errors, setErrors] = useState({
    adr: null,
    province: null,
    wilaya: null,
    code: null,
  });

  function isValidAlgerianPostalCode(inputString: string): boolean {
    // Regular expression to find a 4-5 digit number
    const regex = /\b\d{4,5}\b/;
    const found = inputString.match(regex);

    // If no number is found, return false
    if (!found) {
      return false;
    }

    // Parse the found number
    const postalCode = parseInt(found[0]);

    // Check if the postal code is in the range of 1000 to 58000
    return postalCode >= 1000 && postalCode <= 58000;
  }

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
      } else if (!isValidAlgerianPostalCode(String(inputs.code))) {
        handleError("Ce champ n'est pas correct", "code");
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

  const { expoPushToken } = usePushNotifications();

  const handleCreateAccount = async () => {
    setLoading(true);
    const role = user?.type;
    addAdr(inputs.adr, inputs.wilaya, inputs.province, inputs.code);

    if (role === "client") {
      const { data, error } = await registerClient(
        {
          email: user.email,
          password: user.password,
          username: user.username,
          phoneNumber: user.phone,
          firstName: user.firstName,
          lastName: user.lastName,
          dateOfBirth: "1999-01-01T12:31:24.102Z",
          freelancer_type: "MAID",
          address: {
            city: inputs.wilaya,
            state: inputs.province,
            street: inputs.adr,
            zipCode: inputs.code,
          },
        },
        expoPushToken?.data ? String(expoPushToken?.data) : null
      );

      if (error) {
        setLoading(false);
        alert(data);
      } else {
        setLoading(false);

        navigation.replace({
          pathname: "/otp",
          params: {
            email: data.email,
          },
        });
      }
    } else {
      navigation.replace({ pathname: "/freelancer/id" });
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
      <View
        style={{
          gap: RFValue(20),
          flex: 1,
        }}
      >
        <Appbar.BackAction
          color="black"
          onPress={() => {
            navigation.replace("/freelancer/jobType");
          }}
        />
        <View
          style={{
            flexDirection: "column",
            gap: RFValue(6),
            maxWidth: WIDTH - 50,
          }}
        >
          <Text
            style={{
              fontSize: RFValue(24),
              color: black,
              fontWeight: "600",
              paddingHorizontal: RFValue(25),
            }}
          >
            Adresse du domicile
          </Text>
          <Text
            style={{
              fontSize: RFValue(12),
              color: text2,
              paddingHorizontal: RFValue(25),
            }}
          >
            Votre adresse est requise par la loi afin d'ouvrir votre compte.
          </Text>
        </View>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              gap: RFValue(16),
              flexDirection: "column",
              paddingTop: RFValue(20),
              flex: 1,
              paddingHorizontal: RFValue(25),
            }}
          >
            <Input
              onChangeText={(text: string) => handleOnChange(text, "adr")}
              label="Address"
              error={errors.adr}
              onFocus={() => {
                handleError(null, "adr");
              }}
            />
            <Input
              onChangeText={(text: string) => handleOnChange(text, "province")}
              label="Province"
              error={errors.province}
              onFocus={() => {
                handleError(null, "province");
              }}
            />
            <Input
              onChangeText={(text: string) => handleOnChange(text, "wilaya")}
              label="Wilaya"
              error={errors.wilaya}
              onFocus={() => {
                handleError(null, "wilaya");
              }}
            />

            <Input
              textContentType="postalCode"
              returnKeyType="done"
              onChangeText={(text: string) => handleOnChange(text, "code")}
              label="Code postal"
              error={errors.code}
              onFocus={() => {
                handleError(null, "code");
              }}
            />
            <Button
              style={{
                borderRadius: 4,
                height: 45,
                justifyContent: "center",
                marginTop: RFValue(20),
              }}
              loading={loading}
              mode="contained"
              buttonColor={primary}
              onPress={() => {
                const validation = validate();
                if (validation) {
                  handleCreateAccount();
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
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Username;
