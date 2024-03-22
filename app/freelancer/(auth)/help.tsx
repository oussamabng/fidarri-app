import { useState } from "react";

import { View, Text, SafeAreaView, Image, Dimensions } from "react-native";
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from "accordion-collapse-react-native";
import { Linking } from "react-native";

import { black, primary, text2, white } from "@/constants/Colors";
import { RFValue } from "react-native-responsive-fontsize";
import { Feather } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";

const width = Dimensions.get("screen").width;

const Help = () => {
  const sendMail = () => {
    const email = "contact@fidarri.dz";
    const subject = encodeURIComponent("Subject Text");
    const body = encodeURIComponent("Body text here...");
    const url = `mailto:${email}?subject=${subject}&body=${body}`;

    Linking.openURL(url).catch((err) =>
      console.error("An error occurred", err)
    );
  };
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language == "ar";

  const [collapse, setCollapse] = useState([false, false, false, false, false]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flexDirection: "column",
            flex: 1,
            gap: RFValue(15),
          }}
        >
          <Text
            style={{
              fontSize: 28,
              color: black,
              fontWeight: "600",
              paddingHorizontal: RFValue(25),
              paddingVertical: RFValue(10),
              textAlign: isArabic ? "right" : "left",
            }}
          >
            {t("Centre d'aide fidarri")}
          </Text>
          <View
            style={{
              backgroundColor: primary,
              paddingHorizontal: RFValue(25),
              paddingVertical: RFValue(40),
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flexDirection: isArabic ? "row-reverse" : "row",
                gap: RFValue(20),
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  gap: RFValue(6),
                }}
              >
                <Text
                  style={{
                    fontWeight: "600",
                    fontSize: RFValue(24),
                    color: white,
                  }}
                >
                  {t("Salut,")}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: RFValue(14),
                    color: white,
                    maxWidth: width * 0.7,
                  }}
                >
                  {t("Comment nous pouvons vous aider ?")}
                </Text>
              </View>
              <Image
                source={require("@/assets/images/help.png")}
                style={{
                  width: 65,
                  height: 65,
                  resizeMode: "contain",
                }}
                alt="help"
              />
            </View>
          </View>
          <ScrollView
            style={{
              paddingHorizontal: RFValue(25),
            }}
          >
            <Text
              style={{
                fontSize: RFValue(18),
                color: black,
                fontWeight: "600",
                textAlign: isArabic ? "right" : "left",
              }}
            >
              {t("Questions fréquentes")}
            </Text>
            <View
              style={{
                flexDirection: "column",
                gap: RFValue(18),
                paddingVertical: RFValue(40),
              }}
            >
              <Collapse
                onToggle={(isExpanded: boolean) =>
                  setCollapse((prevState) => [
                    isExpanded,
                    prevState[1],
                    prevState[2],
                    prevState[3],
                    prevState[4],
                  ])
                }
                isExpanded={collapse[0]}
              >
                <CollapseHeader>
                  <View
                    style={{
                      flexDirection: isArabic ? "row-reverse" : "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "#555555",
                        fontSize: RFValue(14),
                        fontWeight: "500",
                        textAlign: isArabic ? "right" : "left",
                      }}
                    >
                      {t("Comment fonctionne la platform Fiddari?")}
                    </Text>
                    <Feather
                      name={
                        collapse[0]
                          ? "chevron-down"
                          : isArabic
                          ? "chevron-left"
                          : "chevron-right"
                      }
                      size={20}
                      color="#A1A1A1"
                    />
                  </View>
                </CollapseHeader>
                <CollapseBody>
                  <View
                    style={{
                      paddingVertical: RFValue(10),
                    }}
                  >
                    <Text
                      style={{
                        color: "#555555",
                        fontSize: RFValue(12),
                        textAlign: isArabic ? "right" : "left",
                      }}
                    >
                      {t("how_works")}
                    </Text>
                  </View>
                </CollapseBody>
              </Collapse>
              <Collapse
                onToggle={(isExpanded: boolean) =>
                  setCollapse((prevState) => [
                    prevState[0],
                    isExpanded,
                    prevState[2],
                    prevState[3],
                    prevState[4],
                  ])
                }
                isExpanded={collapse[0]}
              >
                <CollapseHeader>
                  <View
                    style={{
                      flexDirection: isArabic ? "row-reverse" : "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "#555555",
                        fontSize: RFValue(14),
                        fontWeight: "500",
                        textAlign: isArabic ? "right" : "left",
                      }}
                    >
                      {t(
                        "Quels types de services qui sont proposés sur Fiddari actuellement ?"
                      )}
                    </Text>
                    <Feather
                      name={
                        collapse[1]
                          ? "chevron-down"
                          : isArabic
                          ? "chevron-left"
                          : "chevron-right"
                      }
                      size={20}
                      color="#A1A1A1"
                    />
                  </View>
                </CollapseHeader>
                <CollapseBody>
                  <View
                    style={{
                      paddingVertical: RFValue(10),
                    }}
                  >
                    <Text
                      style={{
                        color: "#555555",
                        fontSize: RFValue(12),
                        textAlign: isArabic ? "right" : "left",
                      }}
                    >
                      {t("Garde malade")},{t("Femme de menage")}
                    </Text>
                  </View>
                </CollapseBody>
              </Collapse>
              <Collapse
                onToggle={(isExpanded: boolean) =>
                  setCollapse((prevState) => [
                    prevState[0],
                    prevState[1],
                    isExpanded,
                    prevState[3],
                    prevState[4],
                  ])
                }
                isExpanded={collapse[1]}
              >
                <CollapseHeader>
                  <View
                    style={{
                      flexDirection: isArabic ? "row-reverse" : "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "#555555",
                        fontSize: RFValue(14),
                        fontWeight: "500",
                        textAlign: isArabic ? "right" : "left",
                      }}
                    >
                      {t(
                        "Comment puis-je réserver un freelancer sur Fiddari ?"
                      )}
                    </Text>
                    <Feather
                      name={
                        collapse[2]
                          ? "chevron-down"
                          : isArabic
                          ? "chevron-left"
                          : "chevron-right"
                      }
                      size={20}
                      color="#A1A1A1"
                    />
                  </View>
                </CollapseHeader>
                <CollapseBody>
                  <View
                    style={{
                      paddingVertical: RFValue(10),
                      flexDirection: "column",
                      gap: RFValue(10),
                    }}
                  >
                    <Text
                      style={{
                        color: "#555555",
                        fontSize: RFValue(12),
                        textAlign: isArabic ? "right" : "left",
                      }}
                    >
                      {t(
                        "S'identifier avec un compte client ou créer un nouveau sur portail client  si vous avez pas."
                      )}
                    </Text>
                    <Text
                      style={{
                        color: "#555555",
                        fontSize: RFValue(12),
                        textAlign: isArabic ? "right" : "left",
                      }}
                    >
                      {t(
                        "Aller au portail main d’oeuvre et sélectionne le freelancer selon les besoins du filtre"
                      )}
                    </Text>
                    <Text
                      style={{
                        color: "#555555",
                        fontSize: RFValue(12),
                        textAlign: isArabic ? "right" : "left",
                      }}
                    >
                      {t("Cliquez sur le boutton Embocher")}
                    </Text>
                    <Text
                      style={{
                        color: "#555555",
                        fontSize: RFValue(12),
                        textAlign: isArabic ? "right" : "left",
                      }}
                    >
                      {t(
                        "Choisis une maison une date et service correspondant"
                      )}
                    </Text>
                    <Text
                      style={{
                        color: "#555555",
                        fontSize: RFValue(12),
                        textAlign: isArabic ? "right" : "left",
                      }}
                    >
                      {t("Cliquez sur le boutton Embocher")}
                    </Text>
                    <Text
                      style={{
                        color: "#555555",
                        fontSize: RFValue(12),
                        textAlign: isArabic ? "right" : "left",
                      }}
                    >
                      {t("Cliquez sur aller à l’étape suivante")}
                    </Text>
                    <Text
                      style={{
                        color: "#555555",
                        fontSize: RFValue(12),
                        textAlign: isArabic ? "right" : "left",
                      }}
                    >
                      {t(
                        "Appliquez le code coupon pour benificier une réduction sur le prix si c’est disponible"
                      )}
                    </Text>
                    <Text
                      style={{
                        color: "#555555",
                        fontSize: RFValue(12),
                        textAlign: isArabic ? "right" : "left",
                      }}
                    >
                      {t(
                        "En fin tu peut réserver le freelancer en cliquant sur confirmer et envoyer"
                      )}
                    </Text>
                    <Text
                      style={{
                        color: "#555555",
                        fontSize: RFValue(12),
                        textAlign: isArabic ? "right" : "left",
                      }}
                    >
                      {t(
                        "Suiver votre demande avec votre freelancer et felicitation !."
                      )}
                    </Text>
                  </View>
                </CollapseBody>
              </Collapse>
              <Collapse
                onToggle={(isExpanded: boolean) =>
                  setCollapse((prevState) => [
                    prevState[0],
                    prevState[1],
                    prevState[2],
                    isExpanded,
                    prevState[4],
                  ])
                }
                isExpanded={collapse[3]}
              >
                <CollapseHeader>
                  <View
                    style={{
                      flexDirection: isArabic ? "row-reverse" : "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "#555555",
                        fontSize: RFValue(14),
                        fontWeight: "500",
                        textAlign: isArabic ? "right" : "left",
                      }}
                    >
                      {t("Comment payer ?")}
                    </Text>
                    <Feather
                      name={
                        collapse[3]
                          ? "chevron-down"
                          : isArabic
                          ? "chevron-left"
                          : "chevron-right"
                      }
                      size={20}
                      color="#A1A1A1"
                    />
                  </View>
                </CollapseHeader>
                <CollapseBody>
                  <View
                    style={{
                      paddingVertical: RFValue(10),
                      flexDirection: "column",
                      gap: RFValue(10),
                    }}
                  >
                    <Text
                      style={{
                        color: "#555555",
                        fontSize: RFValue(12),
                        textAlign: isArabic ? "right" : "left",
                        paddingBottom: RFValue(6),
                      }}
                    >
                      {t(
                        "Le payment se faite deux fois ; enter le client et le freelancer ,et entre le freelancer et l'administration Fiddari."
                      )}
                    </Text>
                    <Text
                      style={{
                        color: primary,
                        fontSize: RFValue(13),
                        textAlign: isArabic ? "right" : "left",
                      }}
                    >
                      {t("Entre client et freelancer")}
                    </Text>
                    <Text
                      style={{
                        color: "#555555",
                        fontSize: RFValue(12),
                        textAlign: isArabic ? "right" : "left",
                      }}
                    >
                      {t(
                        "On note que le payment ce faite en cash entre le client el leur freelancer appropriée après que la mission terminé"
                      )}
                    </Text>
                    <Text
                      style={{
                        color: primary,
                        fontSize: RFValue(13),
                        textAlign: isArabic ? "right" : "left",
                      }}
                    >
                      {t("Entre le freelancer et l'administration FIDDARI")}
                    </Text>
                    <Text
                      style={{
                        color: "#555555",
                        fontSize: RFValue(12),
                        textAlign: isArabic ? "right" : "left",
                      }}
                    >
                      {t(
                        "Le payment est visionné en bref dans le module DÉPENSES après la connexion en tant que freelancer"
                      )}
                    </Text>
                    <Text
                      style={{
                        color: "#555555",
                        fontSize: RFValue(12),
                        textAlign: isArabic ? "right" : "left",
                      }}
                    >
                      {t(
                        "Dans la section ‘Factures hebdomadaire'les factures généré automatiquement par la platforme chaque semaine"
                      )}
                    </Text>
                    <Text
                      style={{
                        color: "#555555",
                        fontSize: RFValue(12),
                        textAlign: isArabic ? "right" : "left",
                      }}
                    >
                      {t(
                        "Le freelancer doit payer à l’administration FIDDARI 20% du totale généré pour chaque facture"
                      )}
                    </Text>
                    <Text
                      style={{
                        color: "#555555",
                        fontSize: RFValue(12),
                        textAlign: isArabic ? "right" : "left",
                      }}
                    >
                      {t(
                        "Si le totale à payer généré ne dépasse pas 500da ,la facture accumulé jusqu’à atteindre cette dernier seuil."
                      )}
                    </Text>
                    <Text
                      style={{
                        color: "#555555",
                        fontSize: RFValue(12),
                        textAlign: isArabic ? "right" : "left",
                      }}
                    >
                      {t(
                        "Si le totale à payer  généré dépasse 500da , le freelancer soumettre la facture pour payer par CCP ou par compte bancaire en envoi un reçu du transaction à l’administration FIDDARI."
                      )}
                    </Text>
                    <Text
                      style={{
                        color: "#555555",
                        fontSize: RFValue(12),
                        textAlign: isArabic ? "right" : "left",
                      }}
                    >
                      {t(
                        "Le freelancer ne doit pas dépasse un délai de 7 jours pour payer, sinon l’administration peut bloque le compte du concerné jusqu’il payer."
                      )}
                    </Text>
                    <Text
                      style={{
                        color: "#555555",
                        fontSize: RFValue(12),
                        textAlign: isArabic ? "right" : "left",
                      }}
                    >
                      {t(
                        "après que le freelancer paye avec succès il attend la validation par l’administration"
                      )}
                    </Text>
                    <Text
                      style={{
                        color: "#555555",
                        fontSize: RFValue(12),
                        textAlign: isArabic ? "right" : "left",
                      }}
                    >
                      {t(
                        "l’administration vérifie le reçu ccp/bancaire pour valider le payement."
                      )}
                    </Text>
                  </View>
                </CollapseBody>
              </Collapse>
              <Collapse
                onToggle={(isExpanded: boolean) =>
                  setCollapse((prevState) => [
                    prevState[0],
                    prevState[1],
                    prevState[2],
                    prevState[3],
                    isExpanded,
                  ])
                }
                isExpanded={collapse[4]}
              >
                <CollapseHeader>
                  <View
                    style={{
                      flexDirection: isArabic ? "row-reverse" : "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "#555555",
                        fontSize: RFValue(14),
                        fontWeight: "500",
                        textAlign: isArabic ? "right" : "left",
                      }}
                    >
                      {t(
                        "Que se passe-t-il si je dois modifier mes information?"
                      )}
                    </Text>
                    <Feather
                      name={
                        collapse[4]
                          ? "chevron-down"
                          : isArabic
                          ? "chevron-left"
                          : "chevron-right"
                      }
                      size={20}
                      color="#A1A1A1"
                    />
                  </View>
                </CollapseHeader>
                <CollapseBody>
                  <View
                    style={{
                      paddingVertical: RFValue(10),
                    }}
                  >
                    <Text
                      style={{
                        color: "#555555",
                        fontSize: RFValue(12),
                        textAlign: isArabic ? "right" : "left",
                      }}
                    >
                      {t(
                        "tu peut consulter et modifier votre infomation dans le module paramettre dans votre propre compte"
                      )}
                    </Text>
                  </View>
                </CollapseBody>
              </Collapse>
            </View>
            <View
              style={{
                flexDirection: "column",
                gap: RFValue(10),
              }}
            >
              <Text
                style={{
                  fontSize: RFValue(18),
                  fontWeight: "600",
                  color: black,
                  textAlign: isArabic ? "right" : "left",
                }}
              >
                {t("Besoin d'aide ?")}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: text2,
                  textAlign: isArabic ? "right" : "left",
                }}
              >
                {t("Vous ne trouvez pas la réponse que vous cherchez ?")}{" "}
                <Text
                  style={{
                    color: primary,
                    textDecorationLine: "underline",
                    textAlign: isArabic ? "right" : "left",
                  }}
                >
                  {t("Veuillez contacter notre équipe")}
                </Text>
              </Text>
            </View>
            <View
              style={{
                paddingVertical: RFValue(10),
              }}
            ></View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Help;
