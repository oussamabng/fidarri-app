import { View, Text, ScrollView, Image, FlatList } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { RFValue } from "react-native-responsive-fontsize";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getInvoices } from "@/graphql/services/freelancer.service";
import { useAuthStore } from "@/store/useAuthStore";
import Loading from "@/components/loading";
import dayjs from "dayjs";
import { router, useFocusEffect } from "expo-router";
import { primary } from "@/constants/Colors";
import AuthProvider from "@/components/authProvider";
import { ActivityIndicator } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/useAuth";

const renderFooter = () => {
  return (
    <View
      style={{
        padding: RFValue(10),
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator color={primary} />
    </View>
  );
};

const Invoices = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const { access } = useAuthStore((state: any) => ({
    access: state.access,
  }));

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [haveNext, setHaveNext] = useState(false);
  const [limit, setLimit] = useState(0);

  const fetchInvoices = async () => {
    setLoading(true);
    const { data, error } = await getInvoices(access, 0, 5);

    if (error) {
      setLoading(false);
      alert(data);
    } else {
      setLimit(5);
      setHaveNext(data?.hasNextPage);
      setInvoices(data?.nodes);
      setLoading(false);
    }
  };

  const reFetchInvoices = async () => {
    const { data, error } = await getInvoices(access, 0, limit + 5);

    if (error) {
      alert(data);
      setLoading(false);
    } else {
      setLimit((prevState) => prevState + 5);
      setHaveNext(data?.hasNextPage);
      setInvoices(data?.nodes);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchInvoices();
    }, [])
  );

  return (
    <AuthProvider>
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          paddingHorizontal: RFValue(25),
        }}
      >
        <Text
          style={{
            fontSize: RFValue(24),
            fontWeight: "600",
            color: "#222222",
            paddingVertical: RFValue(20),
            textAlign: isArabic ? "right" : "left",
          }}
        >
          {t("Factures")}
        </Text>
        {loading && <Loading size="small" />}
        {!loading && invoices?.length === 0 && (
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 2 / 3,
            }}
          >
            <Image
              alt="empty"
              source={require("@/assets/images/empty.png")}
              style={{
                width: 150,
                height: 150,
                resizeMode: "contain",
              }}
            />
          </View>
        )}
        {!loading && invoices?.length > 0 && (
          <FlatList
            data={invoices}
            showsVerticalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }: { item: any }) => {
              const invoice = item;
              return (
                <View
                  style={{
                    borderWidth: 0.4,
                    borderColor: "#0000002B",
                    backgroundColor: "white",
                    padding: RFValue(20),
                    borderRadius: 8,
                    marginBottom: RFValue(20),
                  }}
                >
                  <View
                    style={{
                      flexDirection: "column",
                      gap: RFValue(15),
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
                        backgroundColor: "#0000002B",
                        height: 1,
                        width: "100%",
                      }}
                    ></View>
                    <View
                      style={{
                        flexDirection: isArabic ? "row-reverse" : "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
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
                          {t("Montant dû")}
                        </Text>
                        <Text
                          style={{
                            fontSize: RFValue(12),
                            color: "#000000",
                          }}
                        >
                          {invoice?.facturation?.totalAmount} DZD
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
                          {dayjs(invoice?.deadline).format("YYYY-MM-DD")}
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
                          {t("Status")}
                        </Text>
                        <Text
                          style={{
                            fontSize: RFValue(12),
                            color:
                              invoice?.status === "NOT_PAID" ||
                              invoice?.status === "REJECTED" ||
                              invoice?.status === "OVERDUE"
                                ? "#AF3E3E"
                                : invoice?.status === "PENDING"
                                ? "rgb(255, 181, 57)"
                                : invoice?.status === "PAID"
                                ? "#46A56B"
                                : primary,
                          }}
                        >
                          {invoice?.status === "NOT_PAID"
                            ? t("non payée")
                            : invoice?.status === "PENDING"
                            ? t("En attente")
                            : invoice?.status === "PAID"
                            ? t("payée")
                            : invoice?.status === "ACCUMULATED"
                            ? t("accumulé")
                            : invoice?.status === "OVERDUE"
                            ? t("retard")
                            : invoice?.status === "REJECTED"
                            ? t("rejeté")
                            : invoice?.status}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: isArabic ? "flex-start" : "flex-end",
                        alignItems: "center",
                        gap: RFValue(20),
                        paddingVertical: RFValue(35),
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          router.push({
                            pathname: "/freelancer/invoiceDetails",
                            params: {
                              invoice: JSON.stringify(invoice),
                              test: "ok",
                            },
                          });
                        }}
                        style={{
                          borderBottomWidth: 1,
                          borderBottomColor: "#888888",
                        }}
                      >
                        <Text
                          style={{
                            color: "#888888",
                            fontWeight: "500",
                            fontSize: RFValue(12),
                          }}
                        >
                          {t("Voir details")}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            }}
            onEndReachedThreshold={0}
            onEndReached={() => {
              if (haveNext) {
                reFetchInvoices();
              }
            }}
            ListFooterComponent={
              invoices?.length > 0 && haveNext ? renderFooter : null
            }
            ListEmptyComponent={
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  gap: RFValue(40),
                }}
              >
                <Image
                  alt="empty"
                  source={require("@/assets/images/empty.png")}
                  style={{
                    width: 150,
                    height: 150,
                    resizeMode: "contain",
                  }}
                />
              </View>
            }
          />
          /*  <ScrollView>
            {invoices?.map((invoice: any, index) => (
              <View
                key={index}
                style={{
                  borderWidth: 0.4,
                  borderColor: "#0000002B",
                  backgroundColor: "white",
                  padding: RFValue(20),
                  borderRadius: 8,
                  marginBottom: RFValue(50),
                }}
              >
                <View
                  style={{
                    flexDirection: "column",
                    gap: RFValue(15),
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
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
                      }}
                    >
                      Facture N : {invoice?.id}
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: "#0000002B",
                      height: 1,
                      width: "100%",
                    }}
                  ></View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
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
                        Montant dû
                      </Text>
                      <Text
                        style={{
                          fontSize: RFValue(12),
                          color: "#000000",
                        }}
                      >
                        {invoice?.facturation?.totalAmount} DZD
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
                        Delais
                      </Text>
                      <Text
                        style={{
                          fontSize: RFValue(12),
                          color: "#000000",
                        }}
                      >
                        {dayjs(invoice?.deadline).format("YYYY-MM-DD")}
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
                        Status
                      </Text>
                      <Text
                        style={{
                          fontSize: RFValue(12),
                          color:
                            invoice?.status === "NOT_PAID" ||
                            invoice?.status === "REJECTED" ||
                            invoice?.status === "OVERDUE"
                              ? "#AF3E3E"
                              : invoice?.status === "PENDING"
                              ? "rgb(255, 181, 57)"
                              : invoice?.status === "PAID"
                              ? "#46A56B"
                              : primary,
                        }}
                      >
                        {invoice?.status === "NOT_PAID"
                          ? "non payée"
                          : invoice?.status === "PENDING"
                          ? "en attente"
                          : invoice?.status === "PAID"
                          ? "payée"
                          : invoice?.status === "ACCUMULATED"
                          ? "accumulé"
                          : invoice?.status === "OVERDUE"
                          ? "surprimé"
                          : invoice?.status === "REJECTED"
                          ? "rejeté"
                          : invoice?.status}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      gap: RFValue(20),
                      paddingVertical: RFValue(35),
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        router.push({
                          pathname: "/freelancer/invoiceDetails",
                          params: {
                            invoice: JSON.stringify(invoice),
                            test: "ok",
                          },
                        });
                      }}
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: "#888888",
                      }}
                    >
                      <Text
                        style={{
                          color: "#888888",
                          fontWeight: "500",
                          fontSize: RFValue(12),
                        }}
                      >
                        Voir details
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView> */
        )}
      </View>
    </AuthProvider>
  );
};

export default Invoices;
