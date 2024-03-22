import { black, primary, text2 } from "@/constants/Colors";
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Appbar, Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { RFValue } from "react-native-responsive-fontsize";
import { useRegisterStore } from "@/store/useRegisterStore";
import { useState } from "react";
import { MultipleSelectList } from "react-native-dropdown-select-list";

const JobType = () => {
  const navigation = useRouter();

  const [categories, setCategories] = useState([]);

  const data = [
    { key: "MAID", value: "Garde malade" },
    { key: "ELDERLY_SITTER", value: "Femme de ménage" },
  ];

  const { addJobType } = useRegisterStore((state: any) => ({
    addJobType: state.addJobType,
  }));

  const handleAddJobType = async () => {
    if (categories.length === 0) {
      return Alert.alert("Erreur", "Selectionner au moins un type");
    }
    addJobType(categories);
    navigation.replace("/address");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
      keyboardVerticalOffset={0}
    >
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: Platform.OS === "android" ? RFValue(25) : 0,
        }}
      >
        <Appbar.BackAction
          color="black"
          onPress={() => {
            navigation.replace("/dateOfBirth");
          }}
        />
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
              gap: RFValue(30),
              flex: 1,
            }}
          >
            <View
              style={{
                flexDirection: "column",
                gap: 6,
                maxWidth: RFValue(300),
              }}
            >
              <Text
                style={{
                  fontSize: RFValue(24),
                  color: black,
                  fontWeight: "600",
                }}
              >
                Type de travail
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: text2,
                }}
              >
                Veuillez sélectionner le type travail auprès de laquelle vous
                souhaitez vous inscrire .
              </Text>
            </View>
            {/*   <DropdownComponent
              label="Selectionner un type"
              data={["Garde malade", "Femme de ménage"]}
              value={jobType}
              onSelect={setJobType}
            /> */}
            <MultipleSelectList
              setSelected={(val: any) => setCategories(val)}
              data={data}
              save="key"
              searchPlaceholder="Rechercher un type"
              notFoundText="Aucun type trouvé"
              label="Types choisis"
              boxStyles={{
                height: RFValue(40),
                backgroundColor: "white",
                borderWidth: 1,
                borderRadius: 4,
                paddingHorizontal: RFValue(8),
                flexDirection: "row",
                alignItems: "center",
                borderColor: "#E0E1E4",
              }}
              badgeStyles={{
                backgroundColor: primary,
              }}
            />
          </View>
          <View style={{ flexDirection: "column", gap: 16 }}>
            <Button
              style={{
                borderRadius: 4,
                height: 45,
                justifyContent: "center",
              }}
              mode="contained"
              buttonColor={primary}
              onPress={handleAddJobType}
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
            {/*  <Button
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
    </KeyboardAvoidingView>
  );
};

export default JobType;
