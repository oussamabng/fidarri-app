import { primaryLight, text1 } from "@/constants/Colors";
import { View, Text } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const ServiceCard = (props: any) => {
  return (
    <View
      style={{
        flex: 1,
        height: RFValue(80),
        borderRadius: 4,
        backgroundColor: "#F6F6F6",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 6,
      }}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: 40,
          width: 40,
          borderRadius: 999,
          backgroundColor: primaryLight,
        }}
      >
        {props.icon}
      </View>
      <Text
        numberOfLines={1}
        style={{
          color: text1,
          fontSize: 12,
        }}
      >
        {props.title}
      </Text>
    </View>
  );
};

export default ServiceCard;
