import { View, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const Skeleton = ({
  width,
  height,
  style,
}: {
  width?: number;
  height?: number;
  style?: any;
}) => {
  return (
    <View
      style={StyleSheet.flatten([
        { width, height, backgroundColor: "rgba(0,0,0,0.12)" },
        style,
      ])}
    >
      <Animated.View
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <LinearGradient
          style={{
            width: "100%",
            height: "100%",
          }}
          colors={["transparent", "rgba(0,0,0,0.05)", "transparent"]}
          start={{ x: 1, y: 1 }}
        />
      </Animated.View>
    </View>
  );
};

export default Skeleton;
