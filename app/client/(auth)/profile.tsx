import { primary } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { Appbar } from "react-native-paper";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { RFValue } from "react-native-responsive-fontsize";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  TouchableOpacity,
  View,
  Text,
  SafeAreaView,
  Image,
  StatusBar,
} from "react-native";
import { useProfileStore } from "@/store/useProfileStore";
import AuthProvider from "@/components/authProvider";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const { t, i18n } = useTranslation();

  const { data } = useProfileStore((state: any) => ({
    data: state.data,
  }));

  const navigation = useRouter();
  return (
    <AuthProvider>
      <View
        style={{
          flex: 1,
        }}
      >
        <SafeAreaView
          style={{
            backgroundColor: primary,
            flex: 0.5,
            paddingTop: RFValue(30),
          }}
        >
          <Appbar.BackAction
            color="white"
            onPress={() => {
              navigation.back();
            }}
          />
          <View
            style={{
              flexDirection: "column",
              gap: RFValue(16),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <StatusBar barStyle={"light-content"} />

            <Image
              alt="avatar"
              source={
                data.profilePictureUrl
                  ? { uri: data.profilePictureUrl }
                  : require("@/assets/images/profile.png")
              }
              style={{
                width: RFValue(92),
                height: RFValue(92),
                borderRadius: 999,
                borderWidth: 4,
                borderColor: "white",
              }}
            />

            {/*    <View
          style={{
            backgroundColor: "white",
            borderRadius: 10,
            flexDirection: "row",
            alignItems: "center",
            gap: RFValue(3),
            paddingVertical: RFValue(4),
            paddingHorizontal: RFValue(8),
          }}
        >
          <MaterialCommunityIcons
            name={isAvailable ? "flash" : "block-helper"}
            size={10}
            color={isAvailable ? "#46A56B" : "#D76262"}
          />
          <Text
            style={{
              fontSize: RFValue(10),
              fontWeight: "500",
              color: isAvailable ? "#46A56B" : "#D76262",
            }}
          >
            {isAvailable ? "Available" : "Unavailable"}
          </Text>
        </View> */}
            <View
              style={{
                flexDirection: "column",
                gap: RFValue(4),
                alignItems: "center",
                paddingHorizontal: RFValue(20),
              }}
            >
              <Text
                numberOfLines={2}
                style={{
                  fontSize: RFValue(26),
                  fontWeight: "500",
                  color: "white",
                  textTransform: "capitalize",
                  textAlign: "center",
                }}
              >
                {data.firstName + " " + data.lastName}
              </Text>
              <Text
                style={{
                  color: "white",
                  fontSize: RFValue(14),
                }}
              >
                {data.email}
              </Text>
            </View>
            <View
              style={{
                flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
                alignItems: "center",
                gap: RFValue(10),
              }}
            >
              <View
                style={{
                  gap: RFValue(2),
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <MaterialCommunityIcons
                  name="star"
                  size={24}
                  color={"#FADB14"}
                />
                <Text
                  style={{
                    color: "#FADB14",
                    fontSize: RFValue(14),
                    fontWeight: "600",
                  }}
                >
                  {parseInt(data.rating)}
                </Text>
              </View>
              <Text
                style={{
                  color: "white",
                  fontSize: RFValue(12),
                  letterSpacing: 0.1,
                }}
              >
                {t("Avis")}
              </Text>

              <Text
                style={{
                  color: "white",
                  fontSize: RFValue(12),
                  letterSpacing: 0.1,
                  textAlign: i18n.language === "ar" ? "right" : "left",
                }}
              >
                {data.missionsCompleted} {t("Demandes réussies")}
              </Text>
            </View>
          </View>
        </SafeAreaView>

        <BottomSheet
          handleIndicatorStyle={{
            display: "none",
          }}
          snapPoints={["55%", "55%"]}
        >
          <BottomSheetView
            style={{
              paddingHorizontal: RFValue(25),
              paddingVertical: RFValue(50),
            }}
          >
            <View
              style={{
                flexDirection: "column",
                gap: RFValue(16),
              }}
            >
              {/*      <View
            style={{
              paddingBottom: RFValue(16),
            }}
          >
            <Alert />
          </View> */}
              <TouchableOpacity
                onPress={() => {
                  navigation.push("/client/(auth)/profile-details");
                }}
                style={{
                  flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection:
                      i18n.language === "ar" ? "row-reverse" : "row",
                    alignItems: "center",
                    gap: RFValue(12),
                  }}
                >
                  <Feather name="user" color="black" size={24} />
                  <Text
                    style={{
                      color: "#555555",
                      fontWeight: "500",
                      fontSize: RFValue(14),
                    }}
                  >
                    {t("Informations personnel")}
                  </Text>
                </View>
                <Feather
                  name={
                    i18n.language === "ar" ? "chevron-left" : "chevron-right"
                  }
                  size={30}
                  color="#A1A1A1"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.push("/client/(auth)/addresses");
                }}
                style={{
                  flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection:
                      i18n.language === "ar" ? "row-reverse" : "row",
                    alignItems: "center",
                    gap: RFValue(12),
                  }}
                >
                  <MaterialCommunityIcons
                    name="map-marker-outline"
                    color="black"
                    size={24}
                  />
                  <Text
                    style={{
                      color: "#555555",
                      fontWeight: "500",
                      fontSize: RFValue(14),
                    }}
                  >
                    {t("Mes adresses")}
                  </Text>
                </View>
                <Feather
                  name={
                    i18n.language === "ar" ? "chevron-left" : "chevron-right"
                  }
                  size={30}
                  color="#A1A1A1"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.push("/reviews");
                }}
                style={{
                  flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection:
                      i18n.language === "ar" ? "row-reverse" : "row",
                    alignItems: "center",
                    gap: RFValue(12),
                  }}
                >
                  <MaterialCommunityIcons
                    name="star-outline"
                    color="black"
                    size={24}
                  />
                  <Text
                    style={{
                      color: "#555555",
                      fontWeight: "500",
                      fontSize: RFValue(14),
                    }}
                  >
                    {t("Mes commantaires")}
                  </Text>
                </View>
                <Feather
                  name={
                    i18n.language === "ar" ? "chevron-left" : "chevron-right"
                  }
                  size={30}
                  color="#A1A1A1"
                />
              </TouchableOpacity>
              {/*   <TouchableOpacity
            onPress={() => {
              navigation.push("/client/(auth)/document");
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: RFValue(12),
              }}
            >
              <MaterialCommunityIcons
                name="file-document-outline"
                color="black"
                size={24}
              />
              <Text
                style={{
                  color: "#555555",
                  fontWeight: "500",
                  fontSize: RFValue(14),
                }}
              >
                Documents
              </Text>
            </View>
            <Feather name="chevron-right" size={30} color="#A1A1A1" />
          </TouchableOpacity> */}
            </View>
          </BottomSheetView>
        </BottomSheet>
      </View>
    </AuthProvider>
  );
};

export default Profile;
