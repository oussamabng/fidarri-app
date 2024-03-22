import { useState } from "react";

import { View, Text, SafeAreaView, Dimensions } from "react-native";
import { black, primary, text2 } from "@/constants/Colors";

import OTPInputView from "@twotalltotems/react-native-otp-input";
import { router, useLocalSearchParams } from "expo-router";
import { RFValue } from "react-native-responsive-fontsize";
import { Button } from "react-native-paper";
import { useRegisterStore } from "@/store/useRegisterStore";
import { useAuthStore } from "@/store/useAuthStore";

import { useProfileStore } from "@/store/useProfileStore";
import Loading from "@/components/loading";
import { resetPasswordOtp } from "@/graphql/services/freelancer.service";
const WIDTH = Dimensions.get("screen").width;

const Otp = () => {
  const { access } = useAuthStore((state: any) => ({
    update: state.update,
    access: state.access,
  }));

  const { email, password }: any = useLocalSearchParams();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOTP = async (code: string) => {
    setLoading(true);
    const { data, error } = await resetPasswordOtp(
      email,
      code,
      password,
      access
    );
    if (error) {
      setLoading(false);
      alert(data);
    } else {
      alert("Password changes successfully");
      setLoading(false);
      router.push("/login");
    }
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: "white",
        flex: 1,
      }}
    >
      <View
        style={{
          flexDirection: "column",
          gap: RFValue(40),
          paddingHorizontal: RFValue(25),
          paddingTop: RFValue(40),
        }}
      >
        <View
          style={{
            flexDirection: "column",
            gap: 6,
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
            Vérification OTP{" "}
          </Text>
          <Text
            style={{
              fontSize: RFValue(12),
              color: text2,
            }}
          >
            merci de saisir{" "}
            <Text
              style={{
                color: primary,
              }}
            >
              le code PIN
            </Text>{" "}
            à 4 chiffres qui vous a été envoyé au votre email{" "}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "column",
            gap: RFValue(25),
            alignItems: "center",
          }}
        >
          {loading ? (
            <Loading size="small" />
          ) : (
            <View
              style={{
                paddingHorizontal: RFValue(25),
                height: RFValue(80),
                borderRadius: 4,
                borderColor: "#E0E1E4",
                borderWidth: 1,
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <OTPInputView
                style={{ height: RFValue(40), width: "70%" }}
                pinCount={4}
                code={code}
                onCodeChanged={(code) => {
                  setCode(code);
                }}
                autoFocusOnLoad={true}
                codeInputFieldStyle={{
                  borderWidth: 0,
                  borderBottomWidth: 1,
                  borderColor: "#8D8E90",
                  color: black,
                  fontSize: RFValue(16),
                }}
                codeInputHighlightStyle={{
                  borderColor: primary,
                }}
                onCodeFilled={(code: string) => {
                  handleOTP(code);
                }}
              />
            </View>
          )}
          {/*   <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Text
              style={{
                color: text2,
                fontSize: RFValue(10),
              }}
            >
              vous n'avez pas reçu le code ?
            </Text>
            <TouchableOpacity onPress={handleResendOTP}>
              <Text
                style={{
                  color: primary,
                  fontSize: RFValue(10),
                  fontWeight: "500",
                }}
              >
                Renvoyer le code
              </Text>
            </TouchableOpacity>
          </View> */}
        </View>
        <Button
          style={{
            borderRadius: 4,
            height: 45,
            justifyContent: "center",
          }}
          mode="contained"
          buttonColor={primary}
          onPress={() => {
            router.replace("/login");
          }}
        >
          <Text
            style={{
              fontSize: RFValue(14),
              color: "white",
              fontWeight: "600",
            }}
          >
            Return home
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default Otp;
