import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
  FlatList,
  Image,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { RFValue } from "react-native-responsive-fontsize";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { primary } from "@/constants/Colors";
import { ActivityIndicator } from "react-native-paper";

import {
  deleteFreelancerAvailability,
  getPaginatedFreelancerAvailability,
} from "@/graphql/services/freelancer.service";
import { useAuthStore } from "@/store/useAuthStore";
import Loading from "@/components/loading";
import dayjs from "dayjs";
import { router, useFocusEffect } from "expo-router";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import AuthProvider from "@/components/authProvider";
import { useTranslation } from "react-i18next";

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

const Schedule = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const { id } = useAuthStore((state: any) => ({
    id: state.id,
  }));

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState<any>({
    loader: false,
    id: null,
  });
  const [haveNext, setHaveNext] = useState(false);
  const [limit, setLimit] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await getPaginatedFreelancerAvailability(id, 0, 5);
    if (error) {
      setLoading(false);
      alert(data);
    } else {
      setHaveNext(data?.hasNextPage);
      setLimit(5);
      setData(data?.nodes);
      setLoading(false);
    }
  };

  const reFetchData = async () => {
    const { data, error } = await getPaginatedFreelancerAvailability(
      id,
      0,
      limit + 5
    );
    if (error) {
      setLoading(false);
      alert(data);
    } else {
      setHaveNext(data?.hasNextPage);
      setLimit((prevState) => prevState + 5);
      setData(data?.nodes);
      setLoading(false);
    }
  };

  const handleDeleteFreelancerAvailability = async (availabilityId: number) => {
    setLoadingBtn({
      loader: true,
      id: availabilityId,
    });
    const { data, error } = await deleteFreelancerAvailability(
      id,
      availabilityId
    );
    if (error) {
      setLoadingBtn({
        loader: false,
        id: availabilityId,
      });
      return alert(data);
    } else {
      fetchData();
      setLoadingBtn({
        loader: false,
        id: availabilityId,
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  return (
    <AuthProvider>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "white",
        }}
      >
        <View
          style={{
            flex: 1,
          }}
        >
          <Text
            style={{
              fontSize: RFValue(18),
              color: "black",
              fontWeight: "600",
              paddingHorizontal: RFValue(25),
              paddingVertical: RFValue(20),
              textAlign: isArabic ? "right" : "left",
            }}
          >
            {t("Mes Horaires")}
          </Text>
          {loading && <Loading size="small" title="" />}
          {!loading && (
            <View
              style={{
                paddingHorizontal: RFValue(25),
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  router.push("/freelancer/create-schedule");
                }}
                style={{
                  padding: RFValue(15),
                  borderWidth: 1,
                  borderStyle: "dashed",
                  borderColor: primary,
                  borderRadius: 4,
                  justifyContent: "center",
                  alignItems: "center",
                  marginVertical: RFValue(20),
                }}
              >
                <View
                  style={{
                    flexDirection: isArabic ? "row-reverse" : "row",
                    gap: RFValue(4),
                    alignItems: "center",
                  }}
                >
                  <MaterialIcons name="add" color={primary} size={24} />
                  <Text
                    style={{
                      color: primary,
                      fontWeight: "600",
                      fontSize: RFValue(12),
                    }}
                  >
                    {t("Créer nouveau horaire")}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          {!loading && data?.length > 0 && (
            <FlatList
              data={data}
              showsVerticalScrollIndicator={false}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }: { item: any }) => (
                <View
                  style={{
                    borderWidth: 0.4,
                    borderColor: "#0000002B",
                    paddingVertical: RFValue(10),
                    borderRadius: 8,
                    marginBottom: RFValue(20),
                    marginHorizontal: RFValue(25),
                  }}
                >
                  <View
                    style={{
                      position: "absolute",
                      width: 10,
                      left: isArabic ? "auto" : 0,
                      right: !isArabic ? "auto" : 0,
                      top: 0,
                      bottom: 0,
                      backgroundColor: "#E5C255",
                      flex: 1,
                      borderTopRightRadius: isArabic ? 8 : 0,
                      borderBottomRightRadius: isArabic ? 8 : 0,
                      borderTopLeftRadius: !isArabic ? 8 : 0,
                      borderBottomLeftRadius: !isArabic ? 8 : 0,
                    }}
                  ></View>
                  <View
                    style={{
                      flexDirection: isArabic ? "row-reverse" : "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingHorizontal: RFValue(30),
                      paddingVertical: RFValue(15),
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "column",
                        gap: RFValue(8),
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          gap: RFValue(4),
                          alignItems: "center",
                        }}
                      >
                        <Feather name="clock" color="#A1A1A1" size={18} />
                        <Text
                          style={{
                            color: "#A1A1A1",
                            fontSize: RFValue(12),
                            fontWeight: "500",
                            textAlign: isArabic ? "right" : "left",
                          }}
                        >
                          {item?.type === "FULLDAY"
                            ? t("journée complète")
                            : item?.type === "MORNING"
                            ? t("demi_matin")
                            : item?.type === "EVENING"
                            ? t("demi_soir")
                            : t("Not specified")}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: isArabic ? "row-reverse" : "row",
                          gap: RFValue(4),
                          alignItems: "center",
                        }}
                      >
                        <Feather name="calendar" size={18} />
                        <Text
                          style={{
                            fontSize: RFValue(12),
                            color: "#544B4B",
                          }}
                        >
                          {dayjs(item?.date).format("YYYY-MM-DD")}
                        </Text>
                      </View>
                    </View>

                    <Pressable
                      onPress={() =>
                        handleDeleteFreelancerAvailability(item?.id)
                      }
                      style={{
                        backgroundColor: primary,
                        height: RFValue(30),
                        borderRadius: RFValue(4),
                        width: RFValue(60),
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: RFValue(8),
                          color: "white",
                          fontWeight: "600",
                        }}
                      >
                        {loadingBtn?.loader && item?.id === loadingBtn?.id ? (
                          <ActivityIndicator
                            size={16}
                            animating={true}
                            color={"white"}
                          />
                        ) : (
                          t("Supprimer")
                        )}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              )}
              onEndReachedThreshold={0}
              onEndReached={() => {
                if (haveNext) {
                  reFetchData();
                }
              }}
              ListFooterComponent={
                data?.length > 0 && haveNext ? renderFooter : null
              }
              ListEmptyComponent={
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
              }
            />
          )}
        </View>
      </SafeAreaView>
    </AuthProvider>
  );
};

export default Schedule;
