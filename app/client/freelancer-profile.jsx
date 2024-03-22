import React, { useEffect, useState } from "react";

import { black, primary, text3 } from "@/constants/Colors";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, ScrollView } from "react-native";
import { View, Text, SafeAreaView, StatusBar, Dimensions } from "react-native";
import { Appbar, Button } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import Stars from "react-native-stars";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useQuery } from "@apollo/client";
import { GET_FREELANCER_PROFILE } from "@/graphql/queries/freelancers.query";
import { useAuthStore } from "@/store/useAuthStore";
import Loading from "@/components/loading";
import { getFreelancersReviews } from "@/graphql/services/freelancer.service";
import dayjs from "dayjs";
import AuthProvider from "@/components/authProvider";
import { useTranslation } from "react-i18next";
import { SCREEN_HEIGHT } from "@gorhom/bottom-sheet";

const { height, width } = Dimensions.get("screen");

const ReviewCard = ({ data }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        gap: RFValue(6),
      }}
    >
      <View
        style={{
          flexDirection: isArabic ? "row-reverse" : "row",
          gap: RFValue(12),
        }}
      >
        <Image
          alt="avatar"
          source={
            data?.client?.profilePictureUrl
              ? { uri: data?.client?.profilePictureUrl }
              : require("@/assets/images/profile.png")
          }
          style={{
            width: RFValue(32),
            height: RFValue(32),
            borderRadius: 999,
          }}
        />
        <View
          style={{
            flexDirection: "column",
            gap: RFValue(6),
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              color: black,
              fontWeight: "bold",
              fontSize: RFValue(14),
              textAlign: isArabic ? "right" : "left",
              maxWidth: (2 * width) / 3,
            }}
          >
            {data?.client?.firstName + " "} {data?.client?.lastName}
          </Text>
          <View
            style={{
              flexDirection: "row",
              gap: RFValue(15),
              paddingBottom: RFValue(6),
            }}
          >
            <Stars
              display={+data?.rating}
              spacing={8}
              count={5}
              starSize={8}
              fullStar={<FontAwesome name="star" color={"#FFCE31"} />}
              emptyStar={<FontAwesome name="star-o" color={"#FFCE31"} />}
            />
            <Text
              style={{
                color: black,
                fontSize: RFValue(8),
              }}
            >
              {dayjs(data?.createdAt).format("YYYY-MM-DD")}
            </Text>
          </View>
        </View>
      </View>
      <Text
        style={{
          color: black,
          fontSize: RFValue(12),
          textAlign: isArabic ? "right" : "left",
        }}
      >
        {data?.review}
      </Text>
    </View>
  );
};

