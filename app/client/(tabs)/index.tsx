import CarouselComponent from "@/components/carousel";
import Menu from "@/components/menu";
import SearchInput from "@/components/searchInput";
import ServiceCard from "@/components/serviceCard";
import { View, ScrollView, Text, Animated } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { black, primary } from "@/constants/Colors";
import BestNoted from "@/components/bestNoted";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSearchStore } from "@/store/useSearchStore";
import { useFocusEffect } from "expo-router";
import {
  getFreelancers,
  getTopRatingFreelancers,
} from "@/graphql/services/freelancer.service";
import { useAuthStore } from "@/store/useAuthStore";
import { useFreelancersFilterStore } from "@/store/useFreelancersFilter";
import AuthProvider from "@/components/authProvider";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";

const FilterBox: React.FC<{ title: string }> = ({ title }) => {
  return (
    <View
      style={{
        backgroundColor: "#EEEEEE",
        padding: RFValue(4),
        borderRadius: 4,
        gap: 2,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: black,
          fontWeight: "500",
          fontSize: RFValue(8),
        }}
      >
        {title}
      </Text>
      <Feather name="x" color={black} size={10} />
    </View>
  );
};

const ClientHome = () => {
  const { t, i18n } = useTranslation();
  const [topRating, setTopRating] = useState([]);
  const [freelancers, setFreelancers] = useState<any>([]);
  const [freelancersHasNext, setFreelancersHasNext] = useState(false);
  const [loadingTopRating, setLoadingTopRating] = useState(false);
  const [loadingFreelancers, setLoadingFreelancers] = useState(false);
  const [loadingFreelancersBtn, setLoadingFreelancersBtn] = useState(false);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState([]);
  const [limit, setLimit] = useState(0);

  const searchEnabled = false;

  const { access } = useAuthStore((state: any) => ({
    access: state.access,
  }));

  const opacity = useRef(new Animated.Value(0)).current;
  const opacitySearch = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: searchEnabled ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    Animated.timing(opacitySearch, {
      toValue: searchEnabled ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [searchEnabled]);

  const fetchTopRating = async () => {
    setLoadingTopRating(true);
    const { data, error } = await getTopRatingFreelancers(access);
    console.log("data top rating", data);

    if (error) {
      setLoadingTopRating(false);
      return alert("error fetching top rating");
    }
    setTimeout(() => {
      setTopRating(data);
      setLoadingTopRating(false);
    }, 3000);
  };

  useEffect(() => {
    fetchTopRating();
  }, []);

  return (
    <AuthProvider>
      <Menu>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
            paddingTop: RFValue(20),
            paddingHorizontal: 25,
            backgroundColor: "white",
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "column",
            }}
          >
            {searchEnabled && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                {filters.map((filter, index) => (
                  <React.Fragment key={index}>
                    <FilterBox title={filter} />
                  </React.Fragment>
                ))}
              </View>
            )}
            {!searchEnabled && (
              <Animated.View
                style={{
                  flexDirection: "column",
                  opacity: opacity,
                }}
              >
                <CarouselComponent />
                <View
                  style={{
                    paddingVertical: RFValue(26),
                  }}
                >
                  <View
                    style={{
                      flexDirection: "column",
                      gap: RFValue(18),
                    }}
                  >
                    <Text
                      style={{
                        fontSize: RFValue(22),
                        fontWeight: "600",
                        textAlign: i18n.language === "ar" ? "right" : "left",
                      }}
                    >
                      {t("Nos services")}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: RFValue(10),
                      }}
                    >
                      <ServiceCard
                        title={t("Notoyage")}
                        icon={
                          <MaterialCommunityIcons
                            size={20}
                            color={primary}
                            name="broom"
                          />
                        }
                      />
                      <ServiceCard
                        title={t("Blanchisement")}
                        icon={
                          <MaterialCommunityIcons
                            size={20}
                            color={primary}
                            name="washing-machine"
                          />
                        }
                      />
                      <ServiceCard
                        title={t("Garde d'enfants")}
                        icon={
                          <MaterialCommunityIcons
                            size={20}
                            color={primary}
                            name="baby-face"
                          />
                        }
                      />
                    </View>
                  </View>
                </View>
                <BestNoted
                  noSave={true}
                  data={topRating}
                  loading={loadingTopRating}
                />
              </Animated.View>
            )}
            {searchEnabled && (
              <Animated.View
                style={{
                  flexDirection: "column",
                  opacity: opacitySearch,
                  gap: RFValue(20),
                }}
              >
                <BestNoted
                  data={freelancers}
                  loading={loadingFreelancers}
                  titleShown={false}
                  freelancersHasNext={freelancersHasNext}
                  loadingBtn={loadingFreelancersBtn}
                  noSave={false}
                />
              </Animated.View>
            )}
          </View>
        </ScrollView>
      </Menu>
    </AuthProvider>
  );
};

export default ClientHome;
