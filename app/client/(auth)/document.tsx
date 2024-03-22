import { useRouter } from "expo-router";
import { View, Text, SafeAreaView, Dimensions } from "react-native";

import { black, primary, text2 } from "@/constants/Colors";
import { RFValue } from "react-native-responsive-fontsize";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import AuthProvider from "@/components/authProvider";

const { width } = Dimensions.get("screen");

const Alert = () => {
  return (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 4,
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowRadius: 12,
        shadowColor: "rgba(152, 150, 150, 0.10)",
        shadowOpacity: 1,
        elevation: 4,
      }}
    >
      <View
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          backgroundColor: "#FCA004",
          borderRadius: 4,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        }}
      ></View>
      <View
        style={{ paddingHorizontal: RFValue(20), paddingVertical: RFValue(10) }}
      >
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <View
            style={{
              paddingRight: RFValue(16),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Feather name="alert-triangle" color="#FCA004" size={20} />
          </View>
          <View
            style={{
              flexDirection: "column",
              gap: RFValue(5),
              flex: 1,
            }}
          >
            <Text
              style={{
                color: "black",
                fontSize: RFValue(10),
                fontWeight: "500",
              }}
            >
              Keep in mind
            </Text>
            <Text
              style={{
                color: "#888888",
                fontSize: RFValue(10),
                flexShrink: 1,
              }}
            >
              Lorem ipsum dolor sit amet consectetur. Sit platea pellentesque id
              egestas auctor fringilla. Dignissim nisl.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const IdCard = () => {
  return (
    <View
      style={{
        paddingHorizontal: RFValue(20),
        paddingVertical: RFValue(30),
        borderRadius: RFValue(4),
        backgroundColor: "#F8F8F8",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: RFValue(10),
        }}
      >
        <View
          style={{
            width: RFValue(40),
            height: RFValue(40),
            borderRadius: 999,
            backgroundColor: "#923FB333",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather name="credit-card" color={primary} size={24} />
        </View>
        <Text
          style={{
            fontSize: RFValue(18),
            color: "black",
          }}
        >
          ID Card
        </Text>
      </View>
      <MaterialCommunityIcons
        name="check-underline"
        color={primary}
        size={24}
      />
    </View>
  );
};

const Document = () => {
  const navigation = useRouter();
  return (
    <AuthProvider>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "white",
        }}
      >
        <View
          style={{
            flexDirection: "column",
            gap: RFValue(30),
            paddingHorizontal: RFValue(25),
          }}
        >
          <View
            style={{
              flexDirection: "column",
              gap: RFValue(6),
            }}
          >
            <Text
              style={{
                fontSize: RFValue(28),
                color: black,
                fontWeight: "600",
              }}
            >
              Documents
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: text2,
                maxWidth: width - RFValue(25),
              }}
            >
              Lorem ipsum dolor sit amet consectetur. Ornare habitant a ut
              pharetra. Congue praesent odio consequat semper aliquam purus.
              Amet quis amet.
            </Text>
          </View>
          <IdCard />
          <Alert />
        </View>
      </SafeAreaView>
    </AuthProvider>
  );
};

export default Document;
