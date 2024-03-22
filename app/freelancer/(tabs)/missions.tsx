import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  FlatList,
  ActivityIndicator,
  Alert,
  Pressable,
  Linking,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { black, primary } from "@/constants/Colors";
import { RFValue } from "react-native-responsive-fontsize";
import Menu from "@/components/menu";
import dayjs from "dayjs";
import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Button, Divider } from "react-native-paper";
import {
  acceptMission,
  acceptOffer,
  cancelOffer,
  createHiring,
  createMission,
  getClientPaginatedOffers,
  getPaginatedMissions,
  rejectOffer,
} from "@/graphql/services/freelancer.service";
import { useAuthStore } from "@/store/useAuthStore";
import Loading from "@/components/loading";
import AuthProvider from "@/components/authProvider";
import { useTranslation } from "react-i18next";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";

const MissionCard: React.FC<{
  type: string;
  item: any;
  setType: any;
  fetchMissions: any;
}> = ({ type, item, setType, fetchMissions }) => {
  const { t, i18n } = useTranslation();
  const animationHeight = useRef(new Animated.Value(0)).current;

  const [expanded, setExpanded] = useState(false);
  const [loadingP, setLoadingP] = useState(false);
  const [loadingAccepted, setLoadingAccepted] = useState(false);
  const [loadingRejected, setLoadingRejected] = useState(false);
  const [loadingStarted, setLoadingStarted] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);

  const success = ["#46A56B20", "#46A56B"];
  const error = ["#D7626220", "#D76262"];
  const pending = ["#EF9F7120", "#EF9F71"];
  const start = ["#8E58B320", "#8E58B3"];

  const { access } = useAuthStore((state: any) => ({
    access: state.access,
  }));

  const toggleItem = () => {
    const toValue = expanded ? 0 : 1;

    Animated.timing(animationHeight, {
      toValue,
      duration: 100,
      useNativeDriver: false,
    }).start();

    setExpanded(!expanded);
  };

  const rotateArrow = animationHeight.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const handleOperationOffer = async (type: string, offerId: number) => {
    if (type === "reject") {
      setLoadingRejected(true);

      const { data, error } = await rejectOffer(offerId, access);

      if (error) {
        setLoadingRejected(false);

        return Alert.alert("Error", data);
      } else {
        setLoadingRejected(false);
        setType("REFUSEE");
      }
    } else {
      setLoadingAccepted(true);
      const { data, error } = await acceptOffer(offerId, access);

      if (error) {
        setLoadingAccepted(false);

        return Alert.alert("Error", data);
      } else {
        const { data, error } = await createHiring(offerId, access);
        if (error) {
          setLoadingAccepted(false);
          return Alert.alert("Error", data);
        } else {
          setType("ACCEPTED");
          setLoadingAccepted(false);
        }
      }
    }
  };

  const handleCreateMission = async (hiringId: number) => {
    setLoadingStarted(true);
    const { data, error } = await createMission(hiringId, access);

    if (error) {
      setLoadingStarted(false);
      return Alert.alert("Error", data);
    } else {
      setLoadingStarted(false);

      setType("COMPLETED");
    }
  };

  const handleAcceptMission = async (id: number) => {
    setLoadingP(true);
    const { data, error } = await acceptMission(id, access);
    if (error) {
      setLoadingP(false);

      console.log("ACCEPT MISSION ERROR ---");
      console.log(data);
      alert(data);
    } else {
      await fetchMissions();
      setLoadingP(false);
      console.log("ACCEPT MISSION RESPONSE --- ");
      console.log(data);
    }
  };

  const handleCancelOffer = async (id: number) => {
    setLoadingCancel(true);
    const { data, error } = await cancelOffer(id, access);

    if (error) {
      setLoadingCancel(false);
      alert(data);
    } else {
      setLoadingCancel(false);
      setType("REJECTED");
    }
  };

  return (
    <View
      style={{
        borderWidth: 0.4,
        borderColor: "#0000002B",
        backgroundColor: "white",
        paddingVertical: RFValue(10),
        borderRadius: 8,
        marginBottom: RFValue(20),
      }}
    >
      <View
        style={{
          flexDirection: "column",
          gap: RFValue(16),
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: RFValue(20),
          }}
        >
          <Text
            style={{
              color: "#888888",
              fontSize: RFValue(12),
            }}
          >
            {t("Order N")} : {item?.id}
          </Text>
          <View
            style={{
              padding: RFValue(6),
              borderRadius: 4,
              backgroundColor:
                type === "REJECTED"
                  ? error[0]
                  : type === "REFUSEE"
                  ? error[0]
                  : type === "PENDING"
                  ? pending[0]
                  : type === "COMPLETED"
                  ? item?.status === "InProgress"
                    ? pending[0]
                    : item?.status === "Requested"
                    ? start[0]
                    : item?.status === "Completed"
                    ? item?.hiring?.status !== "COMPLETED"
                      ? pending[0]
                      : success[0]
                    : "white"
                  : type === "ACCEPTED"
                  ? success[0]
                  : "transparent",
            }}
          >
            <Text
              style={{
                color:
                  type === "REJECTED"
                    ? error[1]
                    : type === "REFUSEE"
                    ? error[1]
                    : type === "PENDING"
                    ? pending[1]
                    : type === "COMPLETED"
                    ? item?.status === "InProgress"
                      ? pending[1]
                      : item?.status === "Requested"
                      ? start[1]
                      : item?.status === "Completed"
                      ? item?.hiring?.status !== "COMPLETED"
                        ? pending[1]
                        : success[1]
                      : "black"
                    : type === "ACCEPTED"
                    ? success[1]
                    : "black",
              }}
            >
              {type === "REJECTED"
                ? t("Annulée")
                : item?.status === "Requested"
                ? t("En attente de validation")
                : item?.status === "InProgress"
                ? t("En cours")
                : item?.status === "Completed" &&
                  item?.hiring?.status !== "COMPLETED"
                ? t("Attente validation de fin")
                : item?.status === "Completed" &&
                  item?.hiring?.status === "COMPLETED"
                ? t("Terminé")
                : item?.status === "PENDING"
                ? t("En attente")
                : item?.status === "REJECTED"
                ? t("Annulée")
                : item?.status}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "space-between",
            paddingHorizontal: RFValue(20),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: RFValue(10),
            }}
          >
            <Image
              alt="avatar"
              source={require("@/assets/images/profile.png")}
              style={{
                width: 35,
                height: 35,
                borderRadius: 999,
                borderColor: "#D9D9D9",
                borderWidth: 1,
                backgroundColor: "#FAFAFA",
              }}
            />
            <View
              style={{
                flexDirection: "column",
                gap: RFValue(6),
              }}
            >
              <Text
                numberOfLines={2}
                style={{
                  color: "#000000",
                  fontSize: RFValue(14),
                  fontWeight: "500",
                  maxWidth: RFValue(100),
                }}
              >
                {type === "COMPLETED"
                  ? item?.hiring?.offer?.client?.firstName
                  : item?.client?.firstName}{" "}
                {type === "COMPLETED"
                  ? item?.hiring?.offer?.client?.lastName
                  : item?.client?.lastName}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  gap: RFValue(3),
                  alignItems: "center",
                }}
              >
                <Feather name="star" color="#F6D91E" size={16} />
                <Text
                  style={{
                    color: "#B8B8B8",
                    fontSize: RFValue(12),
                  }}
                >
                  {type === "COMPLETED"
                    ? parseInt(item?.hiring?.offer?.client?.rating)
                    : parseInt(item?.client?.rating)}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: "column",
              gap: RFValue(3),
            }}
          >
            {type === "COMPLETED" ? (
              parseInt(item?.hiring?.offer?.price?.discountedPrice) > 0 ? (
                <>
                  <Text
                    style={{
                      fontSize: RFValue(12),
                      textDecorationLine: "line-through",
                      color: "#D76262",
                    }}
                  >
                    {type === "COMPLETED"
                      ? item?.hiring?.offer?.price?.total
                      : item?.price?.total}{" "}
                    {t("DZD")}
                  </Text>
                </>
              ) : null
            ) : (
              parseInt(item?.price?.discountedPrice) > 0 && (
                <Text
                  style={{
                    fontSize: RFValue(12),
                    textDecorationLine: "line-through",
                    color: "#D76262",
                  }}
                >
                  {type === "COMPLETED"
                    ? item?.hiring?.offer?.price?.total
                    : item?.price?.total}{" "}
                  {t("DZD")}
                </Text>
              )
            )}
            <Text
              style={{
                fontSize: RFValue(14),
                color: "#2F2E36",
                fontWeight: "500",
              }}
            >
              {type === "COMPLETED"
                ? item?.hiring?.offer?.price?.price
                : item?.price?.price}{" "}
              {t("DZD")}
            </Text>

            {type === "COMPLETED" && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  paddingVertical: RFValue(10),
                }}
              >
                <Pressable
                  onPress={() => {
                    const phoneNumber =
                      item?.hiring?.offer?.client?.phoneNumber;

                    Linking.openURL(`tel:${phoneNumber}`);
                  }}
                >
                  <Feather name="phone" size={20} color={success[1]} />
                </Pressable>
              </View>
            )}
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: RFValue(20),
          }}
        >
          <Divider />
        </View>
        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={toggleItem}
        >
          <Animated.View style={{ transform: [{ rotate: rotateArrow }] }}>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={24}
              color={"black"}
            />
          </Animated.View>
        </TouchableOpacity>
        <Animated.View
          style={{
            maxHeight: animationHeight.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 400],
            }),
            overflow: "hidden",
          }}
        >
          <View
            style={{
              flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
              gap: RFValue(12),
              paddingHorizontal: RFValue(20),
            }}
          >
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              <View
                style={{
                  width: 16,
                  height: 16,
                  backgroundColor: "#D9D9D9",
                  borderRadius: 999,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 4,
                    height: 4,
                    backgroundColor: primary,
                    borderRadius: 999,
                  }}
                ></View>
              </View>
              <View
                style={{
                  width: 1,
                  height: RFValue(22),
                  backgroundColor: "#E7E7E780",
                }}
              ></View>
              <MaterialCommunityIcons
                name="map-marker"
                color={primary}
                size={20}
              />
            </View>
            <View
              style={{
                flexDirection: "column",
                gap: RFValue(8),
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  gap: RFValue(6),
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    color: "#2F2E36",
                    fontSize: RFValue(14),
                    paddingRight: RFValue(10),
                  }}
                >
                  {type === "COMPLETED"
                    ? item?.hiring?.offer?.home?.address?.street
                    : item?.home?.address?.street}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    color: "#B8B8B8",
                    fontSize: RFValue(12),
                    paddingRight: RFValue(10),
                  }}
                >
                  {type === "COMPLETED"
                    ? item?.hiring?.offer?.home?.address?.city
                    : item?.home?.address?.city}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "column",
                  gap: RFValue(6),
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    color: "#2F2E36",
                    fontSize: RFValue(14),
                    paddingRight: RFValue(10),
                  }}
                >
                  {type === "COMPLETED"
                    ? item?.hiring?.offer?.freelancer?.address?.street
                    : item?.freelancer?.address?.street}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    color: "#B8B8B8",
                    fontSize: RFValue(12),
                    paddingRight: RFValue(10),
                  }}
                >
                  {type === "COMPLETED"
                    ? item?.hiring?.offer?.freelancer?.address?.city
                    : item?.freelancer?.address?.city}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              paddingVertical: RFValue(30),
            }}
          >
            <View
              style={{
                paddingVertical: RFValue(12),
                paddingHorizontal: RFValue(20),
                backgroundColor: "#8E58B320",
                flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  color: "#222",
                  fontSize: RFValue(12),
                  textAlign: "center",
                }}
              >
                {t("Date")}
              </Text>
              <Text
                style={{
                  color: "#A1A1A1",
                  fontSize: RFValue(12),
                  textAlign: "center",
                }}
              >
                {dayjs(item?.date).format("YYYY-MM-DD")}
              </Text>
            </View>
          </View>
          {type === "PENDING" && (
            <View
              style={{
                paddingHorizontal: RFValue(40),
                paddingBottom: RFValue(10),
                flexDirection: "row",
                justifyContent: "center",
                gap: RFValue(8),
              }}
            >
              <Button
                style={{
                  borderRadius: 4,
                  height: 45,
                  justifyContent: "center",
                }}
                mode="contained"
                buttonColor={"#46A56B"}
                loading={loadingAccepted}
                onPress={() => {
                  handleOperationOffer("accept", item?.id);
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "white",
                    fontWeight: "600",
                  }}
                >
                  {t("Accepté")}
                </Text>
              </Button>
              <Button
                style={{
                  borderRadius: 4,
                  height: 45,
                  justifyContent: "center",
                }}
                mode="contained"
                buttonColor={"#D76262"}
                loading={loadingRejected}
                onPress={() => handleOperationOffer("reject", item?.id)}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "white",
                    fontWeight: "600",
                  }}
                >
                  {t("Rejected")}
                </Text>
              </Button>
            </View>
          )}

          {type === "ACCEPTED" && (
            <View
              style={{
                paddingHorizontal: RFValue(40),
                justifyContent: "center",
                alignItems: "center",
                gap: RFValue(15),
                flexDirection: "row",
              }}
            >
              <Button
                style={{
                  borderRadius: 4,
                  height: 45,
                  justifyContent: "center",
                }}
                mode="contained"
                buttonColor={primary}
                loading={loadingStarted}
                onPress={() => handleCreateMission(item?.hiring?.id)}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "white",
                    fontWeight: "600",
                  }}
                >
                  {t("Commencer")}
                </Text>
              </Button>
              <Button
                style={{
                  borderRadius: 4,
                  height: 45,
                  justifyContent: "center",
                }}
                mode="contained"
                buttonColor={error[1]}
                loading={loadingCancel}
                onPress={() => handleCancelOffer(+item?.id)}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "white",
                    fontWeight: "600",
                  }}
                >
                  {t("Annuler")}
                </Text>
              </Button>
            </View>
          )}

          {type === "COMPLETED" && item?.status === "InProgress" && (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                gap: RFValue(10),
                flexDirection: "row",
                paddingHorizontal: RFValue(10),
              }}
            >
              <Button
                style={{
                  borderRadius: 4,
                  height: 45,
                  justifyContent: "center",
                  flex: 1,
                }}
                mode="contained"
                loading={loadingP}
                buttonColor={primary}
                onPress={() => {
                  handleAcceptMission(item?.id);
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "white",
                    fontWeight: "600",
                  }}
                >
                  {t("Complété")}
                </Text>
              </Button>
            </View>
          )}
          {type === "COMPLETED" &&
            !item?.hiring?.hasClientReview &&
            item?.hiring?.status === "COMPLETED" && (
              <View
                style={{
                  paddingHorizontal: RFValue(25),
                }}
              >
                <Button
                  style={{
                    borderRadius: 4,
                    height: 45,
                    justifyContent: "center",
                  }}
                  mode="contained"
                  buttonColor={primary}
                  onPress={() => {
                    router.push({
                      pathname: "/review",
                      params: {
                        hiringId: item?.hiring?.id,
                        freelancerId: item?.hiring?.offer?.freelancer?.id,
                        clientId: item?.hiring?.offer?.client?.id,
                      },
                    });
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    {t("Avis")}
                  </Text>
                </Button>
              </View>
            )}
        </Animated.View>
      </View>
    </View>
  );
};

