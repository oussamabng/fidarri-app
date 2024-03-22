import { useEffect, useState } from "react";

import { black, primary, text2 } from "@/constants/Colors";
import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  Platform,
  Pressable,
  Alert,
} from "react-native";
import { Appbar, Button, Snackbar } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { RFValue } from "react-native-responsive-fontsize";
import { isOver18YearsOld } from "@/constants/Helpers";
import { useRegisterStore } from "@/store/useRegisterStore";
import AuthProvider from "@/components/authProvider";
import Input from "@/components/input";
const WIDTH = Dimensions.get("screen").width;
import { Appearance } from "react-native";

const DateOfBirth = () => {
  const navigation = useRouter();

  const { addDateOfBirth } = useRegisterStore((state: any) => ({
    addDateOfBirth: state.addDateOfBirth,
  }));

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [visible, setVisible] = useState(false);

  const colorScheme = Appearance.getColorScheme();

  const [isDark, setIsDark] = useState(colorScheme === "dark");

  useEffect(() => {
    setIsDark(colorScheme === "dark");
  }, [colorScheme]);

  const onDismissSnackBar = () => setVisible(false);

  const onToggleSnackBar = () => setVisible(!visible);

  const [date, setDate] = useState(new Date());

  const onChange = (data: any, selectedDate: any) => {
    if (data?.type == "set") {
      setDate(selectedDate);
      setShowDatePicker(false);
    } else {
      setShowDatePicker(false);
    }
  };

  function formatSelectedDate(date: any) {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }

  const handleDateOfBirth = async () => {
    const isOver18: boolean = isOver18YearsOld(date.toString());

    if (isOver18) {
      addDateOfBirth(date.toString());
      navigation.replace("/freelancer/(auth)/jobType");
    } else {
      return Alert.alert(
        "Erreur",
        "Il faut être âgé de plus de 18 ans pour continuer"
      );
    }
  };

  return (
    <AuthProvider checkLogout>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "white",
          paddingTop: Platform.OS === "android" ? RFValue(25) : 0,
        }}
      >
        <Appbar.BackAction
          color="black"
          onPress={() => {
            navigation.replace("/username");
          }}
        />
        <Snackbar
          visible={visible}
          onDismiss={onDismissSnackBar}
          duration={2000}
          wrapperStyle={{
            bottom: RFValue(100),
          }}
          style={{
            backgroundColor: "#D76262",
          }}
        >
          Il faut être âgé de plus de 18 ans
        </Snackbar>
        <View
          style={{
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
            padding: RFValue(25),
          }}
        >
          <View
            style={{
              gap: RFValue(20),
              flex: 1,
            }}
          >
            <View
              style={{
                flexDirection: "column",
                gap: RFValue(6),
                maxWidth: WIDTH - 50,
                paddingBottom: RFValue(20),
              }}
            >
              <Text
                style={{
                  fontSize: RFValue(24),
                  color: black,
                  fontWeight: "600",
                }}
              >
                Date de naissance
              </Text>
              <Text
                style={{
                  fontSize: RFValue(12),
                  color: text2,
                }}
              >
                comme indiqué sur votre pièce d'identité officielle, vous devez
                avoir{" "}
                <Text
                  style={{
                    color: primary,
                  }}
                >
                  18 ans{" "}
                </Text>{" "}
                ou plus pour ouvrir un compte fiddari
              </Text>
            </View>
            {Platform.OS === "ios" ? (
              <DateTimePicker
                themeVariant="light"
                mode="date"
                display="spinner"
                value={date}
                onChange={onChange}
                accentColor={primary}
                style={{
                  height: 180,
                  marginTop: -10,
                }}
              />
            ) : (
              <Pressable
                onPress={(e) => {
                  e.preventDefault();
                  setShowDatePicker(true);
                }}
              >
                <Input
                  disabled
                  label="Date de naissance"
                  value={date ? formatSelectedDate(date) : ""}
                />
              </Pressable>
            )}
            {showDatePicker && (
              <View
                style={{
                  padding: RFValue(50),
                }}
              >
                <DateTimePicker
                  mode="date"
                  display="spinner"
                  value={date}
                  onChange={onChange}
                  accentColor={primary}
                  style={{
                    height: 180,
                    marginTop: -10,
                  }}
                />
              </View>
            )}
          </View>

          <View style={{ flexDirection: "column", gap: RFValue(16) }}>
            <Button
              style={{
                borderRadius: 4,
                height: 45,
                justifyContent: "center",
              }}
              mode="contained"
              buttonColor={primary}
              onPress={handleDateOfBirth}
            >
              <Text
                style={{
                  fontSize: RFValue(14),
                  color: "white",
                  fontWeight: "600",
                }}
              >
                Continuer
              </Text>
            </Button>
            {/*    <Button
            style={{
              borderRadius: 4,
              height: 45,
              justifyContent: "center",
            }}
            mode="text"
            rippleColor="#923FB310"
            onPress={() => console.log("Pressed")}
          >
            <Text
              style={{
                fontSize: 16,
                color: black,
                fontWeight: "600",
              }}
            >
              Passer
            </Text>
          </Button> */}
          </View>
        </View>
      </SafeAreaView>
    </AuthProvider>
  );
};

export default DateOfBirth;
