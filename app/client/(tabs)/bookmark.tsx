import { View, Text, SafeAreaView, ScrollView, Image } from "react-native";
import React from "react";
import { RFValue } from "react-native-responsive-fontsize";
import { black } from "@/constants/Colors";
import Menu from "@/components/menu";
import BestNoted, { BestNotedCard } from "@/components/bestNoted";
import { useFreelancersStore } from "@/store/useFreelancersStore";
import AuthProvider from "@/components/authProvider";
import { useTranslation } from "react-i18next";

const BookMark = () => {
  const { data: freelancers } = useFreelancersStore((state: any) => ({
    data: state.data,
  }));

  const { t, i18n } = useTranslation();

  return (
    <AuthProvider>
      <Menu>
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            paddingTop: RFValue(20),
            paddingHorizontal: RFValue(25),
          }}
        >
          <Text
            style={{
              paddingBottom: RFValue(40),
              fontSize: RFValue(26),
              color: black,
              textAlign: i18n.language === "ar" ? "right" : "left",
              fontWeight: "600",
            }}
          >
            {t("Liste de souhaits")}
          </Text>
          {freelancers?.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingBottom: RFValue(25),
              }}
            >
              <Image
                alt="empty"
                source={require("@/assets/images/empty.png")}
                style={{
                  width: 100,
                  height: 100,
                  resizeMode: "contain",
                }}
              />
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {freelancers.map((freelancer: any) => (
                <>
                  <BestNotedCard
                    key={freelancer.id}
                    bookmark={true}
                    item={freelancer}
                    loading={false}
                    noSave={false}
                    notClickable={false}
                  />
                  <View
                    style={{
                      paddingVertical: RFValue(10),
                    }}
                  ></View>
                </>
              ))}
            </ScrollView>
          )}
        </View>
      </Menu>
    </AuthProvider>
  );
};

export default BookMark;
