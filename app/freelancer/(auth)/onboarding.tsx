import { useRouter } from "expo-router";

import { View, Text, Image } from "react-native";
import { primary, text2 } from "@/constants/Colors";
import { RFValue } from "react-native-responsive-fontsize";
import { Button } from "react-native-paper";
import { usePushNotifications } from "@/notifications/usePushNotifications";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileStore } from "@/store/useProfileStore";
import { useRegisterStore } from "@/store/useRegisterStore";
import { logoutUser } from "@/graphql/services/auth.service";

const Onboarding = () => {
  const navigation = useRouter();

  const { expoPushToken } = usePushNotifications();
  const { access, logout } = useAuthStore((state: any) => ({
    access: state.access,
    logout: state.logout,
  }));

  const { clearAll } = useRegisterStore((state: any) => ({
    clearAll: state.clearAll,
  }));

  const { clear } = useProfileStore((state: any) => ({
    clear: state.clear,
  }));

  const handleLogoutUser = async () => {
    await logoutUser(access, String(expoPushToken?.data));
    logout();
    clear();
    clearAll();
    navigation.replace("/login");
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 70,
        backgroundColor: "white",
      }}
    >
      <Image
        style={{
          width: RFValue(200),
          height: RFValue(200),
          objectFit: "contain",
        }}
        source={require("@/assets/images/onboarding.png")}
        alt="Fidarri"
      />
      <View
        style={{
          flexDirection: "column",
          gap: 6,
          alignItems: "center",
          paddingHorizontal: RFValue(25),
        }}
      >
        <Text
          style={{
            fontSize: RFValue(20),
            color: "#383737",
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          Merci, nous sommes ravis de vous accueillir dans notre communauté.
        </Text>
        <Text
          style={{
            textAlign: "center",
            fontSize: RFValue(12),
            color: text2,
          }}
        >
          Veuillez noter que votre inscription est en attente d'approbation de
          la part de nos administrateurs. Ce processus prend généralement de 1 à
          2 jours et nous vous remercions de votre patience pendant que nous
          examinons votre demande
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
        onPress={handleLogoutUser}
      >
        <Text
          style={{
            fontSize: RFValue(14),
            color: "white",
            fontWeight: "600",
          }}
        >
          Go back
        </Text>
      </Button>
    </View>
  );
};

export default Onboarding;
