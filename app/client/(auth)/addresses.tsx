import { black, primary } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Button } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { getClientAddresses } from "@/graphql/services/addresses.service";
import { useAuthStore } from "@/store/useAuthStore";
import Loading from "@/components/loading";
import Input from "@/components/input";
import AuthProvider from "@/components/authProvider";
import { useTranslation } from "react-i18next";
import KeyboardAvoidingViewWrapper from "@/components/keyboardAvoidingViewWrapper";

const { width } = Dimensions.get("screen");

const EmptyAdr = () => {
  const { t, i18n } = useTranslation();
  const navigation = useRouter();

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: RFValue(30),
      }}
    >
      <Image
        alt="marker"
        source={require("@/assets/images/marker.png")}
        style={{
          width: RFValue(130),
          height: RFValue(130),
          resizeMode: "contain",
        }}
      />
      <Text
        style={{
          textAlign: "center",
          fontSize: RFValue(12),
          color: "#6F6F6F",
          maxWidth: width - 50,
        }}
      >
        {t("adr_empty")}
      </Text>
      <Button
        style={{
          borderRadius: 4,
          height: 45,
          justifyContent: "center",
        }}
        mode="contained"
        buttonColor={primary}
        onPress={() => {
          navigation.push("/client/(auth)/add-address");
        }}
      >
        <Text
          style={{
            fontSize: RFValue(14),
            color: "white",
            fontWeight: "600",
          }}
        >
          {t("Ajouter une adresse")}
        </Text>
      </Button>
    </View>
  );
};

const Addresses = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const { access, id } = useAuthStore((state: any) => ({
    access: state.access,
    id: state.id,
  }));
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const navigation = useRouter();

  const fetchAddresses = async () => {
    setLoading(true);
    const { data, error } = await getClientAddresses(0, 10, id, access);

    if (error) {
      setLoading(false);
      alert(data);
    } else {
      setData(data.nodes);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAddresses();
    }, [])
  );

  if (loading) return <Loading size="small" />;

  return (
    <AuthProvider>
      <KeyboardAvoidingViewWrapper>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: "white",
          }}
        >
          <View
            style={{
              paddingHorizontal: RFValue(25),
            }}
          >
            <StatusBar barStyle="dark-content" />
            <Text
              style={{
                fontSize: RFValue(24),
                color: black,
                fontWeight: "600",
                textAlign: isArabic ? "right" : "left",
              }}
            >
              {t("Mes adresses")}
            </Text>
          </View>
          {data?.length === 0 && !loading && <EmptyAdr />}

          {data?.length > 0 && !loading && (
            <ScrollView
              bounces={false}
              style={{
                flex: 1,
                paddingHorizontal: RFValue(25),
                paddingVertical: RFValue(50),
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  gap: RFValue(20),
                }}
              >
                {data.map((item: any, index: number) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "column",
                      gap: RFValue(16),
                    }}
                  >
                    <Input
                      label={`${t("Adresse")} ${index === 0 ? t("Primary") : index + 1
                        }`}
                      iconPosition={isArabic ? "left" : "right"}
                      arabic={isArabic}
                      iconName="pencil-outline"
                      onIconClick={() => {
                        navigation.push({
                          pathname: `/client/(auth)/update-address`,
                          params: {
                            address: JSON.stringify(item.address),
                            numberOfPieces: item.numberOfPieces,
                            homeId: item.id,
                          },
                        });
                      }}
                      disabledBg
                      disabled
                      defaultValue={item?.address?.city}
                      numberOfLines={1}
                    />
                  </View>
                ))}
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    gap: RFValue(6),
                    paddingTop: RFValue(10),
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    navigation.push("/client/(auth)/add-address");
                  }}
                >
                  <Feather name="plus" size={24} color={primary} />
                  <Text
                    style={{
                      color: primary,
                      fontSize: RFValue(14),
                      fontWeight: "500",
                    }}
                  >
                    {t("Add New Address")}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </SafeAreaView>
      </KeyboardAvoidingViewWrapper>
    </AuthProvider>
  );
};

export default Addresses;
