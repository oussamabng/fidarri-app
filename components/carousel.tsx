import * as React from "react";
import type { ICarouselInstance } from "react-native-reanimated-carousel";
import Carousel from "react-native-reanimated-carousel";

import { SBItem } from "./SBItem";
import {
  Dimensions,
  Platform,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import type { ScaledSize } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { primary, text4, white } from "@/constants/Colors";

export const ElementsText = {
  AUTOPLAY: "AutoPlay",
};

export const isWeb = Platform.OS === "web";

export const window: ScaledSize = isWeb
  ? {
      ...Dimensions.get("window"),
      width: 700,
    }
  : Dimensions.get("window");

const PAGE_WIDTH = window.width - 35 * 2;

const data = [
  {
    url: "../assets/images/girl.jpeg",
    title: "girl",
  },
  {
    url: "../assets/images/girl.jpeg",
    title: "girl",
  },
  {
    url: "../assets/images/girl.jpeg",
    title: "girl",
  },
  {
    url: "../assets/images/girl.jpeg",
    title: "girl",
  },
];

function CarouselComponent() {
  const scrollX = React.useRef(new Animated.Value(0)).current;

  const [isVertical, setIsVertical] = React.useState(false);
  const [isFast, setIsFast] = React.useState(false);
  const [isAutoPlay, setIsAutoPlay] = React.useState(true);
  const [isPagingEnabled, setIsPagingEnabled] = React.useState(true);
  const [currentItem, setCurrentItem] = React.useState(0);
  const ref = React.useRef<ICarouselInstance>(null);

  const baseOptions = isVertical
    ? ({
        vertical: true,
        width: PAGE_WIDTH,
        height: PAGE_WIDTH / 2,
      } as const)
    : ({
        vertical: false,
        width: PAGE_WIDTH,
        height: PAGE_WIDTH / 2,
      } as const);

  return (
    <>
      <Carousel
        {...baseOptions}
        loop
        ref={ref}
        testID={"xxx"}
        style={{ width: "100%" }}
        autoPlay={isAutoPlay}
        autoPlayInterval={isFast ? 100 : 2000}
        data={data}
        pagingEnabled={isPagingEnabled}
        onProgressChange={(_, absoluteProgress) => {
          scrollX.setValue(absoluteProgress);
        }}
        renderItem={({ index }) => <SBItem pretty key={index} index={index} />}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          gap: RFValue(6),
          paddingTop: RFValue(10),
        }}
      >
        {data.map((_, i) => {
          const backgroundColor = scrollX.interpolate({
            inputRange: [i - 1, i, i + 1],
            outputRange: [white, primary, white],
            extrapolate: "clamp",
          }) as any;

          const borderColor = scrollX.interpolate({
            inputRange: [i - 1, i, i + 1],
            outputRange: [text4, primary, text4],
            extrapolate: "clamp",
          }) as any;

          return (
            <Animated.View
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                backgroundColor: backgroundColor,
                borderColor,
                borderWidth: 1,
              }}
            />
          );
        })}
      </View>
    </>
  );
}

export default CarouselComponent;