const EmptyMissions = () => {
  return (
    <View
      style={{
        flexDirection: "column",
        alignItems: "center",
        gap: RFValue(40),
      }}
    >
      <Image
        alt="empty"
        source={require("@/assets/images/empty.png")}
        style={{
          width: 150,
          height: 150,
          resizeMode: "contain",
        }}
      />
    </View>
  );
};

const renderFooter = () => {
  return (
    <View
      style={{
        padding: RFValue(10),
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator color={primary} />
    </View>
  );
};

const MissionsTab: React.FC<{
  active: string;
  setActive: (value: string) => void;
  items: Array<{
    value: string;
    label: string;
  }>;
}> = ({ active, setActive, items }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        borderRadius: 6,
        shadowColor: "rgba(197, 195, 195, 0.15)",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 1,
        shadowRadius: 22,
        elevation: 4,
        paddingVertical: RFValue(2),
        justifyContent: "center",
        flexWrap: "wrap",
        gap: RFValue(8),
      }}
    >
      {items.map(({ value, label }, index: number) => (
        <TouchableOpacity
          key={index}
          style={{
            paddingVertical: RFValue(12),
            paddingHorizontal: RFValue(8),
            backgroundColor: value === active ? primary : "transparent",
            borderRadius: 6,
            borderColor: "#F3F3F3",
            borderWidth: 1,
            minWidth: 80,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            setActive(value);
          }}
        >
          <Text
            style={{
              fontWeight: "500",
              fontSize: RFValue(14),
              color: value === active ? "white" : "#71717A",
            }}
          >
            {label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const Missions = () => {
  const { activeStatus }: any = useLocalSearchParams();

  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const tabItems = [
    { value: "PENDING", label: t("Arrivées") },
    { value: "ACCEPTED", label: t("En attente") },
    { value: "REFUSEE", label: t("Refused") },
    { value: "COMPLETED", label: t("Missions") },
    { value: "REJECTED", label: t("Annulée") },
  ];

  const [active, setActive] = useState(activeStatus ?? "PENDING");
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState([]);
  const [offersLimit, setOffersLimit] = useState(0);
  const [missionsLimit, setMissionsLimit] = useState(0);
  const [offersHaveNext, setOffersHaveNext] = useState(false);
  const [missionsHaveNext, setMissionsHaveNext] = useState(false);
  const { access, id } = useAuthStore((state: any) => ({
    access: state.access,
    id: state.id,
  }));

  const fetchMissions = async () => {
    setOffersHaveNext(false);
    setLoading(true);
    const { data, error } = await getPaginatedMissions(access, {
      options: {
        skip: 0,
        take: 5,
        where: {
          hiring: {
            offer: {
              freelancer: {
                id,
                availability: {
                  date: null,
                  type: null,
                },
              },
            },
          },
        },
      },
    });

    if (error) {
      setLoading(false);
      alert(data);
    } else {
      setMissionsHaveNext(data?.hasNextPage);
      setMissionsLimit(5);
      setOffers(data?.nodes);
      setLoading(false);
    }
  };

  const reFetchMissions = async () => {
    setOffersHaveNext(false);
    const { data, error } = await getPaginatedMissions(access, {
      options: {
        skip: 0,
        take: missionsLimit + 5,
        where: {
          hiring: {
            offer: {
              freelancer: {
                id,
                availability: {
                  date: null,
                  type: null,
                },
              },
            },
          },
        },
      },
    });

    if (error) {
      setLoading(false);
      alert(data);
    } else {
      setMissionsHaveNext(data?.hasNextPage);
      setMissionsLimit((prevState) => prevState + 5);
      setOffers(data?.nodes);
      setLoading(false);
    }
  };

  const fetchOffers = async (status: string) => {
    setMissionsHaveNext(false);

    setLoading(true);
    const { data, error } = await getClientPaginatedOffers(
      {
        options: {
          skip: 0,
          take: 5,
          where: {
            hiringStatus: status === "ACCEPTED" ? "DRAFT" : null,
            freelancer: {
              id,
              availability: {
                type: null,
                date: null,
              },
            },
            status,
          },
        },
      },
      access
    );
    if (error) {
      setLoading(false);
      alert(data);
    } else {
      console.log("DATA MISSIONS len ==>");
      console.log(data?.nodes?.length);

      console.log("DATA MISSIONS hasNextPage ==>");
      console.log(data?.hasNextPage);
      setOffersHaveNext(data?.hasNextPage);
      setOffersLimit(5);
      setOffers(data?.nodes);
      setLoading(false);
    }
  };

  const reFetchOffers = async (status: string) => {
    setMissionsHaveNext(false);
    const { data, error } = await getClientPaginatedOffers(
      {
        options: {
          skip: 0,
          take: offersLimit + 5,
          where: {
            hiringStatus: status === "ACCEPTED" ? "DRAFT" : null,
            freelancer: {
              id,
              availability: {
                type: null,
                date: null,
              },
            },
            status,
          },
        },
      },
      access
    );
    if (error) {
      setLoading(false);
      alert(data);
    } else {
      setOffersHaveNext(data?.hasNextPage);
      setOffersLimit((prevState) => prevState + 5);
      setOffers(data?.nodes);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (active === "PENDING") {
        fetchOffers("PENDING");
      } else if (active === "ACCEPTED") {
        fetchOffers("ACCEPTED");
      } else if (active === "DRAFT") {
        fetchOffers("DRAFT");
      } else if (active === "REJECTED") {
        fetchOffers("CANCELLED");
      } else if (active === "COMPLETED") {
        fetchMissions();
      } else if (active === "REFUSEE") {
        fetchOffers("REJECTED");
      }
    }, [active])
  );

  return (
    <AuthProvider>
      <Menu>
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            paddingTop: RFValue(20),
            paddingHorizontal: RFValue(25),
            paddingBottom: RFValue(60),
          }}
        >
          <Text
            style={{
              paddingBottom: RFValue(offers?.length === 0 ? 40 : 16),
              fontSize: RFValue(26),
              color: black,
              textAlign: i18n.language === "ar" ? "right" : "left",
              fontWeight: "600",
            }}
          >
            {t("Mes commandes")}
          </Text>

          <MissionsTab active={active} setActive={setActive} items={tabItems} />
          <View style={{ paddingTop: RFValue(32) }}></View>
          {loading && <Loading size="small" title="" />}

          {offers?.length > 0 && !loading && (
            <FlatList
              data={offers}
              showsVerticalScrollIndicator={false}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <MissionCard
                  fetchMissions={fetchMissions}
                  setType={setActive}
                  item={item}
                  type={active}
                />
              )}
              onEndReachedThreshold={offersHaveNext ? null : 0}
              onEndReached={() => {
                if (active === "PENDING") {
                  offersHaveNext && reFetchOffers("PENDING");
                } else if (active === "ACCEPTED") {
                  offersHaveNext && reFetchOffers("ACCEPTED");
                } else if (active === "DRAFT") {
                  offersHaveNext && reFetchOffers("DRAFT");
                } else if (active === "REJECTED") {
                  offersHaveNext && reFetchOffers("CANCELLED");
                } else if (active === "COMPLETED") {
                  missionsHaveNext && reFetchMissions();
                } else if (active === "REFUSEE") {
                  offersHaveNext && reFetchOffers("REJECTED");
                }
              }}
              ListFooterComponent={
                offers?.length > 0
                  ? missionsHaveNext || offersHaveNext
                    ? renderFooter
                    : null
                  : null
              }
              ListEmptyComponent={EmptyMissions}
            />
            /*    <ScrollView
              showsVerticalScrollIndicator={false}
              style={{
                flexDirection: "column",
                gap: RFValue(16),
              }}
            >
              {!loading &&
                offers?.map((offer, index) => (
                  <React.Fragment key={index}>
                    <MissionCard
                      fetchMissions={fetchMissions}
                      setType={setActive}
                      item={offer}
                      type={active}
                    />
                  </React.Fragment>
                ))}
            </ScrollView> */
          )}
          {offers?.length === 0 && !loading && (
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                gap: RFValue(40),
              }}
            >
              <Image
                alt="empty"
                source={require("@/assets/images/empty.png")}
                style={{
                  width: 150,
                  height: 150,
                  resizeMode: "contain",
                }}
              />
            </View>
          )}
        </View>
      </Menu>
    </AuthProvider>
  );
};

export default Missions;
