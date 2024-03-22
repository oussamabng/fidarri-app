import {
  View,
  Text,
  StatusBar,
  FlatList,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFValue } from "react-native-responsive-fontsize";
import { useTranslation } from "react-i18next";
import { black, primary, text1 } from "@/constants/Colors";
import Stars from "react-native-stars";
import { FontAwesome } from "@expo/vector-icons";
import { useAuthStore } from "@/store/useAuthStore";
import { getReviews } from "@/graphql/services/freelancer.service";
import Loading from "@/components/loading";
import dayjs from "dayjs";

const ReviewCard = ({
  item,
  role,
}: {
  item: any;
  role: "client" | "freelancer";
}) => {
  const user = role === "client" ? item?.freelancer : item?.client;
  return (
    <View
      style={{
        width: "100%",
        backgroundColor: "white",
        borderRadius: 8,
        shadowColor: "rgba(197, 195, 195, 0.15)",
        shadowOffset: {
          width: 4,
          height: 4,
        },
        shadowOpacity: 1,
        shadowRadius: 22,
        borderWidth: 1,
        borderColor: "rgba(197, 195, 195, 0.5)",
        padding: RFValue(15),
        marginBottom: RFValue(20),
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: RFValue(10),
        }}
      >
        <Image
          style={{
            width: RFValue(40),
            height: RFValue(40),
            borderRadius: 9999999,
            borderWidth: 1,
            borderColor: "#E5E5E5",
            backgroundColor: "#FAFAFA",
          }}
          source={require("@/assets/images/profile.png")}
        />
        <View
          style={{
            flexDirection: "column",
            gap: RFValue(8),
            alignItems: "flex-start",
          }}
        >
          <Text
            numberOfLines={2}
            style={{
              fontSize: RFValue(14),
              color: black,
              fontWeight: "600",
              maxWidth: 200,
            }}
          >
            {user?.firstName} {user?.lastName}
          </Text>
          <Stars
            display={parseInt(item?.rating)}
            spacing={4}
            count={5}
            starSize={8}
            fullStar={<FontAwesome name="star" color={"#FFCE31"} />}
            emptyStar={<FontAwesome name="star-o" color={"#FFCE31"} />}
          />
          <Text
            style={{
              fontSize: RFValue(10),
              color: text1,
              fontWeight: "400",
            }}
          >
            {dayjs(item?.createdAt).format("YYYY-MM-DD")}
          </Text>
          <Text
            style={{
              fontSize: RFValue(14),
              color: black,
              fontWeight: "400",
              paddingTop: RFValue(10),
            }}
          >
            {item?.review}
          </Text>
        </View>
      </View>
    </View>
  );
};

const Reviews = () => {
  const { access, id, role } = useAuthStore((state: any) => ({
    access: state.access,
    id: state.id,
    role: state.role,
  }));
  const { t, i18n } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [hasNext, setHasNext] = useState(false);
  const [offset, setOffset] = useState(0);
  const LIMIT = 10;

  const fetchData = async () => {
    const { data, error } = await getReviews(
      access,
      0,
      offset + LIMIT,
      +id,
      role
    );

    console.log(access, 0, offset + LIMIT, +id, role);

    if (error) {
      setLoading(false);
      Alert.alert("Erreur", data);
    } else {
      setData(data?.nodes);
      setHasNext(data?.hasNextPage);
      setOffset((prevState) => prevState + LIMIT);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <StatusBar barStyle={"dark-content"} />
      <View
        style={{
          paddingHorizontal: RFValue(25),
          flexDirection: "column",
          gap: RFValue(40),
          flex: 1,
        }}
      >
        <Text
          style={{
            fontSize: RFValue(26),
            color: black,
            textAlign: i18n.language === "ar" ? "right" : "left",
            fontWeight: "600",
            flex: !loading && data?.length === 0 ? 1 : undefined,
          }}
        >
          {t("Mes commantaires")}
        </Text>

        {!loading && data?.length === 0 && (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: RFValue(40),
            }}
          >
            <Image
              alt="empty"
              source={require("@/assets/images/empty.png")}
              style={{
                width: 100,
                height: 100,
                resizeMode: "contain",
              }}
            />
          </View>
        )}

        {loading && <Loading size="small" title="" />}

        <FlatList
          data={data}
          showsVerticalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => <ReviewCard item={item} role={role} />}
          onEndReachedThreshold={0}
          onEndReached={() => {}}
          ListFooterComponent={
            data?.length > 0 ? (
              hasNext ? (
                <View
                  style={{
                    padding: RFValue(10),
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ActivityIndicator color={primary} />
                </View>
              ) : null
            ) : null
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default Reviews;
