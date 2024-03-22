import { primary } from "@/constants/Colors";
import { View, Text, Alert } from "react-native";
import { Button } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import NetInfo from "@react-native-community/netinfo";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";

const NoInternet = () => {
  const navigation = useRouter();
  const { role, access } = useAuthStore((state: any) => ({
    role: state.role,
    access: state.access,
  }));
  const [isChecking, setIsChecking] = useState(false);

  const handleRetry = () => {
    setIsChecking(true);
    NetInfo.fetch()
      .then((state) => {
        setIsChecking(false);
        if (state.isConnected) {
          if (access) {
            if (role === "client") {
              navigation.replace("/client/(tabs)");
            } else {
              navigation.replace("/login");
            }
          } else {
            navigation.replace("/login");
          }
        } else {
          Alert.alert(
            "Erreur de connexion",
            "Vous n'êtes pas connecté à Internet. Veuillez vérifier votre connexion et réessayer."
          );
        }
      })
      .catch((error) => {
        setIsChecking(false);
        Alert.alert(
          "Erreur",
          "Une erreur s'est produite lors de la vérification de votre connexion. Veuillez vérifier votre connexion et réessayer."
        );
      });
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: RFValue(16),
          marginBottom: RFValue(8),
          fontWeight: "500",
        }}
      >
        Pas de connection internet
      </Text>
      <Button
        style={{
          borderRadius: 4,
          height: 45,
          justifyContent: "center",
        }}
        mode="contained"
        buttonColor={primary}
        loading={isChecking}
        onPress={handleRetry}
      >
        <Text
          style={{
            fontSize: RFValue(14),
            color: "white",
            fontWeight: "600",
          }}
        >
          Retry
        </Text>
      </Button>
    </View>
  );
};

export default NoInternet;
