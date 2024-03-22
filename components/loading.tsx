import { View, ActivityIndicator, Text, StatusBar } from "react-native";
import { black, primary, text2 } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";

interface LoadingProps {
  size?: "large" | "small";
  title?: string;
  subtitle?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = "small",
  title,
  subtitle = "",
}) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          gap: 35,
        }}
      >
        <ActivityIndicator color={primary} size={size} />

        {title && (
          <View
            style={{
              flexDirection: "column",
              gap: 8,
              alignItems: "center",
              justifyContent: "center",
              maxWidth: 250,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 16,
                color: black,
                fontWeight: "600",
              }}
            >
              {title}
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontSize: 12,
                color: text2,
              }}
            >
              {subtitle}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Loading;