const FreelancerProfile = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigation = useRouter();
  const { id } = useLocalSearchParams();

  const { access } = useAuthStore((state) => ({
    access: state.access,
  }));

  const [reviews, setReviews] = useState([]);
  const [limit, setLimit] = useState(0);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [haveNext, setHaveNext] = useState(false);

  const { data, loading, error } = useQuery(GET_FREELANCER_PROFILE, {
    variables: {
      userId: +id,
    },
    context: { accessToken: access },
    fetchPolicy: "cache-first",
    skip: Boolean(id) ? false : true,
  });

  const fetchReviews = async () => {
    setLoadingReviews(true);
    const { data, error } = await getFreelancersReviews(
      access,
      +id,
      0,
      limit + 5
    );
    if (error) {
      setLoadingReviews(false);
      alert(data);
    } else {
      setLoadingReviews(false);
      setReviews(data.nodes);
      setHaveNext(data.hasNextPage);
      setLimit((prevState) => prevState + 5);
    }
  };

  const reFetchReviews = async () => {
    setLoadingBtn(true);
    const { data, error } = await getFreelancersReviews(
      access,
      +id,
      0,
      limit + 5
    );
    if (error) {
      setLoadingBtn(false);
      alert(data);
    } else {
      setLoadingBtn(false);
      setReviews((prevState) => [...prevState, ...data.nodes]);
      setHaveNext(data.hasNextPage);
      setLimit((prevState) => prevState + 5);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <AuthProvider>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: "white",
        }}
      >
        <StatusBar barStyle="dark-content" />
        <SafeAreaView
          style={{
            backgroundColor: primary,
            paddingTop: RFValue(30),
            flex: 1,
          }}
        >
          <Appbar.BackAction
            color="white"
            onPress={() => {
              navigation.back();
            }}
          />
        </SafeAreaView>
        {loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              height: SCREEN_HEIGHT - StatusBar.currentHeight,
            }}
          >
            <Loading size="small" />
          </View>
        ) : (
          <>
            <View
              style={{
                height: height * 0.1,
                backgroundColor: primary,
              }}
            >
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  transform: [{ translateY: 92 / 2 }],
                  zIndex: 10,
                }}
              >
                <Image
                  alt="avatar"
                  source={
                    data?.freelancer?.profilePictureUrl
                      ? {
                          uri: data?.freelancer?.profilePictureUrl,
                        }
                      : require("@/assets/images/profile.png")
                  }
                  style={{
                    width: RFValue(92),
                    height: RFValue(92),
                    borderRadius: 999,
                    borderWidth: data?.freelancer?.profilePictureUrl ? 2 : 4,
                    borderColor: data?.freelancer?.profilePictureUrl
                      ? text3
                      : "white",
                    backgroundColor: "white",
                  }}
                />
              </View>
            </View>
            <View
              style={{
                paddingTop: 92 / 2,
                paddingHorizontal: RFValue(25),
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  paddingTop: RFValue(16),
                  gap: RFValue(8),
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: RFValue(4),
                    alignItems: "center",
                  }}
                >
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: RFValue(26),
                      fontWeight: "500",
                      color: black,
                    }}
                  >
                    {data?.freelancer?.firstName} {data?.freelancer?.lastName}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    gap: RFValue(4),
                    alignItems: "center",
                  }}
                >
                  <MaterialCommunityIcons
                    name="map-marker"
                    color={"#A1A1A1"}
                    size={16}
                  />
                  <Text
                    numberOfLines={1}
                    style={{
                      color: "#A1A1A1",
                      fontSize: RFValue(10),
                    }}
                  >
                    {data?.freelancer?.address?.building}{" "}
                    {data?.freelancer?.address?.street}{" "}
                    {data?.freelancer?.address?.state}{" "}
                    {data?.freelancer?.address?.city}{" "}
                    {data?.freelancer?.address?.zipCode}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: RFValue(10),
                    paddingTop: RFValue(10),
                  }}
                >
                  <View
                    style={{
                      gap: RFValue(2),
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    <MaterialCommunityIcons
                      name="star"
                      size={26}
                      color={"#FADB14"}
                    />
                    <Text
                      style={{
                        color: "#FADB14",
                        fontSize: RFValue(13),
                        fontWeight: "600",
                      }}
                    >
                      {parseInt(data?.freelancer?.rating)}
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: "#222222",
                      fontSize: RFValue(12),
                      letterSpacing: 0.1,
                    }}
                  >
                    {/* Avis */}
                  </Text>

                  <Text
                    style={{
                      color: black,
                      fontSize: RFValue(13),
                    }}
                  >
                    {data?.freelancer?.numberOfMissions > 1
                      ? `${data?.freelancer?.numberOfMissions || 0} ${t(
                          "missions"
                        )}`
                      : `${data?.freelancer?.numberOfMissions || 0} ${t(
                          "mission"
                        )}`}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "column",
                  gap: RFValue(4),
                  paddingTop: RFValue(40),
                  paddingBottom: RFValue(30),
                }}
              >
                <Text
                  style={{
                    color: black,
                    fontWeight: "500",
                    fontSize: RFValue(18),
                    textAlign: isArabic ? "right" : "left",
                  }}
                >
                  {t("A propos")}
                </Text>
                <Text
                  style={{
                    color: "#888888",
                    fontSize: RFValue(12),
                    marginTop: RFValue(10),
                    textAlign: isArabic ? "right" : "left",
                  }}
                  numberOfLines={4}
                >
                  {data?.freelancer?.about ?? (
                    <View
                      style={{
                        flexDirection: "column",
                        flex: 1,
                        paddingVertical: RFValue(10),
                      }}
                    >
                      <Image
                        alt="empty"
                        source={require("@/assets/images/empty.png")}
                        style={{
                          width: 60,
                          height: 60,
                          resizeMode: "contain",
                        }}
                      />
                    </View>
                  )}
                </Text>
              </View>
              <Text
                style={{
                  color: black,
                  fontWeight: "500",
                  fontSize: RFValue(18),
                  textAlign: isArabic ? "right" : "left",
                }}
              >
                {t("Note et Avis")}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "column",
                gap: RFValue(20),
                paddingHorizontal: RFValue(25),
                paddingTop: RFValue(20),
              }}
            >
              {loadingReviews ? (
                <Loading size="small" />
              ) : (
                <>
                  {!loadingReviews && reviews?.length === 0 && (
                    <View
                      style={{
                        flexDirection: "column",
                        flex: 1,
                        paddingVertical: RFValue(10),
                      }}
                    >
                      <Image
                        alt="empty"
                        source={require("@/assets/images/empty.png")}
                        style={{
                          width: 60,
                          height: 60,
                          resizeMode: "contain",
                        }}
                      />
                    </View>
                  )}
                  {!loadingReviews &&
                    reviews?.length > 0 &&
                    reviews?.map((review, index) => (
                      <React.Fragment key={index}>
                        <ReviewCard data={review} />
                      </React.Fragment>
                    ))}
                  {haveNext && (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        flex: 1 / 2,
                        marginTop: RFValue(20),
                      }}
                    >
                      <Button
                        style={{
                          borderRadius: 4,
                          height: 45,
                          justifyContent: "center",
                          borderWidth: 1,
                          borderColor: "#A1A1A1",
                        }}
                        mode="contained"
                        loading={loadingBtn}
                        buttonColor={"black"}
                        onPress={reFetchReviews}
                      >
                        <Text
                          style={{
                            fontSize: RFValue(12),
                            color: "white",
                            fontWeight: "600",
                          }}
                        >
                          more
                        </Text>
                      </Button>
                    </View>
                  )}
                </>
              )}
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: RFValue(25),
                paddingVertical: RFValue(30),
              }}
            >
              <Button
                style={{
                  borderRadius: 4,
                  height: 45,
                  justifyContent: "center",
                  marginTop: RFValue(20),
                }}
                mode="contained"
                buttonColor={primary}
                onPress={() => {
                  navigation.push({
                    pathname: "/client/create-offer",
                    params: { freelancerId: data?.freelancer?.id },
                  });
                }}
              >
                <Text
                  style={{
                    fontSize: RFValue(14),
                    color: "white",
                    fontWeight: "500",
                  }}
                >
                  {t("Embaucher")}
                </Text>
              </Button>
            </View>
          </>
        )}
      </ScrollView>
    </AuthProvider>
  );
};

export default FreelancerProfile;
