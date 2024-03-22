import { primary } from "@/constants/Colors";
import { useFocusEffect, useRouter } from "expo-router";
import { Appbar } from "react-native-paper";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { RFValue } from "react-native-responsive-fontsize";
import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  TouchableOpacity,
  View,
  Text,
  SafeAreaView,
  Image,
} from "react-native";
import { useProfileStore } from "@/store/useProfileStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useCallback, useEffect, useState } from "react";
import { getFreelancerInfo } from "@/graphql/services/freelancer.service";
import Loading from "@/components/loading";
import AuthProvider from "@/components/authProvider";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const { t, i18n } = useTranslation();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const { update } = useProfileStore((state: any) => ({
    update: state.update,
  }));
  const { id, access } = useAuthStore((state: any) => ({
    id: state.id,
    access: state.access,
  }));

  const navigation = useRouter();

  const fetchDetails = async () => {
    setLoading(true);
    const { data, error } = await getFreelancerInfo(access, parseInt(id));

    console.log("DATA PROFILE F");
    console.log(data);
    if (error) {
      setLoading(false);
      alert(data);
    } else {
      setData(data);
      const newData = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        phoneNumber: data.phoneNumber,
        rating: data.rating,
        accountStatus: data.accountStatus,
        profilePictureUrl: data.profilePictureUrl,
        adr: data.address.street,
      };

      update(newData);

      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDetails();
    }, [])
  );

  if (loading) return <Loading size="small" />;

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
            <Image
              alt="avatar"
              source={
                data?.profilePictureUrl
                  ? { uri: data?.profilePictureUrl }
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
                {data?.firstName + " " + data?.lastName}
              </Text>
              <Text
                style={{
                  color: "white",
                  fontSize: RFValue(14),
                }}
              >
                {data?.email}
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
                  flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
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
                  {parseInt(data?.rating)}
                </Text>
              </View>
              {Boolean(data?.rating) && (
                <Text
                  style={{
                    color: "white",
                    fontSize: RFValue(12),
                    letterSpacing: 0.1,
                  }}
                >
                  {t("Avis")}
                </Text>
              )}
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
              <TouchableOpacity
                onPress={() => {
                  navigation.push("/freelancer/(auth)/profile-details");
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
                  navigation.push("/freelancer/schedule");
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
                  <MaterialIcons name="schedule" color="black" size={24} />
                  <Text
                    style={{
                      color: "#555555",
                      fontWeight: "500",
                      fontSize: RFValue(14),
                    }}
                  >
                    {t("Programme de travail")}
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
            </View>
          </BottomSheetView>
        </BottomSheet>
      </View>
    </AuthProvider>
  );
};

export default Profile;
