import { useEffect, useRef, useState } from "react";

import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  Alert,
  StatusBar,
  Platform,
  Keyboard,
} from "react-native";
import { black, primary, text2 } from "@/constants/Colors";

import OTPInputView from "@twotalltotems/react-native-otp-input";
import OTPTextInput from "react-native-otp-textinput";
import { TouchableOpacity } from "react-native-gesture-handler";
import { router, useLocalSearchParams } from "expo-router";
import { RFValue } from "react-native-responsive-fontsize";
import { resendOtp, verifyOtp } from "@/graphql/services/auth.service";
import { ActivityIndicator, Button } from "react-native-paper";
import { useRegisterStore } from "@/store/useRegisterStore";
import { useAuthStore } from "@/store/useAuthStore";
import {
  getClientInformations,
  getUser,
  missionsCompletedForClient,
} from "@/graphql/services/profile.service";
import { useProfileStore } from "@/store/useProfileStore";
import jwtDecode from "jwt-decode";
import Loading from "@/components/loading";
const WIDTH = Dimensions.get("screen").width;

import { usePushNotifications } from "@/notifications/usePushNotifications";

const Otp = () => {
  const { update } = useAuthStore((state: any) => ({
    update: state.update,
  }));

  const { clearAll } = useRegisterStore((state: any) => ({
    clearAll: state.clearAll,
  }));

  const { update: updateProfileStore } = useProfileStore((state: any) => ({
    update: state.update,
  }));

  const { expoPushToken } = usePushNotifications();
 

  const { email }: any = useLocalSearchParams();
  const { user } = useRegisterStore((state: any) => ({
    user: state.user,
  }));

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingResend, setLoadingResend] = useState(false);
  let otpInput = useRef<any>();

  const handleResendOTP = async () => {
    setLoadingResend(true);
    const { data, error } = await resendOtp(email);

    if (error) {
      setLoadingResend(false);
      Alert.alert("Erreur", data);
    } else {
      setLoadingResend(false);
      Alert.alert("Succès", "Code envoyé avec succès");
    }
  };

  const fetchProfile = async (id: number, access: string, role: string) => {
    const { data, error } = await getClientInformations(id, access);
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

  const handleOTP = async (code: string) => {
    Keyboard.dismiss();
    setLoading(true);

    const { data, error } = await verifyOtp(
      email,
      code,
      String(expoPushToken?.data)
    );
    if (error) {
      if (data === "400013: Email verification required") {
        handleOTP(code);
      } else {
        setLoading(false);
        alert(data);
        setCode("");
      }
    } else {
      setCode("");
      const { access, refresh } = data;
      const decodedAccess: any = jwtDecode(access);
      if (user?.type === "client") {
        await fetchProfile(
          parseInt(decodedAccess.id),
          access,
          decodedAccess.role
        );
        update(access, refresh, decodedAccess.role, decodedAccess.id, "status");
        clearAll();
        router.replace("/client/(tabs)");
      } else {
        const { data, error } = await getUser(decodedAccess.id, access);
        if (error) {
          return alert(data);
        }
        update(
          access,
          refresh,
          decodedAccess.role,
          decodedAccess.id,
          data?.applicationStatus
        );
        clearAll();

        if (data?.applicationStatus === "Identification") {
          router.replace("/freelancer/(auth)/onboarding");
        } else if (data?.applicationStatus === "Interview") {
          router.replace("/freelancer/(auth)/interview");
        } else if (
          data?.applicationStatus === "Test" ||
          data?.applicationStatus === "Contract"
        ) {
          router.replace("/freelancer/(auth)/waitingOnBoarding");
        } else if (data?.applicationStatus === "Verified") {
          router.replace("/freelancer/(tabs)");
        }
      }
    }
  };

  useEffect(() => {
    if (Platform.OS === "android") {
      if (code?.length === 4) {
        handleOTP(code);
      }
    }
  }, [code]);

  return (
    <SafeAreaView
      style={{
        backgroundColor: "white",
        flex: 1,
      }}
    >
      <StatusBar barStyle="dark-content" />
      <View
        style={{
          flexDirection: "column",
          gap: RFValue(40),
          paddingHorizontal: RFValue(25),
          paddingTop: RFValue(60),
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
            {"Vérification OTP"}
          </Text>
          <Text
            style={{
              fontSize: RFValue(12),
              color: text2,
            }}
          >
            {"Merci de saisir"}
            <Text
              style={{
                color: primary,
              }}
            >
              {" le code PIN "}
            </Text>
            {"à 4 chiffres qui vous a été envoyé au votre email"}
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
              {Platform.OS === "ios" ? (
                <OTPInputView
                  style={{ height: RFValue(40), width: "70%" }}
                  pinCount={4}
                  code={code}
                  onCodeChanged={(code: string) => {
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
              ) : (
                <OTPTextInput
                  inputCount={4}
                  textInputStyle={{
                    borderWidth: 0,
                    borderBottomWidth: 1,
                    borderColor: "#8D8E90",
                  }}
                  ref={(e: any) => (otpInput = e)}
                  tintColor={primary}
                  handleTextChange={(code: string) => setCode(code)}
                />
              )}
            </View>
          )}
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
                fontSize: RFValue(10),
              }}
            >
              {"vous n'avez pas reçu le code ?"}
            </Text>
            {loadingResend ? (
              <ActivityIndicator size={12} color={primary} />
            ) : (
              <TouchableOpacity disabled={loading} onPress={handleResendOTP}>
                <Text
                  style={{
                    color: primary,
                    fontSize: RFValue(10),
                    fontWeight: "500",
                  }}
                >
                  {"Renvoyer le code"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <Button
          style={{
            borderRadius: 4,
            height: 45,
            justifyContent: "center",
          }}
          disabled={loading || loadingResend}
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
