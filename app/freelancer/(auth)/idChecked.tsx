import { useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  StatusBar,
} from "react-native";
import mime from "mime";
import { black, text2 } from "@/constants/Colors";
import { useRegisterStore } from "@/store/useRegisterStore";
import {
  createIdentification,
  registerFreelancer,
} from "@/graphql/services/auth.service";
import { uploadFile } from "@/graphql/services/file.service";
import { RFValue } from "react-native-responsive-fontsize";
import Loading from "@/components/loading";
import { TouchableOpacity } from "react-native-gesture-handler";
import { usePushNotifications } from "@/notifications/usePushNotifications";

const IdChecked = () => {
  const navigation = useRouter();

  const { user } = useRegisterStore((state: any) => ({
    user: state.user,
  }));

  const [loading, setLoading] = useState(false);

  const { expoPushToken } = usePushNotifications();

  const createFreelancerAccount = async () => {
    setLoading(true);
    const uriParts = user?.image.split("/");
    const fileName = uriParts[uriParts.length - 1];

    const type = user?.image.split(".").pop();
    const fileType = mime.getType(type);

    const response = await uploadFile(user?.image, fileType, fileName);

    const { data, error } = await registerFreelancer(
      {
        address: {
          city: user?.wilaya,
          state: user?.province,
          street: user?.adr,
          zipCode: user?.code,
        },
        dateOfBirth: user?.dateOfBirth,
        email: user?.email,
        firstName: user?.firstName,
        freelancer_type: user?.jobType,
        lastName: user?.lastName,
        password: user?.password,
        phoneNumber: user?.phone,
        username: user?.username,
      },
      expoPushToken?.data ? String(expoPushToken?.data) : null
    );

    let userID = data?.id;

    if (error) {
      setLoading(false);
      return Alert.alert("Erreur", data);
    } else {
      const { data, error } = await createIdentification(
        parseInt(response?.id),
        parseInt(userID)
      );

      if (error) {
        alert(data);
      } else {
        setLoading(false);
        setTimeout(() => {
          navigation.replace({
            pathname: "/otp",
            params: {
              email: user?.email,
            },
          });
        }, 500);
      }
    }
  };

  useEffect(() => {
    createFreelancerAccount();
  }, []);

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
          paddingTop: Platform.OS === "android" ? RFValue(25) : 0,
        }}
      >
        <StatusBar barStyle="dark-content" />

        <View
          style={{
            flexDirection: "column",
            flex: 1,
            padding: RFValue(25),
          }}
        >
          <View
            style={{
              gap: RFValue(20),
              flex: 1,
              flexGrow: 1,
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
                  fontSize: RFValue(24),
                  color: black,
                  fontWeight: "600",
                  maxWidth: 350,
                }}
              >
                Vérifiez Votre Identité
              </Text>
              <Text
                style={{
                  fontSize: RFValue(12),
                  color: text2,
                }}
              >
                Veuillez noter que tous les documents téléchargés seront stockés
                en toute sécurité et resteront strictement confidentiels. Nous
                prenons votre vie privée très au sérieux et n'utiliserons vos
                informations qu'à des fins de vérification.
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 70,
              }}
            >
              {loading ? (
                <Loading size="small" />
              ) : (
                <Image
                  source={require("@/assets/images/cardidchecked.png")}
                  style={{
                    width: 250,
                    height: 160,
                    objectFit: "contain",
                    paddingVertical: RFValue(50),
                  }}
                  alt="id"
                />
              )}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default IdChecked;
