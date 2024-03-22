import { useCallback, useEffect } from "react";
import { useFocusEffect, useRouter } from "expo-router";

import { View, Text, Image } from "react-native";
import { primary, text2 } from "@/constants/Colors";
import { login, logoutUser } from "@/graphql/services/auth.service";
import { useRegisterStore } from "@/store/useRegisterStore";
import { useAuthStore } from "@/store/useAuthStore";
import { RFValue } from "react-native-responsive-fontsize";
import { Button } from "react-native-paper";
import { usePushNotifications } from "@/notifications/usePushNotifications";
import { useProfileStore } from "@/store/useProfileStore";

const WaitingOnboarding = () => {
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

  // this is temporary
  const checkEmailVerification = async () => {
    const { data, error } = await login(
      {
        email: user.email,
        password: user.password,
      },
      expoPushToken?.data ? String(expoPushToken?.data) : null
    );

    if (!error) {
      update(data.access, data.refresh, user.type);

      if (user.type === "client") {
        navigation.replace("/client/(tabs)");
      } else {
        console.log("ENTRETIEN");
      }
    }
    console.log({ data, error });
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
          Email verification
        </Text>
        <Text
          style={{
            textAlign: "center",
            fontSize: 14,
            color: text2,
          }}
        >
          Check your email for validating your account then return
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

export default WaitingOnboarding;
