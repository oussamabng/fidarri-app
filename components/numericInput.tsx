import { black, primary } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";

const NumericInput = ({
  value,
  plus,
  minus,
}: {
  value: number;
  plus: () => void;
  minus: () => void;
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: RFValue(16),
      }}
    >
      <TouchableOpacity
        onPress={() => {
          value > 1 && minus();
        }}
        style={{
          width: RFValue(32),
          height: RFValue(32),
          backgroundColor: "#EFF0F6",
          borderRadius: 9999,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Feather name="minus" color={"#9C9C9C"} size={16} />
      </TouchableOpacity>
      <Text
        style={{
          color: black,
          fontSize: RFValue(16),
          fontWeight: "600",
        }}
      >
        {value}
      </Text>
      <TouchableOpacity
        onPress={() => {
          value < 10 && plus();
        }}
        style={{
          width: RFValue(32),
          height: RFValue(32),
          backgroundColor: "#EFF0F6",
          borderRadius: 9999,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Feather name="plus" color={primary} size={16} />
      </TouchableOpacity>
    </View>
  );
};

export default NumericInput;
