import { View, Text, Image, TouchableOpacity } from "react-native";

import { useRouter } from "expo-router";

import { black } from "@/constants/Colors";
import { usePrefsStore } from "@/store/usePrefsStore";

interface UserTypeCardProps {
  type: "freelancer" | "client";
}

export const UserTypeCard: React.FC<UserTypeCardProps> = ({ type }) => {
  const navigation = useRouter();
  const { update } = usePrefsStore((state: any) => ({
    update: state.update,
  }));
  return (
    <TouchableOpacity
      onPress={() => {
        update(type);
        navigation.push("/freelancer/(auth)/login");
      }}
    >
      <View
        style={{
          backgroundColor: "#F8F8F8",
          borderWidth: 1,
          borderColor: "#E8E8E8",
          borderRadius: 8,
          width: 230,
          height: 216,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{ flexDirection: "column", alignItems: "center", gap: 30 }}
        >
          <Image
            alt={type}
            source={
              type === "client"
                ? require("@/assets/images/client.png")
                : require("@/assets/images/freelancer.png")
            }
            style={{
              objectFit: "contain",
              width: 110,
              height: 120,
            }}
          />

          <Text
            style={{
              color: black,
              fontSize: 20,
              fontWeight: "600",
            }}
          >
            {type === "client" ? "Client" : "Utilisateur"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
