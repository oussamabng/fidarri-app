import { black, primary, white } from "@/constants/Colors";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  FlatList,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Image,
  Alert,
  StatusBar,
} from "react-native";
import { Appbar, Button } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { getClientAddresses } from "@/graphql/services/addresses.service";
import { useAuthStore } from "@/store/useAuthStore";
import Dropdown from "@/components/dropdown";
import {
  createOffer,
  getFreelancerProfile,
  getFreelancersAvailability,
  linkPromoCodeOffer,
  sendOffer,
} from "@/graphql/services/freelancer.service";
import Input from "@/components/input";
import Loading from "@/components/loading";
import AuthProvider from "@/components/authProvider";
const { width } = Dimensions.get("screen");
import { useTranslation } from "react-i18next";
import { usePushNotifications } from "@/notifications/usePushNotifications";

const CreateOffer = () => {
  const { t, i18n } = useTranslation();

  const isArabic = i18n.language === "ar";
  const navigation = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [offerId, setOfferID] = useState<any>(null);
  const [discount, setDiscounted] = useState<any>(null);
  const [price, setPrice] = useState<any>(null);
  const [total, setTotal] = useState<any>(null);

  const priceProps = {
    discount,
    price,
    total,
    offerId,
    setTotal,
    setActiveStep,
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <SafeAreaView
        style={{
          backgroundColor: primary,
          flex: 0.2,
          borderRadius: RFValue(4),
        }}
      >
        <View
          style={{
            flexDirection: "column",
            gap: RFValue(20),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: RFValue(10),
            }}
          >
            <Appbar.BackAction
              color="white"
              onPress={() => {
                activeStep === 0
                  ? navigation.back()
                  : activeStep === 1
                  ? setActiveStep((prevState) => prevState - 1)
                  : navigation.back();
              }}
            />
          </View>
          <View
            style={{
              flexDirection: isArabic ? "row-reverse" : "row",
              paddingHorizontal: RFValue(20),
              gap: RFValue(8),
              flex: 1,
            }}
          >
            {[...Array(3)].map((_, index) => (
              <View
                key={index}
                style={{
                  height: RFValue(3),
                  flex: 1,
                  backgroundColor:
                    index === activeStep ? "#E5C255" : "#E4E4E733",
                  borderRadius: RFValue(3),
                }}
              ></View>
            ))}
          </View>
        </View>
      </SafeAreaView>
      <View
        style={{
          flex: 0.8,
          paddingHorizontal: 25,
          paddingTop: RFValue(35),
        }}
      >
        {activeStep === 0 ? (
          <ChooseHouse
            setActiveStep={setActiveStep}
            setOfferID={setOfferID}
            setDiscounted={setDiscounted}
            setPrice={setPrice}
            setTotal={setTotal}
          />
        ) : activeStep === 1 ? (
          <Price {...priceProps} />
        ) : (
          <Success />
        )}
      </View>
    </View>
  );
};

