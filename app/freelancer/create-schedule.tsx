import { View, Text, Alert } from "react-native";
import React, { useState } from "react";
import { RFValue } from "react-native-responsive-fontsize";
import { Calendar } from "react-native-calendars";

import DropdownComponent from "@/components/dropdown";
import { primary } from "@/constants/Colors";
import { Button } from "react-native-paper";
import { createFreelancerAvailability } from "@/graphql/services/freelancer.service";
import { useAuthStore } from "@/store/useAuthStore";
import { router } from "expo-router";
import AuthProvider from "@/components/authProvider";
import { useTranslation } from "react-i18next";
const CreateSchedule = () => {
  const [type, setType] = useState("Journée complète");
  const [loading, setLoading] = useState(false);
  const today = new Date();

  // Calculate tomorrow's date
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // Format tomorrow's date in the 'YYYY-MM-DD' format
  const tomorrowString = `${tomorrow.getFullYear()}-${String(
    tomorrow.getMonth() + 1
  ).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;

  const [selected, setSelected] = useState<any>(tomorrowString);

  const { id } = useAuthStore((state: any) => ({
    id: state.id,
  }));

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
  };

  const { t } = useTranslation();

  const handleCreateAvailability = async () => {
    setLoading(true);

    const date = selected ? new Date(selected).toISOString() : null;
    const selectedType =
      type === "Journée complète"
        ? "FULLDAY"
        : type === "1/2 (matin)"
        ? "MORNING"
        : "EVENING";
    if (!date) {
      setLoading(false);
      return alert("Choisissez une date valide !");
    }
    const { data, error } = await createFreelancerAvailability(
      id,
      date,
      selectedType
    );
    if (error) {
      if (data === "400010: This date is not available") {
        setLoading(false);
        return Alert.alert("Erreur", t("Cette date n'est pas disponible"));
      } else {
        setLoading(false);
        return alert(data);
      }
    } else {
      setLoading(false);
      router.back();
    }
  };

  return (
    <AuthProvider>
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <View
          style={{
            flexDirection: "column",
            gap: RFValue(15),
            padding: RFValue(20),
          }}
        >
          <Text
            style={{
              fontSize: RFValue(18),
              color: "black",
              fontWeight: "600",
              paddingVertical: RFValue(20),
            }}
          >
            Creation d'horaire
          </Text>
          <Text
            style={{
              color: "#4F4F50",
              fontSize: RFValue(14),
              marginBottom: RFValue(15),
            }}
          >
            choisissez une date pour ajouter a la liste de votre temps de
            Disponibilité !
          </Text>

          <Calendar
            theme={customTheme}
            initialDate={tomorrowString}
            minDate={tomorrowString}
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

          <DropdownComponent
            label="sélectionner l'heure  de disponibilité "
            data={["Journée complète", "1/2 (matin)", "1/2 (soir)"]}
            value={type}
            onSelect={setType}
          />

          <Button
            style={{
              borderRadius: 4,
              height: 45,
              justifyContent: "center",
              marginTop: RFValue(30),
            }}
            mode="contained"
            buttonColor={primary}
            loading={loading}
            onPress={handleCreateAvailability}
          >
            <Text
              style={{
                fontSize: RFValue(14),
                color: "white",
                fontWeight: "600",
              }}
            >
              Ajouter
            </Text>
          </Button>
        </View>
      </View>
    </AuthProvider>
  );
};

export default CreateSchedule;
