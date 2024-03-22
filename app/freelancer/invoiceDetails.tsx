import React, { useState } from "react";

import { primary } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Alert, Image, ScrollView } from "react-native";
import { View, Text, SafeAreaView, StatusBar, Dimensions } from "react-native";
import { Appbar, Button } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { useLocalSearchParams, router } from "expo-router";
import { useAuthStore } from "@/store/useAuthStore";
import dayjs from "dayjs";
const { height } = Dimensions.get("screen");
import * as DocumentPicker from "expo-document-picker";
import { uploadFile } from "@/graphql/services/file.service";
import mime from "mime";
import { submitInvoice } from "@/graphql/services/freelancer.service";
import AuthProvider from "@/components/authProvider";
import { useTranslation } from "react-i18next";

const invoiceDetails = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const { access } = useAuthStore((state: any) => ({
    access: state.access,
  }));
  const { invoice: stringifyInvoice, test }: any = useLocalSearchParams();
  const [loading, setLoading] = useState(false);

  const pickDocument = async () => {
    let result: any = await DocumentPicker.getDocumentAsync({});

    if (result?.canceled) {
      return;
    } else {
      setLoading(true);
      const fileName = result.assets[0].uri.split("/").pop();
      const type = fileName.split(".").pop();
      const fileType = mime.getType(type);

      if (fileType === "application/pdf" || fileType?.startsWith("image/")) {
        const response = await uploadFile(
          result.assets[0].uri,
          fileType,
          fileName
        );

        console.log("UPLOAD FILE ------");
        console.log(response);

        const { data, error } = await submitInvoice(
          access,
          parseInt(invoice?.id),
          parseInt(response.id)
        );

        if (error) {
          setLoading(false);
          alert(data);
        } else {
          console.log("HEHEHEHEEHE");
          console.log(data);
          router.back();
        }
      } else {
        setLoading(false);
        Alert.alert(
          "Erreur",
          "Sil vous plait, entrez un document valide (pdf)"
        );
      }
    }
  };
  const invoice = JSON.parse(stringifyInvoice);
  return (
    <AuthProvider>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: "white",
        }}
        bounces={false}
      >
        <StatusBar barStyle="light-content" />
        <SafeAreaView
          style={{
            backgroundColor: primary,
            paddingTop: RFValue(40),
          }}
        >
          <Appbar.BackAction
            color="white"
            onPress={() => {
              router.back();
            }}
          />
        </SafeAreaView>

        <View
          style={{
            height: height * 0.1,
            backgroundColor: primary,
          }}
        >
          <View
            style={{
              position: "absolute",
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              transform: [{ translateY: 92 / 2 }],
              zIndex: 10,
              paddingHorizontal: RFValue(25),
            }}
          >
            <View
              style={{
                borderWidth: 0.4,
                borderColor: "#0000002B",
                backgroundColor: "white",
                paddingHorizontal: RFValue(13),
                paddingVertical: RFValue(19),
                borderRadius: 8,
                width: "100%",
                flex: 1,
              }}
            >
              <View
                style={{
                  flexDirection: isArabic ? "row-reverse" : "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: isArabic ? "row-reverse" : "row",
                    alignItems: "center",
                    gap: RFValue(10),
                  }}
                >
                  <Image
                    source={require("@/assets/images/fidarri.png")}
                    style={{
                      objectFit: "contain",
                      width: 32,
                      height: 32,
                    }}
                  />
                  <Text
                    style={{
                      color: "#555555",
                      fontSize: RFValue(12),
                      textAlign: isArabic ? "right" : "left",
                    }}
                  >
                    {t("Facture N")} : {invoice?.id}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "column",
                    alignItems: "center",
                    gap: RFValue(6),
                  }}
                >
                  <Text
                    style={{
                      fontSize: RFValue(10),
                      color: "#BBBBBB",
                    }}
                  >
                    {t("Delais")}
                  </Text>
                  <Text
                    style={{
                      fontSize: RFValue(12),
                      color: "#000000",
                    }}
                  >
                    {invoice?.deadline
                      ? dayjs(invoice?.deadline).format("YYYY-MM-DD")
                      : "/"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: RFValue(25),
            flexDirection: "column",
            gap: RFValue(25),
            paddingTop: RFValue(80),
          }}
        >
          {invoice?.missions?.map((mission: any, index: number) => (
            <View
              key={index.toString()}
              style={{
                borderWidth: 1,
                borderColor: "#00000040",
                borderRadius: 8,
                paddingHorizontal: RFValue(12),
                paddingVertical: RFValue(30),
                flexDirection: "column",
                gap: RFValue(15),
              }}
            >
              <Text
                style={{
                  color: "#888888",
                  fontSize: RFValue(12),
                  textAlign: isArabic ? "right" : "left",
                }}
              >
                {t("Mission")} {mission?.id}
              </Text>
              <View
                style={{
                  flexDirection: isArabic ? "row-reverse" : "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#888888",
                    fontSize: RFValue(12),
                    textAlign: isArabic ? "right" : "left",
                  }}
                >
                  {t("Date")}
                </Text>
                <Text
                  style={{
                    color: "#000000",
                    fontSize: RFValue(12),
                    textAlign: isArabic ? "right" : "left",
                  }}
                >
                  {dayjs(mission?.createdAt).format("YYYY-MM-DD")}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: isArabic ? "row-reverse" : "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#888888",
                    fontSize: RFValue(12),
                    textAlign: isArabic ? "right" : "left",
                  }}
                >
                  {t("Montant Reçu")}
                </Text>
                <Text
                  style={{
                    color: "#000000",
                    fontSize: RFValue(12),
                    textAlign: isArabic ? "right" : "left",
                  }}
                >
                  {mission?.hiring?.offer?.price?.price} DZD
                </Text>
              </View>
              <View
                style={{
                  flexDirection: isArabic ? "row-reverse" : "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#888888",
                    fontSize: RFValue(12),
                    textAlign: isArabic ? "right" : "left",
                  }}
                >
                  {t("Coupon")}
                </Text>
                <Text
                  style={{
                    color: "#D76262",
                    fontSize: RFValue(12),
                    textAlign: isArabic ? "right" : "left",
                  }}
                >
                  {mission?.hiring?.offer?.price?.discountedPrice} DZD
                </Text>
              </View>
              <View
                style={{
                  flexDirection: isArabic ? "row-reverse" : "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#888888",
                    fontSize: RFValue(12),
                    textAlign: isArabic ? "right" : "left",
                  }}
                >
                  {t("Montant Total")}
                </Text>
                <Text
                  style={{
                    color: "#000",
                    fontSize: RFValue(12),
                  }}
                >
                  {mission?.hiring?.offer?.price?.total} DZD
                </Text>
              </View>
              {Boolean(invoice?.facturation?.accumulatedAmount) ? (
                <View
                  style={{
                    flexDirection: isArabic ? "row-reverse" : "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#888888",
                      fontSize: RFValue(12),
                      textAlign: isArabic ? "right" : "left",
                    }}
                  >
                    {t("Valeur accumulée")}
                  </Text>
                  <Text
                    style={{
                      color: "#000",
                      fontSize: RFValue(12),
                    }}
                  >
                    {invoice?.facturation?.accumulatedAmount} {t("DZD")}
                  </Text>
                </View>
              ) : null}
            </View>
          ))}
        </View>
        <View
          style={{
            flexDirection: isArabic ? "row-reverse" : "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: RFValue(25),
            paddingVertical: RFValue(20),
          }}
        >
          <Text
            style={{
              fontSize: RFValue(14),
              color: "black",
              textAlign: isArabic ? "right" : "left",
            }}
          >
            {t("Montant total a payer :")}
          </Text>
          <Text
            style={{
              fontSize: RFValue(16),
              color: "black",
              fontWeight: "700",
              textAlign: isArabic ? "right" : "left",
            }}
          >
            {invoice?.facturation?.amountToPay} {t("DZD")}
          </Text>
        </View>

        {invoice?.status === "NOT_PAID" ||
        invoice?.status === "REJECTED" ||
        invoice?.status === "OVERDUE" ? (
          <View
            style={{
              flexDirection: "column",
              gap: RFValue(10),
              paddingHorizontal: RFValue(25),
              paddingTop: RFValue(20),
            }}
          >
            <Text
              style={{
                fontSize: RFValue(16),
                color: "#4F4F50",
                fontWeight: "600",
                textAlign: isArabic ? "right" : "left",
              }}
            >
              {t("Reçu CCP")}
            </Text>
            <Text
              style={{
                fontSize: RFValue(10),
                color: "#8D8D8D",
                textAlign: isArabic ? "right" : "left",
              }}
            >
              {t("Attachez le recto de votre reçu accusé par la poste algerie")}
            </Text>
          </View>
        ) : null}

        <View
          style={{
            paddingHorizontal: RFValue(25),
            paddingVertical: RFValue(40),
          }}
        >
          {invoice?.status === "NOT_PAID" ||
          invoice?.status === "REJECTED" ||
          invoice?.status === "OVERDUE" ? (
            <Button
              style={{
                borderRadius: 4,
                height: 45,
                justifyContent: "center",
              }}
              mode="contained"
              textColor="#FFF"
              buttonColor={primary}
              loading={loading}
              icon={() => (
                <Ionicons
                  name="cloud-upload-outline"
                  color={"white"}
                  size={20}
                />
              )}
              onPress={() => {
                pickDocument();
              }}
            >
              <Text
                style={{
                  fontSize: RFValue(14),
                  color: "#FFF",
                  fontWeight: "600",
                }}
              >
                {t("Soumettre")}
              </Text>
            </Button>
          ) : null}
        </View>
      </ScrollView>
    </AuthProvider>
  );
};

export default invoiceDetails;
