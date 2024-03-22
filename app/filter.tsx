import { black, primary } from "@/constants/Colors";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import RadioGroup, { RadioButtonProps } from "react-native-radio-buttons-group";
import { useState, useMemo, useEffect } from "react";
import { Calendar } from "react-native-calendars";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { useFreelancersFilterStore } from "@/store/useFreelancersFilter";
import { useTranslation } from "react-i18next";
import "date-fns/locale/ar";

const Filter = () => {
  const customTheme = {
    backgroundColor: "#ffffff",
    calendarBackground: "#ffffff",
    selectedDayBackgroundColor: primary,
    selectedDayTextColor: "white",
    dotColor: primary,
    selectedDotColor: "white",
    arrowColor: "black",
    monthTextColor: "black",
    textSectionTitleColor: "black",
    todayBackgroundColor: black,
    todayTextColor: "white",
  };

  const {
    freelancer_type,
    type,
    date,
    addFreelancerType,
    addDate,
    addType,
    clear,
  } = useFreelancersFilterStore((state: any) => ({
    freelancer_type: state.freelancer_type,
    type: state.type,
    date: state.date,
    addFreelancerType: state.addFreelancerType,
    addDate: state.addDate,
    addType: state.addType,
    clear: state.clear,
  }));

  const { t, i18n } = useTranslation();

  const [service, setService] = useState<string | undefined>(
    Boolean(!freelancer_type) ? "not_service" : freelancer_type
  );
  const [jobType, setJobType] = useState<string | undefined>(
    Boolean(!type) ? "not_type" : type
  );

  const [selected, setSelected] = useState<any>(Boolean(!date) ? null : date);

  const initialDate = new Date().toJSON()?.split("T")[0];

  const services: RadioButtonProps[] = useMemo(
    () => [
      {
        id: "ELDERLY_SITTER",
        label: t("Garde malade"),
        value: "ELDERLY_SITTER",
        labelStyle: {
          color: "#808080",
          fontSize: RFValue(12),
        },
      },
      {
        id: "MAID",
        label: t("Femme de menage"),
        value: "MAID",
        labelStyle: {
          color: "#808080",
          fontSize: RFValue(12),
        },
      },
      {
        id: "not_service",
        label: t("Not specified"),
        value: "not_service",
        labelStyle: {
          color: "#808080",
          fontSize: RFValue(12),
        },
      },
    ],
    []
  );

  const jobTypes: RadioButtonProps[] = useMemo(
    () => [
      {
        id: "FULLDAY",
        label: t("journée complète"),
        value: "FULLDAY",
        labelStyle: {
          color: "#808080",
          fontSize: RFValue(12),
        },
      },
      {
        id: "MORNING",
        label: t("demi_matin"),
        value: "MORNING",
        labelStyle: {
          color: "#808080",
          fontSize: RFValue(12),
        },
      },
      {
        id: "EVENING",
        label: t("demi_soir"),
        value: "EVENING",
        labelStyle: {
          color: "#808080",
          fontSize: RFValue(12),
        },
      },
      {
        id: "not_type",
        label: t("Not specified"),
        value: "not_type",
        labelStyle: {
          color: "#808080",
          fontSize: RFValue(12),
        },
      },
    ],
    []
  );

  const navigation = useRouter();

  useEffect(() => {
    addFreelancerType(service?.includes("not") ? null : service);
  }, [service]);

  useEffect(() => {
    addType(jobType?.includes("not") ? null : jobType);
  }, [jobType]);

  useEffect(() => {
    addDate(selected ? null : selected);
  }, [selected]);
  console.log({ service });
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
      stickyHeaderIndices={[0]}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          backgroundColor: "white",
          shadowColor: black,
          shadowOffset: {
            width: 0,
            height: 1,
          },

          shadowOpacity: 0.05,
          elevation: 1,
          flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <View
          style={{
            flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
            flex: 1,
            justifyContent: "space-between",
            alignItems: "center",
            paddingLeft: RFValue(25),
          }}
        >
          <Text
            style={{
              paddingBottom: RFValue(10),
              fontSize: RFValue(26),
              color: black,
              fontWeight: "600",
            }}
          >
            {t("filter")}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setSelected(null);
              setJobType("not_type");
              setService("not_service");
            }}
            style={{
              paddingHorizontal: RFValue(25),
              paddingBottom: RFValue(10),
            }}
          >
            <Text
              style={{
                fontSize: RFValue(14),
                color: "#A1A1A1",
                fontWeight: "500",
              }}
            >
              {t("Réinitialiser")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          paddingBottom: RFValue(40),
          paddingHorizontal: RFValue(i18n.language === "ar" ? 0 : 25),
          gap: RFValue(20),
          width: "100%",
          flexDirection: "column",
          paddingTop: RFValue(12),
        }}
      >
        <View
          style={{
            flexDirection: "column",
            gap: RFValue(30),
            justifyContent: i18n.language === "ar" ? "flex-end" : "flex-start",
            alignItems: i18n.language === "ar" ? "flex-end" : "flex-start",
          }}
        >
          <Text
            style={{
              color: "#555555",
              fontSize: RFValue(16),
              fontWeight: "600",
            }}
          >
            {t("Services")}
          </Text>
          <RadioGroup
            radioButtons={services}
            onPress={(e: any) => {
              setService(e);
            }}
            selectedId={service}
            containerStyle={{
              gap: RFValue(16),
              alignItems: i18n.language === "ar" ? "flex-end" : "flex-start",
            }}
          />
        </View>
        <View
          style={{
            flexDirection: "column",
            gap: RFValue(30),
            justifyContent: i18n.language === "ar" ? "flex-end" : "flex-start",
            alignItems: i18n.language === "ar" ? "flex-end" : "flex-start",
          }}
        >
          <Text
            style={{
              color: "#555555",
              fontSize: RFValue(16),
              fontWeight: "600",
            }}
          >
            {t("Type de travaille")}
          </Text>
          <RadioGroup
            radioButtons={jobTypes}
            onPress={setJobType}
            selectedId={jobType}
            containerStyle={{
              gap: RFValue(16),
              alignItems: i18n.language === "ar" ? "flex-end" : "flex-start",
            }}
          />
        </View>
        <View
          style={{
            flexDirection: "column",
            gap: RFValue(30),
            width: "100%",
            paddingHorizontal: RFValue(25),
          }}
        >
          <Text
            style={{
              color: "#555555",
              fontSize: RFValue(16),
              fontWeight: "600",
              textAlign: i18n.language === "ar" ? "right" : "left",
            }}
          >
            {t("Par jours")}
          </Text>
          <Calendar
            locale="ar"
            theme={customTheme}
            initialDate={initialDate}
            onDayPress={(day) => {
              setSelected(day.dateString);
            }}
            markedDates={{
              [selected]: {
                selected: true,
                disableTouchEvent: true,
              },
            }}
          />
        </View>
      </View>
      <View
        style={{
          paddingHorizontal: RFValue(25),
          paddingBottom: RFValue(40),
        }}
      >
        <Button
          style={{
            borderRadius: 4,
            height: 45,
            justifyContent: "center",
            width: "100%",
          }}
          mode="contained"
          buttonColor={primary}
          onPress={() => {
            navigation.back();
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: "white",
              fontWeight: "600",
            }}
          >
            {t("Appliquer")}
          </Text>
        </Button>
      </View>
    </ScrollView>
  );
};

export default Filter;