const ChooseHouse = ({
  setActiveStep,
  setOfferID,
  setDiscounted,
  setPrice,
  setTotal,
}: {
  setActiveStep: any;
  setOfferID: any;
  setDiscounted: any;
  setTotal: any;
  setPrice: any;
}) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const params: any = useLocalSearchParams();
  const navigation = useRouter();
  const [homes, setHomes] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedHome, setSelectedHome] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [types, setTypes] = useState<any>([]);
  const [loadingScreen, setLoadingScreen] = useState<boolean>(true);
  const [freelancerProfile, setFreelancerProfile] = useState<any>(null);
  const [freelancersAvailability, setFreelancersAvailability] = useState<any>(
    []
  );
  const [freelancersAvailabilityData, setFreelancersAvailabilityData] =
    useState<any>([]);
  const [inputs, setInputs] = useState({
    type: types?.length > 0 ? types[0] ?? "" : "",
    disponibility: freelancersAvailability[0] ?? "",
  });
  const [errors, setErrors] = useState({
    type: null,
    disponibility: null,
  });

  const handleOnChange = (text: string, input: string) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };
  const handleError = (errorMessage: string | null, input: string) => {
    setErrors((prevState) => ({ ...prevState, [input]: errorMessage }));
  };

  const { access, id } = useAuthStore((state: any) => ({
    access: state.access,
    id: state.id,
  }));

  const fetchHomes = async () => {
    setLoadingScreen(true);
    const { data, error } = await getClientAddresses(0, 10000, id, access);
    console.log("FETCHING HOMES ----- ", data?.nodes);
    setHomes(data?.nodes);
    setSelectedHome(data?.nodes[0]?.id);
  };

  enum AvailabilityType {
    NOT_AVAILABLE = "NOT_AVAILABLE",
    FULLDAY = "FULLDAY",
    MORNING = "MORNING",
    EVENING = "EVENING",
  }

  function translateTypeToFrench(type: string): string {
    switch (type) {
      case AvailabilityType.NOT_AVAILABLE:
        return t("indisponible");
      case AvailabilityType.FULLDAY:
        return t("toute la journée");
      case AvailabilityType.MORNING:
        return t("matin");
      case AvailabilityType.EVENING:
        return t("soir");
      default:
        return t("inconnu");
    }
  }

  enum JobType {
    MAID = "MAID",
    ELDERLY_SITTER = "ELDERLY_SITTER",
  }

  function translateJobTypes(jobTypes: JobType[]): string[] {
    return jobTypes?.map((type) => {
      switch (type) {
        case JobType.MAID:
          return "Femme de ménage";
        case JobType.ELDERLY_SITTER:
          return "Garde malade";
        default:
          return "Unknown";
      }
    });
  }

  const fetchFreelancersAvailability = async () => {
    const { data, error } = await getFreelancersAvailability(
      parseInt(params?.freelancerId),
      new Date().toISOString(),
      true,
      access
    );

    const convertedArray: string[] = data?.map((item: any) => {
      const dateParts = new Date(item.date).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });
      const translatedType = translateTypeToFrench(item.type);
      return `${dateParts} - ${translatedType}`;
    });

    setFreelancersAvailability(convertedArray);
    setFreelancersAvailabilityData(data);
    setSelectedDate(data[0]);
  };

  const fetchFreelancerType = async () => {
    const { data, error } = await getFreelancerProfile(
      parseInt(params?.freelancerId),
      access
    );
    console.log("GET FREELANCER PROFILE");
    console.log(data);
    setTypes(translateJobTypes(data?.freelancer_type));
    setFreelancerProfile(data);
    setLoadingScreen(false);
  };

  const fetchPage = async () => {
    await fetchHomes();
    await fetchFreelancersAvailability();
    await fetchFreelancerType();
  };

  useFocusEffect(
    useCallback(() => {
      console.log("access", access);
      fetchPage();
    }, [])
  );

  const handleCreateOffer = async () => {
    if (homes?.length === 0)
      return Alert.alert("Erreur", "Ajouter une pièce avant de continuer");

    if (!selectedHome) {
      return Alert.alert("Erreur", "Selectionner une pièce avant de continuer");
    }

    if (!selectedDate?.type) {
      await fetchFreelancersAvailability();
      return Alert.alert(
        "Erreur",
        "Selectionner une disponibilité pour le travail avant de continuer"
      );
    }

    setLoading(true);

    const { data, error } = await createOffer(
      {
        input: {
          date: selectedDate?.date,
          clientId: id,
          freelancerId: parseInt(params?.freelancerId),
          homeId: selectedHome,
          service:
            inputs.type === "Femme de ménage"
              ? JobType.MAID
              : JobType.ELDERLY_SITTER,
          type: selectedDate?.type,
        },
      },
      access
    );

    if (!error) {
      setOfferID(data?.id);
      setDiscounted(data?.price?.discountedPrice);
      setPrice(data?.price?.price);
      setTotal(data?.price?.total);
      setActiveStep(1);
      setLoading(false);
    } else {
      if (data.split("400010").length > 1) {
        i18n.language === "fr"
          ? Alert.alert(
              "Erreur",
              "Une offre est deja en cours avec ce freelancer"
            )
          : i18n.language === "ar"
          ? Alert.alert("خطأ", "يوجد بالفعل عرض مع هذا المستقل")
          : Alert.alert(
              "Error",
              "An offer is already in progress with this freelancer"
            );
        setLoading(false);
      } else {
        alert(data);
        setLoading(false);
      }
    }
  };

  return (
    <AuthProvider>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <StatusBar barStyle="light-content" />
        <SafeAreaView
          style={{
            flex: 1,
            justifyContent: "space-between",
            flexDirection: "column",
            gap: RFValue(25),
          }}
        >
          <View
            style={{
              flexDirection: "column",
              gap: RFValue(35),
            }}
          >
            <View
              style={{
                flexDirection: "column",
                gap: RFValue(4),
              }}
            >
              <Text
                style={{
                  color: black,
                  fontWeight: "600",
                  fontSize: RFValue(16),
                  textAlign: isArabic ? "right" : "left",
                }}
              >
                {t("Choisissez une maison")}
              </Text>
            </View>

            {loadingScreen && <Loading size="small" title="" />}
            {!loadingScreen && (
              <>
                <View style={{ flexDirection: "column", gap: RFValue(16) }}>
                  <FlatList
                    data={homes}
                    snapToInterval={width - 40}
                    decelerationRate="fast"
                    bounces={false}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({
                      item,
                      index,
                    }: {
                      item: any;
                      index: number;
                    }) => {
                      return (
                        <Pressable
                          onPress={() => {
                            setSelectedHome(item.id);
                          }}
                          style={{
                            flexDirection: "row",
                            width: width - 65,
                            backgroundColor: "#F9F9F9",
                            borderWidth: 0.7,
                            borderColor: "#E6E6E6",
                            borderRadius: 3,
                            padding: 20,
                            margin: 10,
                          }}
                        >
                          {selectedHome === item.id && (
                            <View
                              style={{
                                position: "absolute",
                                right: 0,
                                top: 0,
                              }}
                            >
                              <View
                                style={{
                                  padding: RFValue(8),
                                  backgroundColor: "#6ACD9166",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Feather
                                  name="check"
                                  color="#46A56B"
                                  size={16}
                                />
                              </View>
                            </View>
                          )}
                          <View
                            style={{
                              flexDirection: "column",
                              gap: RFValue(30),
                              flex: 1,
                            }}
                          >
                            <View
                              style={{
                                gap: RFValue(16),
                                flexDirection: "row",
                              }}
                            >
                              <View
                                style={{
                                  flexDirection: "column",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  gap: RFValue(0),
                                }}
                              >
                                <View
                                  style={{
                                    borderRadius: 999,
                                    width: RFValue(30),
                                    height: RFValue(30),
                                    backgroundColor: "#D9D9D9",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <Ionicons
                                    name="cube"
                                    color="black"
                                    size={15}
                                  />
                                </View>
                                <View
                                  style={{
                                    backgroundColor: "#D9D9D9",
                                    height: 40,
                                    width: 0,
                                    borderLeftWidth: 1,
                                    borderLeftColor: "#D9D9D9",
                                  }}
                                />

                                <View
                                  style={{
                                    borderRadius: 999,
                                    width: RFValue(30),
                                    height: RFValue(30),
                                    backgroundColor: "#923FB326",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <Ionicons
                                    name="location-sharp"
                                    color="black"
                                    size={15}
                                  />
                                </View>
                              </View>
                              <View
                                style={{
                                  flexDirection: "column",
                                  maxWidth: "80%",
                                  justifyContent: "space-between",
                                  paddingVertical: RFValue(7.5),
                                }}
                              >
                                <Text
                                  style={{
                                    color: "#505050",
                                    fontSize: RFValue(10),
                                    lineHeight: 16,
                                  }}
                                >
                                  {freelancerProfile?.address?.building},{" "}
                                  {freelancerProfile?.address?.city} ,
                                  {freelancerProfile?.address?.state}
                                </Text>
                                <Text
                                  style={{
                                    color: "#505050",
                                    fontSize: RFValue(10),
                                    lineHeight: 16,
                                  }}
                                >
                                  {item?.address?.building},{" "}
                                  {item?.address?.city} ,{item?.address?.state}{" "}
                                </Text>
                              </View>
                            </View>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <View
                                style={{
                                  flexDirection: "row",
                                  gap: RFValue(4),
                                  alignItems: "center",
                                }}
                              >
                                <MaterialIcons
                                  name="meeting-room"
                                  color="#707070"
                                  size={20}
                                />
                                <Text
                                  style={{
                                    color: "#707070",
                                    fontWeight: "600",
                                    fontSize: RFValue(10),
                                  }}
                                >
                                  {item.numberOfPieces} {t("Pièces")}
                                </Text>
                              </View>
                              <Pressable
                                onPress={() => {
                                  navigation.push({
                                    pathname: `/client/update-home`,
                                    params: {
                                      address: JSON.stringify(
                                        homes[index].address
                                      ),
                                      numberOfPieces:
                                        homes[index].numberOfPieces,
                                      homeId: homes[index].id,
                                    },
                                  });
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: RFValue(12),
                                    textDecorationColor: primary,
                                    textDecorationLine: "underline",
                                    color: primary,
                                  }}
                                >
                                  {t("Modifier")}
                                </Text>
                              </Pressable>
                            </View>
                          </View>
                        </Pressable>
                      );
                    }}
                  />

                  <View
                    style={{
                      padding: RFValue(12),
                      borderWidth: 1,
                      borderStyle: "dashed",
                      borderColor: "#0000002B",
                      borderRadius: 4,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Pressable
                      onPress={() => {
                        navigation.push("/client/add-home");
                      }}
                      style={{
                        flexDirection: "row",
                        gap: RFValue(4),
                        alignItems: "center",
                      }}
                    >
                      <MaterialIcons name="add" color="#A1A1A1" size={24} />
                      <Text
                        style={{
                          color: "#A1A1A1",
                          fontWeight: "600",
                          fontSize: RFValue(12),
                        }}
                      >
                        {t("Ajouter nouveau pièces")}
                      </Text>
                    </Pressable>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "column",
                    gap: RFValue(14),
                  }}
                >
                  <View
                    style={{
                      flexDirection: "column",
                      gap: RFValue(14),
                    }}
                  >
                    <Dropdown
                      arabic={isArabic}
                      onChangeText={(
                        text: string,
                        index: number | undefined
                      ) => {
                        handleOnChange(text, "disponibility");
                        setSelectedDate(
                          index ? freelancersAvailabilityData[index] : null
                        );
                      }}
                      error={errors.disponibility}
                      onFocus={() => {
                        handleError(null, "disponibility");
                      }}
                      label={t("Disponibilité pour le travail")}
                      data={freelancersAvailability}
                      defaultButtonText={inputs.disponibility}
                    />
                    <Dropdown
                      arabic={isArabic}
                      onChangeText={(text: string) =>
                        handleOnChange(text, "type")
                      }
                      error={errors.type}
                      onFocus={() => {
                        handleError(null, "type");
                      }}
                      label={t("Service demandé")}
                      data={types}
                      defaultButtonText={inputs.type}
                    />
                  </View>
                </View>
              </>
            )}
          </View>

          {!loadingScreen && (
            <Button
              style={{
                borderRadius: 4,
                height: 45,
                justifyContent: "center",
              }}
              loading={loading}
              mode="contained"
              buttonColor={primary}
              onPress={() => {
                handleCreateOffer();
              }}
            >
              <Text
                style={{
                  fontSize: RFValue(14),
                  color: "white",
                  fontWeight: "600",
                }}
              >
                {t("Continue l'étape suivante")}
              </Text>
            </Button>
          )}
        </SafeAreaView>
      </ScrollView>
    </AuthProvider>
  );
};

const Price = ({
  price,
  discount,
  offerId,
  total,
  setTotal,
  setActiveStep,
}: {
  price: any;
  offerId: any;
  discount: any;
  total: any;
  setTotal: any;
  setActiveStep: any;
}) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const { access } = useAuthStore((state: any) => ({
    access: state.access,
  }));
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingOffer, setLoadingOffer] = useState<boolean>(false);
  const applyCodePromo = async () => {
    setLoading(true);
    const { data, error } = await linkPromoCodeOffer(
      offerId,
      inputs.codePromo,
      access
    );

    if (error) {
      setLoading(false);
      return handleError("Code promo non valide", "codePromo");
    } else {
      setTotal(data?.price?.total);
      setLoading(false);
    }
  };

  const [inputs, setInputs] = useState({
    codePromo: "",
  });

  const [errors, setErrors] = useState({
    codePromo: null,
  });

  const handleError = (errorMessage: string | null, input: string) => {
    setErrors((prevState) => ({ ...prevState, [input]: errorMessage }));
  };

  const handleOnChange = (text: string, input: string) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };

  const handleSendOffer = async () => {
    setLoadingOffer(true);
    const { data, error } = await sendOffer(offerId, access);

    if (!error) {
      setLoadingOffer(false);

      setActiveStep(2);
    } else {
      setLoadingOffer(false);

      alert(data);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          flexDirection: "column",
          gap: RFValue(40),
        }}
      >
        <View
          style={{
            flexDirection: "column",
            gap: RFValue(4),
          }}
        >
          <Text
            style={{
              color: black,
              fontWeight: "600",
              fontSize: RFValue(16),
              textAlign: isArabic ? "right" : "left",
            }}
          >
            {t("Choisissez une maison")}
          </Text>
        </View>
        <View
          style={{
            paddingHorizontal: RFValue(30),
            paddingVertical: RFValue(20),
            borderWidth: 1,
            borderColor: "#00000024",
            backgroundColor: "#F9F9F9",
            borderRadius: 4,
          }}
        >
          <View
            style={{
              position: "relative",
              alignItems: "baseline",
            }}
          >
            <View style={{ position: "relative" }}>
              <Text style={{ fontSize: RFValue(40), fontWeight: "bold" }}>
                {total}
              </Text>

              <Text
                style={{
                  position: "absolute",
                  fontSize: RFValue(14),
                  right: 0,
                  bottom: 0,
                  transform: [
                    {
                      translateX: 50,
                    },
                  ],
                }}
              >
                DZD
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: "column",
            gap: RFValue(25),
          }}
        >
          <Text
            style={{
              fontSize: RFValue(12),
              fontWeight: "600",
              textAlign: isArabic ? "right" : "left",
            }}
          >
            {t("Veuillez saisir le code promo")}
          </Text>

          <View
            style={{
              flexDirection: isArabic ? "row-reverse" : "row",
              alignItems: "flex-end",
              gap: RFValue(8),
              height: 45,
            }}
          >
            <View
              style={{
                flex: 1,
                height: 45,
              }}
            >
              <Input
                label=""
                placeholder={t("Code promo")}
                onChangeText={(text: string) => {
                  errors.codePromo !== null && handleError(null, "codePromo");
                  handleOnChange(text, "codePromo");
                }}
                error={errors.codePromo}
                onFocus={() => {
                  handleError(null, "codePromo");
                }}
              />
            </View>
            <Button
              style={{
                borderRadius: 4,
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "rgba(0, 0, 0, 0.1)",
                shadowOpacity: 0.8,
                elevation: 6,
                shadowRadius: 15,
                shadowOffset: { width: 1, height: 13 },
                flex: 0.8,
                backgroundColor: "white",
              }}
              mode="contained"
              buttonColor={white}
              onPress={() => {
                if (inputs.codePromo === "") {
                  return alert("Entre un code promo pour l'appliquer");
                } else {
                  applyCodePromo();
                }
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  gap: RFValue(4),
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="black" />
                ) : null}
                <Text
                  style={{
                    fontSize: RFValue(14),
                    color: "black",
                    fontWeight: "600",
                  }}
                >
                  {t("Appliquer")}
                </Text>
              </View>
            </Button>
          </View>
        </View>
      </View>
      <Button
        style={{
          borderRadius: 4,
          height: 45,
          justifyContent: "center",
        }}
        mode="contained"
        loading={loadingOffer}
        buttonColor={primary}
        onPress={() => {
          handleSendOffer();
        }}
      >
        <Text
          style={{
            fontSize: RFValue(14),
            color: "white",
            fontWeight: "600",
          }}
        >
          {t("Continue l'étape suivante")}
        </Text>
      </Button>
    </SafeAreaView>
  );
};

const Success = () => {
  const navigation = useRouter();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          gap: RFValue(25),
        }}
      >
        <Image
          style={{
            width: RFValue(80),
            height: RFValue(80),
            objectFit: "contain",
          }}
          source={require("@/assets/images/success.png")}
          alt="Fidarri"
        />
        <Text
          style={{
            textTransform: "capitalize",
            textAlign: "center",
            color: black,
            fontWeight: "600",
            fontSize: RFValue(16),
          }}
        >
          {t("votre demande a été soumise avec succès")}
        </Text>
        <Button
          style={{
            borderRadius: 4,
            height: 45,
            justifyContent: "center",
            borderWidth: 1,
            borderColor: primary,
          }}
          mode="contained"
          buttonColor={white}
          onPress={() => {
            navigation.push("/client/(tabs)");
          }}
        >
          <Text
            style={{
              fontSize: RFValue(14),
              color: primary,
              fontWeight: "600",
            }}
          >
            {t("Terminer")}
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default CreateOffer;
