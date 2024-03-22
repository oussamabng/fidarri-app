import React, { useEffect, useState } from "react";

import Menu from "@/components/menu";
import { View, ScrollView, Text, Dimensions, Alert } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useTranslation } from "react-i18next";

import { LineChart } from "react-native-chart-kit";
import DropdownComponent from "@/components/dropdown";
import { primary } from "@/constants/Colors";
import {
  getMissionGraph,
  getMissionsStats,
} from "@/graphql/services/freelancer.service";
import { useAuthStore } from "@/store/useAuthStore";
import Loading from "@/components/loading";
import AuthProvider from "@/components/authProvider";

const FreelancerHome = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const { access } = useAuthStore((state: any) => ({
    access: state.access,
  }));

  const [timeRange, setTimeRange] = useState(
    i18n.language === "fr"
      ? "Dernières 24 heures"
      : i18n.language === "en"
      ? "Last 24 hours"
      : "الشهر الماضي"
  );
  const [loading, setLoading] = useState(true);
  const [loadingChart, setLoadingChart] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [data, setData] = useState<any>(null);

  const TIME_RANGES: any = {
    "Dernières 24 heures": "LAST_24_HOURS",
    "الـ 24 ساعة الأخيرة": "LAST_24_HOURS",
    "Last 24 hours": "LAST_24_HOURS",

    "Dernières 48 heures": "LAST_48_HOURS",
    "الـ 48 ساعة الأخيرة": "LAST_48_HOURS",
    "Last 48 hours": "LAST_48_HOURS",

    "La semaine dernière": "LAST_WEEK",
    "الأسبوع الماضي": "LAST_WEEK",
    "Last week": "LAST_WEEK",

    "Deux dernières semaines": "LAST_TWO_WEEKS",
    "الأسبوعين الأخيرين": "LAST_TWO_WEEKS",
    "Last two weeks": "LAST_TWO_WEEKS",

    "Le mois dernier": "LAST_MONTH",
    "الشهر الماضي": "LAST_MONTH",
    "Last month": "LAST_MONTH",
  };

  useEffect(() => {
    setTimeout(() => {
      setTimeRange(
        i18n.language === "fr"
          ? "Dernières 24 heures"
          : i18n.language === "en"
          ? "Last 24 hours"
          : "الشهر الماضي"
      );
    }, 300);
  }, [i18n.language]);

  const fetchStats = async () => {
    setLoading(true);
    const range = TIME_RANGES[timeRange] || "LAST_MONTH";

    const { data, error } = await getMissionsStats(access, range);

    if (error) {
      setLoading(false);
      alert(data);
      /* Alert.alert("Sorry something went wrong. Please try again",data,[{
        text:"Try Again",
        
      }] ) */
      alert(data);
    } else {
      setStats(data);
      setLoading(false);
    }
  };

  function getStartAndEndOfWeek() {
    const today = new Date();
    const currentDay = today.getDay(); // 0 (Sunday) to 6 (Saturday)
    const startDate = new Date(today);
    const endDate = new Date(today);

    // Calculate the start of the week (Sunday)
    startDate.setDate(today.getDate() - currentDay);

    // Calculate the end of the week (Saturday)
    endDate.setDate(today.getDate() + (6 - currentDay));

    return { startOfWeek: startDate, endOfWeek: endDate };
  }

  const fetchGraph = async () => {
    setLoadingChart(true);
    const { startOfWeek, endOfWeek } = getStartAndEndOfWeek();

    const { data, error } = await getMissionGraph(
      access,
      "WEEK",
      startOfWeek.toISOString(),
      endOfWeek.toISOString()
    );

    setData(data);

    setLoadingChart(false);
  };

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  useEffect(() => {
    fetchStats();
    fetchGraph();
  }, []);
  return (
    <AuthProvider>
      <Menu>
        <ScrollView
          bounces={false}
          style={{
            flex: 1,
            paddingTop: RFValue(20),
          }}
        >
          <View
            style={{
              flexDirection: "column",
              gap: RFValue(8),
              paddingHorizontal: RFValue(25),
            }}
          >
            <Text
              style={{
                color: "#2D2D2D",
                fontWeight: "600",
                fontSize: RFValue(16),
                textTransform: "uppercase",
                textAlign: isArabic ? "right" : "left",
              }}
            >
              {t("missions")}
            </Text>
          </View>

          <View
            style={{
              paddingVertical: RFValue(20),
            }}
          >
            {loadingChart && <Loading size="small" />}
            {data && !loadingChart && (
              <LineChart
                withShadow
                withHorizontalLines={false}
                withHorizontalLabels={false}
                data={{
                  labels:
                    i18n.language === "fr"
                      ? ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]
                      : i18n.language === "en"
                      ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
                      : [
                          "أحد",
                          "اثنين",
                          "ثلاثاء",
                          "أربعاء",
                          "خميس",
                          "جمعة",
                          "سبت",
                        ],
                  datasets: [
                    {
                      data: data?.completedMissionsCount?.slice(0, 7) || [
                        0, 0, 0, 0, 0, 0, 0,
                      ],
                      color: (opacity = 1) => `rgba(229, 194, 85, ${opacity})`,
                    },
                    {
                      data: data?.cancelledOffersCount?.slice(0, 7) || [
                        0, 0, 0, 0, 0, 0, 0,
                      ],
                      color: (opacity = 1) => `rgba(146, 63, 179, ${opacity})`,
                    },
                  ],
                  legend: [t("Terminé"), t("Annulée")],
                }}
                width={Dimensions.get("window").width}
                height={220}
                chartConfig={{
                  backgroundColor: "#fff",
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",
                  decimalPlaces: 2,
                  color: (opacity = 1) => `rgba(146, 63, 179, ${opacity})`,
                  labelColor: (opacity = 1) =>
                    `rgba(161, 161, 161, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: "6",
                    strokeWidth: "4",
                    stroke: "#FFF",
                  },
                }}
                bezier
              />
            )}
          </View>
          <View
            style={{
              paddingVertical: RFValue(25),
              paddingHorizontal: RFValue(25),
            }}
          >
            <Text
              style={{
                color: "#000000",
                fontWeight: "500",
                fontSize: RFValue(18),
                textAlign: isArabic ? "right" : "left",
              }}
            >
              {t("Dépenses Totales")}
            </Text>
            <DropdownComponent
              arabic={isArabic}
              label=""
              data={
                i18n.language === "fr"
                  ? [
                      "Dernières 24 heures",
                      "Dernières 48 heures",
                      "La semaine dernière",
                      "Deux dernières semaines",
                      "Le mois dernier",
                    ]
                  : i18n.language === "en"
                  ? [
                      "Last 24 hours",
                      "Last 48 hours",
                      "Last week",
                      "Last two weeks",
                      "Last month",
                    ]
                  : [
                      "الـ 24 ساعة الأخيرة",
                      "الـ 48 ساعة الأخيرة",
                      "الأسبوع الماضي",
                      "الأسبوعين الأخيرين",
                      "الشهر الماضي",
                    ]
              }
              value={timeRange}
              onSelect={setTimeRange}
            />
          </View>

          {loading ? (
            <Loading size="small" />
          ) : (
            <View
              style={{
                flexDirection: "column",
                paddingHorizontal: RFValue(25),
                paddingBottom: RFValue(80),
                gap: RFValue(20),
              }}
            >
              <View
                style={{
                  padding: RFValue(15),
                  borderRadius: RFValue(8),
                  shadowColor: "#C5C3C326",
                  borderColor: "#C5C3C350",
                  borderWidth: 1,
                  shadowOpacity: 0.8,
                  elevation: 6,
                  shadowRadius: 15,
                  shadowOffset: { width: 1, height: 13 },
                }}
              >
                <View
                  style={{
                    flexDirection: "column",
                    gap: RFValue(15),
                    paddingTop: RFValue(15),
                    paddingBottom: RFValue(30),
                  }}
                >
                  <View
                    style={{
                      flexDirection: !isArabic ? "row" : "row-reverse",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "500",
                        fontSize: RFValue(12),
                        color: primary,
                        textAlign: isArabic ? "right" : "left",
                      }}
                    >
                      {t("Total")}
                    </Text>
                    <Text
                      style={{
                        fontWeight: "600",
                        fontSize: RFValue(14),
                        color: "#000000",
                        textAlign: isArabic ? "right" : "left",
                      }}
                    >
                      {stats?.totalAmount} {t("DZD")}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: !isArabic ? "row" : "row-reverse",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "500",
                        fontSize: RFValue(12),
                        color: primary,
                        textAlign: isArabic ? "right" : "left",
                      }}
                    >
                      {t("Nombre mission:")}
                    </Text>
                    <Text
                      style={{
                        fontWeight: "600",
                        fontSize: RFValue(14),
                        color: "#000000",
                        textAlign: isArabic ? "right" : "left",
                      }}
                    >
                      {stats?.numberOfMissions}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: !isArabic ? "row" : "row-reverse",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "500",
                        fontSize: RFValue(12),
                        color: primary,
                        textAlign: isArabic ? "right" : "left",
                      }}
                    >
                      {t("Code promo appliqué:")}
                    </Text>
                    <Text
                      style={{
                        fontWeight: "600",
                        fontSize: RFValue(14),
                        color: "#000000",
                        textAlign: isArabic ? "right" : "left",
                      }}
                    >
                      {stats?.numberOfCodes}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </Menu>
    </AuthProvider>
  );
};

export default FreelancerHome;
