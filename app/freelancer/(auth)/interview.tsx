import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Pressable,
  Alert,
} from "react-native";
import { Button, Divider } from "react-native-paper";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Image } from "react-native";
import { primary } from "@/constants/Colors";
import { router, useRouter } from "expo-router";
import DropdownComponent from "@/components/dropdown";
import { useEffect, useState } from "react";
import { getOfficesAvailable } from "@/graphql/services/profile.service";
import { createMeet } from "@/graphql/services/auth.service";
import { useAuthStore } from "@/store/useAuthStore";

const Interview = () => {
  const navigation = useRouter();

  const { id } = useAuthStore((state: any) => ({
    id: state.id,
  }));

  const [offices, setOffices] = useState([]);
  const [office, setOffice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOffices = async () => {
    const { data, error } = await getOfficesAvailable(new Date().toString());

    if (error) {
      return alert("Error in fetching offices");
    }

    const formattedStrings = data.map((item: any) => {
      const date = new Date(item.date);
      const formattedDate = `${date.getDate()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getFullYear()}`;
      const formattedTime = `${date.getHours()}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
      const officeName = item.office?.name || "";

      return ` ${formattedDate} | ${formattedTime} | ${officeName} `;
    });

    setOffices(formattedStrings);
    setOffice(formattedStrings[0]);
  };

  function convertToISODate(inputString: string | null) {
    // Split the input string into date, time, and office name parts
    const parts = inputString.split("|").map((part) => part.trim());

    if (parts.length === 3) {
      const [datePart, timePart, officePart] = parts;

      // Extract the day, month, and year from the date part
      const [day, month, year] = datePart
        .split("-")
        .map((part) => parseInt(part.trim(), 10));

      // Extract the hour and minute from the time part
      const [hour, minute] = timePart
        .split(":")
        .map((part) => parseInt(part.trim(), 10));

      // Construct the ISO date string
      const isoDate = new Date(
        Date.UTC(year, month - 1, day, hour, minute)
      ).toISOString();

      return isoDate;
    } else {
      // Handle invalid input
      return null;
    }
  }

  const handleCreateMeet = async () => {
    setLoading(true);
    const { data, error } = await createMeet(
      convertToISODate(office) ?? "",
      parseInt(id)
    );

    if (error) {
      setLoading(false);
      Alert.alert("Erreur", "Erreur lors de la création du rendez-vous");
    } else {
      setLoading(false);
      navigation.replace("/freelancer/(auth)/waitingOnBoarding");
    }
  };

  useEffect(() => {
    fetchOffices();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOffices();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView
        style={{
          paddingTop: 25,
          paddingBottom: 40,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View
          style={{
            flexDirection: "column",
            paddingHorizontal: 25,
          }}
        >
          <Divider
            style={{
              backgroundColor: "#BCBCBC",
            }}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: 35,
              paddingBottom: 56,
            }}
          >
            <Text
              style={{
                textTransform: "uppercase",
                color: "#505050",
                fontSize: 18,
                fontWeight: "bold",
                letterSpacing: 1,
              }}
            >
              rendez-vous de suivi
            </Text>
            <Pressable
              onPress={() => {
                router.push("/freelancer/help");
              }}
            >
              <FontAwesome name="question-circle-o" size={20} color="#707070" />
            </Pressable>
          </View>
          <View
            style={{
              flexDirection: "column",
              gap: 24,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={require("@/assets/images/meet.png")}
              alt="meet"
              style={{
                width: 70,
                height: 70,
                objectFit: "contain",
              }}
            />
            <View
              style={{
                gap: 9,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 22,
                  letterSpacing: 2,
                  color: "#000",
                }}
              >
                Salut, John doe
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  letterSpacing: 2,
                  color: "#000",
                  maxWidth: 255,
                  textAlign: "center",
                }}
              >
                Bienvenue sur FiDarri, vous avez presque terminé.
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "column",
              gap: 12,
              paddingTop: 80,
              paddingBottom: 40,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: 11,
                alignItems: "center",
              }}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={24}
                color="black"
              />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  letterSpacing: 1,
                  color: "#000",
                }}
              >
                Vérification de l'E-mail
              </Text>
            </View>
            <View
              style={{
                flexDirection: "column",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "#707070",
                  fontWeight: "400",
                  letterSpacing: 1,
                }}
              >
                Remarque : vous devez vérifier votre compte par
                <Text
                  style={{
                    color: "#707070",
                    fontWeight: "600",
                    letterSpacing: 1,
                  }}
                >
                  {" "}
                  votre adresse e-mail
                </Text>{" "}
                pour pouvoir passer un entretien.
              </Text>
            </View>
          </View>
          <Divider
            style={{
              backgroundColor: "#BCBCBC",
            }}
          />
          <View
            style={{
              flexDirection: "column",
              gap: 11,
              paddingTop: 40,
              paddingBottom: 40,
            }}
          >
            <Text
              style={{
                fontWeight: "600",
                fontSize: 16,
                letterSpacing: 1,
                color: "#000",
              }}
            >
              Entretien pour accepter votre demande de travail.
            </Text>
          </View>
          {/*  <CustomCalendar /> */}

          <DropdownComponent
            label="Choisissez la date"
            data={offices}
            value={office}
            onSelect={setOffice}
          />
          <View
            style={{
              paddingTop: 20,
              paddingBottom: 60,
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
              onPress={handleCreateMeet}
              loading={loading}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "white",
                  fontWeight: "600",
                }}
              >
                Continuer
              </Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Interview;
