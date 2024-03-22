import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  FlatList,
  ActivityIndicator,
  Pressable,
} from "react-native";
import React, { useCallback, useRef, useState } from "react";
import { black, primary } from "@/constants/Colors";
import { RFValue } from "react-native-responsive-fontsize";
import Menu from "@/components/menu";
import * as Linking from "expo-linking";

import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Button, Divider } from "react-native-paper";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import {
  cancelOffer,
  completeHiring,
  getClientPaginatedOffers,
  getPaginatedMissions,
  startMission,
} from "@/graphql/services/freelancer.service";
import { useAuthStore } from "@/store/useAuthStore";
import Loading from "@/components/loading";
import dayjs from "dayjs";
import AuthProvider from "@/components/authProvider";
import { useTranslation } from "react-i18next";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";

const OfferCard: React.FC<{
  type: string;
  setType: any;
  item: any;
  fetchMissions: any;
}> = ({ type, setType, item, fetchMissions }) => {
  const { t, i18n } = useTranslation();
  item?.freelancer?.profilePictureUrl;
  console.log("ITEM");
  console.log({ item: item?.hiring?.offer?.freelancer });

  const navigation = useRouter();
  const animationHeight = useRef(new Animated.Value(0)).current;

  const { access } = useAuthStore((state: any) => ({
    access: state.access,
  }));

  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);

  const success = ["#46A56B20", "#46A56B"];
  const error = ["#D7626220", "#D76262"];
  const pending = ["#EF9F7120", "#EF9F71"];
  const start = ["#8E58B320", "#8E58B3"];

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

  const handleStartMission = async (id: number) => {
    setLoading(true);
    const { data, error } = await startMission(id, access);

    if (error) {
      setLoading(false);
      alert(data);
    } else {
      await fetchMissions();
      setLoading(false);
    }
  };

  const handleCompleteHiring = async (missionId: number) => {
    setLoading(true);
    const { data, error } = await completeHiring(missionId, access);

    if (error) {
      alert(data);
      setLoading(false);
    } else {
      await fetchMissions();
      setLoading(false);
      setType("COMPLETED");
    }
  };

  const handleCancelOffer = async (id: number) => {
    setLoadingBtn(true);
    const { data, error } = await cancelOffer(id, access);

    if (error) {
      setLoadingBtn(false);
      alert(data);
    } else {
      setLoadingBtn(false);
      setType("CANCELLED");
    }
  };

  return (
    <View
      style={{
        borderWidth: 0.4,
        borderColor: "#0000002B",
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
            {t("Offre N")} : {item?.id}
          </Text>
          <View
            style={{
              padding: RFValue(6),
              borderRadius: 4,
              backgroundColor:
                type === "CANCELLED"
                  ? error[0]
                  : type === "PENDING"
                  ? item?.status === "Completed"
                    ? success[0]
                    : start[0]
                  : type === "COMPLETED"
                  ? !item?.hiring?.hasClientReview &&
                    item?.hiring?.status === "COMPLETED"
                    ? start[0]
                    : success[0]
                  : type === "MULTIPLE"
                  ? item?.status === "REJECTED"
                    ? error[0]
                    : item?.status === "PENDING"
                    ? pending[0]
                    : item?.status === "ACCEPTED"
                    ? success[0]
                    : "white"
                  : "white",
            }}
          >
            <Text
              style={{
                color:
                  type === "CANCELLED"
                    ? error[1]
                    : type === "PENDING"
                    ? item?.status === "Completed"
                      ? success[1]
                      : start[1]
                    : type === "COMPLETED"
                    ? !item?.hiring?.hasClientReview &&
                      item?.hiring?.status === "COMPLETED"
                      ? start[1]
                      : success[1]
                    : type === "MULTIPLE"
                    ? item?.status === "REJECTED"
                      ? error[1]
                      : item?.status === "PENDING"
                      ? pending[1]
                      : item?.status === "ACCEPTED"
                      ? success[1]
                      : "black"
                    : "black",
              }}
            >
              {type === "PENDING"
                ? item?.status === "InProgress"
                  ? t("En cours")
                  : item?.status === "Requested"
                  ? t("Commencé")
                  : item?.status === "Completed"
                  ? t("Complété")
                  : item?.status
                : type === "COMPLETED"
                ? !item?.hiring?.hasClientReview &&
                  item?.hiring?.status === "COMPLETED"
                  ? t("Complété")
                  : t("Finis")
                : type === "MULTIPLE"
                ? item?.status === "REJECTED"
                  ? t("Rejected")
                  : item?.status === "PENDING"
                  ? t("En attente")
                  : item?.status === "ACCEPTED"
                  ? t("Accepté")
                  : "other"
                : type === "CANCELLED"
                ? t("Annulée")
                : "OTHER"}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
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
              source={
                type === "MULTIPLE" || type === "CANCELLED"
                  ? item?.freelancer?.profilePictureUrl
                    ? { uri: item?.freelancer?.profilePictureUrl }
                    : require("@/assets/images/profile.png")
                  : item?.hiring?.offer?.freelancer?.profilePictureUrl
                  ? { uri: item?.hiring?.offer?.freelancer?.profilePictureUrl }
                  : require("@/assets/images/profile.png")
              }
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
                  maxWidth: SCREEN_WIDTH / 3,
                }}
              >
                {type === "MULTIPLE" || type === "CANCELLED"
                  ? item?.freelancer?.firstName
                  : item?.hiring?.offer?.freelancer?.firstName + " "}{" "}
                {type === "MULTIPLE" || type === "CANCELLED"
                  ? item?.freelancer?.lastName
                  : item?.hiring?.offer?.freelancer?.lastName}
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
                  {type === "MULTIPLE" || type === "CANCELLED"
                    ? parseInt(item?.freelancer?.rating)
                    : parseInt(item?.hiring?.offer?.freelancer?.rating)}
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
            {type === "MULTIPLE" || type === "CANCELLED"
              ? item?.price?.discountedPrice > 0
              : item?.hiring?.offer?.price?.discountedPrice > 0 && (
                  <Text
                    style={{
                      fontSize: RFValue(12),
                      textDecorationLine: "line-through",
                      color: "#D76262",
                    }}
                  >
                    {type === "MULTIPLE" || type === "CANCELLED"
                      ? item?.price?.price
                      : item?.hiring?.offer?.price?.price}{" "}
                    {t("DZD")}
                  </Text>
                )}
            <Text
              style={{
                fontSize: RFValue(12),
                color: "#2F2E36",
                fontWeight: "500",
              }}
            >
              {type === "MULTIPLE" || type === "CANCELLED"
                ? item?.price?.total
                : item?.hiring?.offer?.price?.total}{" "}
              {t("DZD")}
            </Text>
            {(type === "MULTIPLE" &&
              (item?.status === "REJECTED" || item?.status === "PENDING")) ||
            type === "CANCELLED" ? null : (
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
                      type === "MULTIPLE" || type === "CANCELLED"
                        ? item?.freelancer?.phoneNumber
                        : item?.hiring?.offer?.freelancer?.phoneNumber;
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
                  style={{
                    color: "#2F2E36",
                    fontSize: RFValue(14),
                  }}
                >
                  {type === "MULTIPLE" || type === "CANCELLED"
                    ? item?.freelancer?.address?.street
                    : item?.hiring?.offer?.freelancer?.address?.street}
                </Text>
                <Text
                  style={{
                    color: "#B8B8B8",
                    fontSize: RFValue(12),
                  }}
                >
                  {type === "MULTIPLE" || type === "CANCELLED"
                    ? item?.freelancer?.address?.city
                    : item?.hiring?.offer?.freelancer?.address?.city}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "column",
                  gap: RFValue(6),
                }}
              >
                <Text
                  style={{
                    color: "#2F2E36",
                    fontSize: RFValue(14),
                  }}
                >
                  {type === "MULTIPLE" || type === "CANCELLED"
                    ? item?.home?.address?.street
                    : item?.hiring?.offer?.home?.address?.street}
                </Text>
                <Text
                  style={{
                    color: "#B8B8B8",
                    fontSize: RFValue(12),
                  }}
                >
                  {type === "MULTIPLE" || type === "CANCELLED"
                    ? item?.home?.address?.city
                    : item?.hiring?.offer?.home?.address?.city}
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
              <View
                style={{
                  flexDirection: "row",
                  gap: RFValue(4),
                }}
              >
                <Text
                  style={{
                    fontSize: RFValue(12),
                    color: "#A1A1A1",
                  }}
                >
                  {t("Date")}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: RFValue(4),
                }}
              >
                <Text
                  style={{
                    color: "#A1A1A1",
                    fontSize: RFValue(12),
                  }}
                >
                  {dayjs(item?.date).format("YYYY-MM-DD")}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              paddingHorizontal: RFValue(40),
              paddingBottom: RFValue(10),
            }}
          >
            {type === "PENDING" && item?.status === "Requested" && (
              <Button
                style={{
                  borderRadius: 4,
                  height: 45,
                  justifyContent: "center",
                }}
                loading={loading}
                mode="contained"
                buttonColor={primary}
                onPress={() => {
                  handleStartMission(item?.id);
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "white",
                    fontWeight: "600",
                  }}
                >
                  {t("Valider")}
                </Text>
              </Button>
            )}
            {type === "PENDING" &&
              item?.status === "Completed" &&
              item?.hiring?.status !== "COMPLETED" && (
                <Button
                  style={{
                    borderRadius: 4,
                    height: 45,
                    justifyContent: "center",
                  }}
                  loading={loading}
                  mode="contained"
                  buttonColor={success[1]}
                  onPress={() => {
                    handleCompleteHiring(item?.hiring?.id);
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    {t("Confirmation de fin")}
                  </Text>
                </Button>
              )}

            {type === "COMPLETED" &&
              !item?.hiring?.hasFreelancerReview &&
              item?.hiring?.status === "COMPLETED" && (
                <Button
                  style={{
                    borderRadius: 4,
                    height: 45,
                    justifyContent: "center",
                  }}
                  loading={loading}
                  mode="contained"
                  buttonColor={primary}
                  onPress={() => {
                    navigation.push({
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
              )}

            {type === "MULTIPLE" && item?.status === "PENDING" && (
              <Button
                style={{
                  borderRadius: 4,
                  height: 45,
                  justifyContent: "center",
                }}
                loading={loadingBtn}
                mode="contained"
                buttonColor={error[1]}
                onPress={() => {
                  handleCancelOffer(item?.id);
                }}
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
            )}
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const EmptyOffers = () => {
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

const OffersTab: React.FC<{
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
        flexWrap: "wrap",
        justifyContent: "center",
        gap: RFValue(10),
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
            borderColor: "rgba(197, 195, 195, 0.5)",
            borderWidth: 1,
            minWidth: 80,
            justifyContent: "center",
            alignContent: "center",
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

const data = [
  {
    type: "PENDING",
    id: "1",
    previousPrice: "4500",
    newPrice: "3500",
    name: "hadya aqila",
    star: "4.9",
    startAdr: "23 Rue Didouche Mourad",
    endAdr: "15 Avenue Pasteur, belouizdad",
    distance: "5km",
    date: "24.07.22 12:30",
  },
  {
    type: "started",
    id: "2",
    previousPrice: "4500",
    newPrice: "3500",
    name: "hadya aqila",
    star: "4.9",
    startAdr: "23 Rue Didouche Mourad",
    endAdr: "15 Avenue Pasteur, belouizdad",
    distance: "5km",
    date: "24.07.22 12:30",
  },
  {
    type: "completed",
    id: "2",
    previousPrice: "4500",
    newPrice: "3500",
    name: "hadya aqila",
    star: "4.9",
    startAdr: "23 Rue Didouche Mourad",
    endAdr: "15 Avenue Pasteur, belouizdad",
    distance: "5km",
    date: "24.07.22 12:30",
  },
];

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

const Offers = () => {
  const { activeStatus }: any = useLocalSearchParams();

  const { t, i18n } = useTranslation();
  const tabItems = [
    { value: "MULTIPLE", label: t("En attente") },
    { value: "PENDING", label: t("Commencé") },
    { value: "COMPLETED", label: t("Complété") },
    { value: "CANCELLED", label: t("Annulée") },
  ];
  const [active, setActive] = useState(activeStatus ?? "MULTIPLE");
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offersLimit, setOffersLimit] = useState(0);
  const [missionsLimit, setMissionsLimit] = useState(0);
  const [offersHaveNext, setOffersHaveNext] = useState(false);
  const [missionsHaveNext, setMissionsHaveNext] = useState(false);
  const { access, id } = useAuthStore((state: any) => ({
    access: state.access,
    id: state.id,
  }));

  const fetchMissions = async (status: string) => {
    setOffersHaveNext(false);
    setLoading(true);
    const { data, error } = await getPaginatedMissions(access, {
      options: {
        skip: 0,
        take: 5,
        where: {
          hiring: {
            status,
            offer: {
              client: {
                id,
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

  const reFetchMissions = async (status: string) => {
    setOffersHaveNext(false);
    //setLoading(true);
    const { data, error } = await getPaginatedMissions(access, {
      options: {
        skip: 0,
        take: missionsLimit + 5,
        where: {
          hiring: {
            status,
            offer: {
              client: {
                id,
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

  const fetchOffers = async (status?: string) => {
    setMissionsHaveNext(false);

    setLoading(true);
    const { data, error } = await getClientPaginatedOffers(
      {
        options: {
          where: {
            client: {
              id,
            },
            multipleOfferStatuses:
              status === "CANCELLED"
                ? ["CANCELLED"]
                : ["ACCEPTED", "PENDING", "REJECTED"],
          },
          skip: 0,
          take: 5,
        },
      },
      access
    );

    if (error) {
      setLoading(false);
      alert(data);
    } else {
      setOffersHaveNext(data?.hasNextPage);
      setOffersLimit(5);
      setOffers(data?.nodes);
      setLoading(false);
    }
  };

  const reFetchOffers = async (status?: string) => {
    setMissionsHaveNext(false);
    //setLoading(true);
    const { data, error } = await getClientPaginatedOffers(
      {
        options: {
          where: {
            client: {
              id,
            },
            multipleOfferStatuses:
              status === "CANCELLED"
                ? ["CANCELLED"]
                : ["ACCEPTED", "PENDING", "REJECTED"],
          },
          skip: 0,
          take: offersLimit + 5,
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
        fetchMissions("PENDING");
      } else if (active === "COMPLETED") {
        fetchMissions("COMPLETED");
      } else if (active === "MULTIPLE") {
        fetchOffers();
      } else if (active === "CANCELLED") {
        fetchOffers("CANCELLED");
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
            paddingBottom: RFValue(50),
          }}
        >
          <Text
            style={{
              paddingBottom: RFValue(data.length === 0 ? 40 : 16),
              fontSize: RFValue(26),
              color: black,
              textAlign: i18n.language === "ar" ? "right" : "left",
              fontWeight: "600",
            }}
          >
            {t("Mes commandes")}
          </Text>
          <OffersTab active={active} setActive={setActive} items={tabItems} />

          <View style={{ paddingTop: RFValue(32) }}></View>
          {loading && <Loading size="small" title="" />}

          {offers?.length > 0 && !loading && (
            <FlatList
              data={offers}
              showsVerticalScrollIndicator={false}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <OfferCard
                  fetchMissions={fetchMissions}
                  setType={setActive}
                  item={item}
                  type={active}
                />
              )}
              onEndReachedThreshold={0}
              onEndReached={() => {
                if (active === "PENDING") {
                  missionsHaveNext && reFetchMissions("PENDING");
                } else if (active === "COMPLETED") {
                  missionsHaveNext && reFetchMissions("COMPLETED");
                } else if (active === "MULTIPLE") {
                  offersHaveNext && reFetchOffers();
                } else if (active === "CANCELLED") {
                  offersHaveNext && reFetchOffers("CANCELLED");
                }
              }}
              ListFooterComponent={
                offers?.length > 0
                  ? missionsHaveNext || offersHaveNext
                    ? renderFooter
                    : null
                  : null
              }
              ListEmptyComponent={EmptyOffers}
            />
          )}

          {!loading && offers?.length === 0 && (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: RFValue(25),
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
        </View>
      </Menu>
    </AuthProvider>
  );
};

export default Offers;
