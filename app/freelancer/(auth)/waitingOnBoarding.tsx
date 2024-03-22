import { useCallback, useEffect } from "react";
import { useFocusEffect, useRouter } from "expo-router";

import { View, Text, Image } from "react-native";
import { primary, text2 } from "@/constants/Colors";
import { login, logoutUser } from "@/graphql/services/auth.service";
import { useRegisterStore } from "@/store/useRegisterStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { usePushNotifications } from "@/notifications/usePushNotifications";
import { useProfileStore } from "@/store/useProfileStore";

const WaitingOnBoarding = () => {
  const navigation = useRouter();

  const { user } = useRegisterStore((state: any) => ({
    user: state.user,
  }));
  const { update } = useAuthStore((state: any) => ({
    update: state.update,
  }));
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

  const checkEmailVerification = async () => {
    const { data, error } = await login(
      {
        email: user.email,
        password: user.password,
      },
      expoPushToken?.data ? String(expoPushToken?.data) : null
    );

    if (!error) {
      if (user.type === "client") {
        update(data.access, data.refresh, user.type);
        navigation.replace("/client/(tabs)");
      } else {
        if (data?.applicationStatus === "Verified") {
          update(data.access, data.refresh, user.type);
          navigation.replace("/freelancer/(tabs)");
        }
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      checkEmailVerification();
    }, [])
  );
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
          width: 200,
          height: 250,
          objectFit: "contain",
        }}
        source={require("@/assets/images/waitingOnboarding.png")}
        alt="Fidarri"
      />
      <View
        style={{
          flexDirection: "column",
          gap: 6,
          alignItems: "center",
          paddingHorizontal: 25,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            color: "#383737",
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          Avoir reçu votre candidature pour l'entretien
        </Text>
        <Text
          style={{
            textAlign: "center",
            fontSize: 14,
            color: text2,
          }}
        >
          Nous vous prions de bien vouloir patienter jusqu'à ce que nous vous
          envoyions un e-mail avec les détails nécessaires
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

export default WaitingOnBoarding;
