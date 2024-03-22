import AuthProvider from "@/components/authProvider";
import Dropdown from "@/components/dropdown";
import Input from "@/components/input";
import NumericInput from "@/components/numericInput";
import { black, primary } from "@/constants/Colors";
import { updateClientAddresses } from "@/graphql/services/addresses.service";
import { useAuthStore } from "@/store/useAuthStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { View, Text, Keyboard } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";

const UpdateHome = () => {
  const navigation = useRouter();
  const { numberOfPieces, address, homeId }: any = useLocalSearchParams();

  const wilayas = ["Adrar", "Alger", "Oran"];

  const { access, id } = useAuthStore((state: any) => ({
    access: state.access,
    id: state.id,
  }));

  const [inputs, setInputs] = useState({
    adr: JSON.parse(address).street,
    province: JSON.parse(address).state,
    wilaya: JSON.parse(address).city,
    code: JSON.parse(address).zipCode,
    numberOfPieces: parseInt(numberOfPieces),
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

  const updateClientHome = async () => {
    setLoading(true);
    const { data, error } = await updateClientAddresses(
      id,
      parseInt(homeId),
      access,
      inputs.wilaya,
      inputs.province,
      inputs.adr,
      inputs.code,
      inputs.numberOfPieces
    );

    console.log("UPDATING HOME", data, error);

    if (error) {
      setLoading(false);
      return alert("Error in updating address");
    }

    setLoading(false);

    navigation.back();
  };

  const handleError = (errorMessage: string | null, input: string) => {
    setErrors((prevState) => ({ ...prevState, [input]: errorMessage }));
  };

  const handleOnChange = (text: string, input: string) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };
  return (
    <AuthProvider>
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          paddingVertical: RFValue(35),
        }}
      >
        <KeyboardAwareScrollView
          style={{
            flex: 1,
            flexDirection: "column",
          }}
          bounces={false}
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
              }}
            >
              Modifier l'adresse
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
                  defaultValue={inputs.adr}
                  label="Adresse (Primary)"
                />
                <Input
                  label="Province"
                  defaultValue={inputs.province}
                  onChangeText={(text: string) =>
                    handleOnChange(text, "province")
                  }
                  error={errors.province}
                  onFocus={() => {
                    handleError(null, "province");
                  }}
                />
                <Input
                  label="Wilaya"
                  defaultValue={inputs.wilaya}
                  onChangeText={(text: string) =>
                    handleOnChange(text, "wilaya")
                  }
                  error={errors.wilaya}
                  onFocus={() => {
                    handleError(null, "wilaya");
                  }}
                />

                <Input
                  defaultValue={inputs.code}
                  onChangeText={(text: string) => handleOnChange(text, "code")}
                  error={errors.code}
                  onFocus={() => {
                    handleError(null, "code");
                  }}
                  label="Code postal"
                />
                <View
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      fontSize: RFValue(14),
                      color: "#4F4F50",
                    }}
                  >
                    Nombre de pieces
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
            paddingVertical: RFValue(40),
          }}
        >
          <Button
            style={{
              borderRadius: 4,
              height: 45,
              justifyContent: "center",
            }}
            mode="contained"
            loading={loading}
            buttonColor={primary}
            onPress={() => {
              const validation = validate();
              if (validation) {
                updateClientHome();
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
              Sauvegarder
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
              Annuler
            </Text>
          </Button>
        </View>
      </View>
    </AuthProvider>
  );
};

export default UpdateHome;
