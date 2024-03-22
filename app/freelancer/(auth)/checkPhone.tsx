import { useState } from "react";

import { View, Text, SafeAreaView } from "react-native";
import { black, primary, text2 } from "@/constants/Colors";

import OTPInputView from "@twotalltotems/react-native-otp-input";
import { TouchableOpacity } from "react-native-gesture-handler";
import Loading from "@/components/loading";
import { useBackHeaderStore } from "@/store/useBackHeaderStore";
import { useRouter } from "expo-router";

const CheckPhone = () => {
  const navigation = useRouter();
  const { update } = useBackHeaderStore((state: any) => ({
    update: state.update,
  }));

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOTP = () => {
    update("none");
    setLoading(true);
    setTimeout(() => {
      navigation.replace("/freelancer/(auth)/oneMoreStep");
      update("flex");
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }, 2000);
  };

  if (loading)
    return <Loading size="large" title="Vérification et création de compte" />;

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
          gap: 60,
          paddingHorizontal: 25,
          paddingTop: 15,
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
            Vérifier votre téléphone
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: text2,
            }}
          >
            Vous recevrez un code à vérifier ici afin que vous puissiez
            réinitialiser le mot de passe .
          </Text>
        </View>
        <View
          style={{
            flexDirection: "column",
            gap: 25,
            alignItems: "center",
          }}
        >
          <View
            style={{
              paddingHorizontal: 25,
              height: 80,
              borderRadius: 4,
              borderColor: "#E0E1E4",
              borderWidth: 1,
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <OTPInputView
              style={{ height: 40, width: "70%" }}
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
                fontSize: 18,
              }}
              codeInputHighlightStyle={{
                borderColor: primary,
              }}
              onCodeFilled={(code) => {
                console.log(code);
                handleOTP();
              }}
            />
          </View>
          <View
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
                fontSize: 12,
              }}
            >
              vous n'avez pas reçu le code ?
            </Text>
            <TouchableOpacity>
              <Text
                style={{
                  color: primary,
                  fontSize: 12,
                  fontWeight: "500",
                }}
              >
                Renvoyer le code
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CheckPhone;
