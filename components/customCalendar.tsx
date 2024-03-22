import { primary } from "@/constants/Colors";
import React, { useState, useEffect } from "react";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { Text, View } from "react-native";

interface MarkedDates {
  [date: string]: {
    selected: boolean | null;
    marked: boolean;
    dot: string;
    selectedColor: string;
    selectedTextColor: string;
  };
}

const renderHeader = (date: Date) => {
  const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const formattedDate = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

  return (
    <View
      style={{
        flex: 1,
        paddingBottom: 8,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
        }}
      >
        {formattedDate}
      </Text>
    </View>
  );
};

function CustomCalendar(props: any) {
  LocaleConfig.locales.en = LocaleConfig.locales[""];
  LocaleConfig.locales.fr = {
    monthNames: [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ],
    monthNamesShort: [
      "Janv",
      "Févr",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juil",
      "Août",
      "Sept",
      "Oct",
      "Nov",
      "Déc",
    ],
    dayNames: [
      "Dimanche",
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
    ],
    dayNamesShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
  };

  LocaleConfig.defaultLocale = "fr";
  const initDate = "2022-12-01";
  const [selected, setSelected] = useState(initDate);
  const [marked, setMarked] = useState<MarkedDates>({});
  const backendMarkedDates = [
    "2022-12-10",
    "2022-12-15",
    "2022-12-03",
    "2022-12-09",
  ];

  useEffect(() => {
    const newMarked: { [date: string]: any } = {};
    backendMarkedDates.forEach((date) => {
      newMarked[date] = {
        marked: true,
        selected: false,
        dot: primary,
        selectedColor: primary,
        selectedTextColor: "white",
      };
    });
    setMarked(newMarked);
  }, []);

  const handleDayPress = (day: { dateString: string }) => {
    if (marked[day.dateString]?.marked) {
      const updatedMarked: MarkedDates = { ...marked };

      // Clear the selection from the previously selected day
      for (const date in updatedMarked) {
        updatedMarked[date].selected = false;
      }

      // Set the new selected day
      updatedMarked[day.dateString].selected = true;
      setMarked(updatedMarked);

      setSelected(day.dateString);
      props.onDaySelect && props.onDaySelect(day);
    }
  };

  const customTheme = {
    backgroundColor: "#ffffff", // Background color of the calendar
    calendarBackground: "#ffffff", // Background color of the calendar area
    selectedDayBackgroundColor: primary, // Primary color for selected days
    selectedDayTextColor: "white", // Text color for selected days
    dotColor: primary, // Dot color for marked days
    selectedDotColor: "white", // Dot color for selected marked days
    arrowColor: "transparent", // Hide arrows
    monthTextColor: "black", // Text color for the month text
    textSectionTitleColor: "black", // Color of month and year text in header
  };

  return (
    <Calendar
      theme={customTheme}
      initialDate={initDate}
      renderHeader={renderHeader}
      hideArrows={true}
      markedDates={{
        ...marked,
      }}
      onDayPress={handleDayPress}
      {...props}
    />
  );
}

export default CustomCalendar;
