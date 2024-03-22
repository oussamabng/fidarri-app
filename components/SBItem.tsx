import React from "react";
import type { StyleProp, ViewStyle, ViewProps } from "react-native";
import { LongPressGestureHandler } from "react-native-gesture-handler";
import type { AnimateProps } from "react-native-reanimated";
import Animated from "react-native-reanimated";

import Constants from "expo-constants";

import { SBImageItem } from "./SBImageItem";

interface Props extends AnimateProps<ViewProps> {
  style?: StyleProp<ViewStyle>;
  index?: number;
  pretty?: boolean;
}

export const SBItem: React.FC<Props> = (props) => {
  const { style, index, pretty, testID, ...animatedViewProps } = props;
  const enablePretty = Constants?.expoConfig?.extra?.enablePretty || false;
  const [isPretty, setIsPretty] = React.useState(pretty || enablePretty);
  return (
    <LongPressGestureHandler
      onActivated={() => {
        setIsPretty(!isPretty);
      }}
    >
      <Animated.View testID={testID} style={{ flex: 1 }} {...animatedViewProps}>
        <SBImageItem
          style={style}
          index={index}
          showIndex={typeof index === "number"}
        />
      </Animated.View>
    </LongPressGestureHandler>
  );
};
