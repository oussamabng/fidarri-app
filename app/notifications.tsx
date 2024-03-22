import {
  View,
  Text,
  FlatList,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { RFValue } from "react-native-responsive-fontsize";
import { black, primary } from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import {
  getNotifications,
  markAsSeen,
} from "@/graphql/services/freelancer.service";
import Loading from "@/components/loading";
import { useAuthStore } from "@/store/useAuthStore";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import "dayjs/locale/ar";

const formatDate = (createdAt: any, language: string) => {
  dayjs.locale(language); // Set the locale based on the language variable
  const date = dayjs(createdAt);
  const now = dayjs();

  if (date.isSame(now, "day")) {
    // For today, show time in 12-hour format with AM/PM
    return date.format("hh:mm A");
  } else if (date.isSame(now.subtract(1, "day"), "day")) {
    // For yesterday, depending on the language
    if (language === "ar") {
      return "أمس";
    } else if (language === "fr") {
      return "Hier";
    } else {
      return "Yesterday";
    }
  } else if (date.isSame(now, "week")) {
    // For this week, show day of the week
    return date.format("ddd");
  } else {
    // For older dates, show 'MMM D'
    return date.format("MMM D");
  }
};

const getTitleSubtitle = (userRole: any, enumValue: any, lang?: string) => {
  const titles: any = {
    freelancer: {
      OFFER_SENT: {
        title: "Offre Soumise",
        subtitle: "Votre offre a été envoyée au client pour examen.",
      },
      MISSION_ACCEPTED: {
        title: "Mission Acceptée",
        subtitle:
          "Votre offre a été acceptée par le client. Il est temps de commencer le travail!",
      },
      MISSION_REFUSED: {
        title: "Mission Refusée",
        subtitle:
          "Le client a refusé votre offre. Vérifiez les mises à jour possibles ou les nouvelles opportunités.",
      },
      MISSION_STARTED: {
        title: "Mission Commencée",
        subtitle:
          "Vous avez commencé la mission. Tenez le client informé de votre progression.",
      },
      MISSION_COMPLETED: {
        title: "Mission Accomplie",
        subtitle:
          "Vous avez terminé la mission. En attente de la révision du client.",
      },
      NEW_INVOICE: {
        title: "Nouvelle Facture Générée",
        subtitle:
          "Vous avez émis une nouvelle facture au client pour la mission accomplie.",
      },
      ACCEPT_IDENTIFICATION: {
        title: "Identification Acceptée",
        subtitle: "Votre identification a été acceptée.",
      },
      REFUSE_IDENTIFICATION: {
        title: "Identification Refusée",
        subtitle: "Votre identification a été refusée.",
      },
      ACCEPT_INTERVIEW: {
        title: "Entretien Accepté",
        subtitle: "Vous avez accepté une demande d'entretien.",
      },
      REFUSE_INTERVIEW: {
        title: "Entretien Refusé",
        subtitle: "Vous avez refusé une demande d'entretien.",
      },
      ACCOUNT_ACTIVATION: {
        title: "Activation du Compte",
        subtitle: "Votre compte a été activé avec succès.",
      },
      ACCOUNT_RESEND_ACTIVATION: {
        title: "Renvoi d'Activation du Compte",
        subtitle: "Un nouveau mail d'activation a été envoyé.",
      },
      REQUEST_RESET_PASSWORD: {
        title: "Demande de Réinitialisation du Mot de Passe",
        subtitle:
          "Une demande pour réinitialiser votre mot de passe a été effectuée.",
      },
      ACCOUNT_VERIFICATION_ACCEPTED: {
        title: "Vérification du Compte Acceptée",
        subtitle: "Votre compte a été vérifié avec succès.",
      },
      ACCOUNT_VERIFICATION_REFUSED: {
        title: "Vérification du Compte Refusée",
        subtitle: "La vérification de votre compte a été refusée.",
      },
      CONFIRM_START_MISSION: {
        title: "Confirmation de Début de Mission",
        subtitle: "Vous avez confirmé le début de la mission.",
      },
      CONFIRM_COMPLETE_MISSION: {
        title: "Confirmation de Fin de Mission",
        subtitle: "Vous avez confirmé la fin de la mission.",
      },
      NEW_FEEDBACK: {
        title: "Nouveau Feedback",
        subtitle: "Vous avez reçu un nouveau feedback.",
      },
    },
    client: {
      OFFER_SENT: {
        title: "Nouvelle Offre Reçue",
        subtitle:
          "Un freelance vous a envoyé une offre. Veuillez la consulter.",
      },
      MISSION_ACCEPTED: {
        title: "Offre Acceptée",
        subtitle:
          "Vous avez accepté l'offre du freelance. Il commencera bientôt la mission.",
      },
      MISSION_REFUSED: {
        title: "Offre Refusée",
        subtitle:
          "Vous avez refusé l'offre du freelance. N'hésitez pas à examiner d'autres propositions.",
      },
      MISSION_STARTED: {
        title: "Mission Commencée par le Freelance",
        subtitle:
          "Le freelance a commencé le travail sur votre mission. Restez à l'écoute pour les mises à jour.",
      },
      MISSION_COMPLETED: {
        title: "Mission Accomplie par le Freelance",
        subtitle:
          "Le freelance a soumis son travail terminé. Veuillez le passer en revue et confirmer.",
      },
      ACCOUNT_ACTIVATION: {
        title: "Activation du Compte",
        subtitle: "Votre compte a été activé avec succès.",
      },
      ACCOUNT_RESEND_ACTIVATION: {
        title: "Renvoi d'Activation du Compte",
        subtitle: "Un nouveau mail d'activation a été envoyé.",
      },
      REQUEST_RESET_PASSWORD: {
        title: "Demande de Réinitialisation du Mot de Passe",
        subtitle:
          "Une demande pour réinitialiser votre mot de passe a été effectuée.",
      },
      ACCOUNT_VERIFICATION_ACCEPTED: {
        title: "Vérification du Compte Acceptée",
        subtitle: "Votre compte a été vérifié avec succès.",
      },
      ACCOUNT_VERIFICATION_REFUSED: {
        title: "Vérification du Compte Refusée",
        subtitle: "La vérification de votre compte a été refusée.",
      },
      NEW_FEEDBACK: {
        title: "Nouveau Feedback",
        subtitle: "Vous avez reçu un nouveau feedback.",
      },
    },
  };

  const titles2: any = {
    freelancer: {
      OFFER_SENT: {
        title: "Offer Submitted",
        subtitle: "Your offer has been sent to the client for review.",
      },
      MISSION_ACCEPTED: {
        title: "Mission Accepted",
        subtitle:
          "Your offer has been accepted by the client. Time to start the work!",
      },
      MISSION_REFUSED: {
        title: "Mission Refused",
        subtitle:
          "The client has refused your offer. Check for possible updates or new opportunities.",
      },
      MISSION_STARTED: {
        title: "Mission Started",
        subtitle:
          "You have started the mission. Keep the client informed of your progress.",
      },
      MISSION_COMPLETED: {
        title: "Mission Completed",
        subtitle: "You have completed the mission. Awaiting client review.",
      },
      NEW_INVOICE: {
        title: "New Invoice Generated",
        subtitle:
          "You have issued a new invoice to the client for the completed mission.",
      },
      ACCEPT_IDENTIFICATION: {
        title: "Identification Accepted",
        subtitle: "Your identification has been accepted.",
      },
      REFUSE_IDENTIFICATION: {
        title: "Identification Refused",
        subtitle: "Your identification has been refused.",
      },
      ACCEPT_INTERVIEW: {
        title: "Interview Accepted",
        subtitle: "You have accepted an interview request.",
      },
      REFUSE_INTERVIEW: {
        title: "Interview Refused",
        subtitle: "You have refused an interview request.",
      },
      ACCOUNT_ACTIVATION: {
        title: "Account Activation",
        subtitle: "Your account has been successfully activated.",
      },
      ACCOUNT_RESEND_ACTIVATION: {
        title: "Account Activation Resend",
        subtitle: "A new activation email has been sent.",
      },
      REQUEST_RESET_PASSWORD: {
        title: "Password Reset Request",
        subtitle: "A request to reset your password has been made.",
      },
      ACCOUNT_VERIFICATION_ACCEPTED: {
        title: "Account Verification Accepted",
        subtitle: "Your account has been successfully verified.",
      },
      ACCOUNT_VERIFICATION_REFUSED: {
        title: "Account Verification Refused",
        subtitle: "The verification of your account has been refused.",
      },
      CONFIRM_START_MISSION: {
        title: "Mission Start Confirmation",
        subtitle: "You have confirmed the start of the mission.",
      },
      CONFIRM_COMPLETE_MISSION: {
        title: "Mission Completion Confirmation",
        subtitle: "You have confirmed the completion of the mission.",
      },
      NEW_FEEDBACK: {
        title: "New Feedback",
        subtitle: "You have received a new feedback.",
      },
    },
    client: {
      OFFER_SENT: {
        title: "New Offer Received",
        subtitle: "A freelancer has sent you an offer. Please review it.",
      },
      MISSION_ACCEPTED: {
        title: "Offer Accepted",
        subtitle:
          "You have accepted the freelancer's offer. They will start the mission soon.",
      },
      MISSION_REFUSED: {
        title: "Offer Refused",
        subtitle:
          "You have refused the freelancer's offer. Feel free to review other proposals.",
      },
      MISSION_STARTED: {
        title: "Mission Started by Freelancer",
        subtitle:
          "The freelancer has started work on your mission. Stay tuned for updates.",
      },
      MISSION_COMPLETED: {
        title: "Mission Completed by Freelancer",
        subtitle:
          "The freelancer has submitted their completed work. Please review it and confirm.",
      },
      ACCOUNT_ACTIVATION: {
        title: "Account Activation",
        subtitle: "Your account has been successfully activated.",
      },
      ACCOUNT_RESEND_ACTIVATION: {
        title: "Account Activation Resend",
        subtitle: "A new activation email has been sent.",
      },
      REQUEST_RESET_PASSWORD: {
        title: "Password Reset Request",
        subtitle: "A request to reset your password has been made.",
      },
      ACCOUNT_VERIFICATION_ACCEPTED: {
        title: "Account Verification Accepted",
        subtitle: "Your account has been successfully verified.",
      },
      ACCOUNT_VERIFICATION_REFUSED: {
        title: "Account Verification Refused",
        subtitle: "The verification of your account has been refused.",
      },
      NEW_FEEDBACK: {
        title: "New Feedback",
        subtitle: "You have received a new feedback.",
      },
    },
  };

  const titles3: any = {
    freelancer: {
      OFFER_SENT: {
        title: "العرض المقدم",
        subtitle: "تم إرسال عرضك إلى العميل للمراجعة.",
      },
      MISSION_ACCEPTED: {
        title: "المهمة مقبولة",
        subtitle: "تم قبول عرضك من قبل العميل. حان وقت بدء العمل!",
      },
      MISSION_REFUSED: {
        title: "المهمة مرفوضة",
        subtitle:
          "رفض العميل عرضك. تحقق من التحديثات الممكنة أو الفرص الجديدة.",
      },
      MISSION_STARTED: {
        title: "بدأت المهمة",
        subtitle: "لقد بدأت المهمة. أبقِ العميل مطلعًا على تقدمك.",
      },
      MISSION_COMPLETED: {
        title: "المهمة مكتملة",
        subtitle: "لقد أكملت المهمة. في انتظار مراجعة العميل.",
      },
      NEW_INVOICE: {
        title: "فاتورة جديدة مُنشأة",
        subtitle: "لقد أصدرت فاتورة جديدة للعميل للمهمة المكتملة.",
      },
      ACCEPT_IDENTIFICATION: {
        title: "الهوية مقبولة",
        subtitle: "تم قبول هويتك.",
      },
      REFUSE_IDENTIFICATION: {
        title: "الهوية مرفوضة",
        subtitle: "تم رفض هويتك.",
      },
      ACCEPT_INTERVIEW: {
        title: "المقابلة مقبولة",
        subtitle: "لقد قبلت طلب مقابلة.",
      },
      REFUSE_INTERVIEW: {
        title: "المقابلة مرفوضة",
        subtitle: "لقد رفضت طلب مقابلة.",
      },
      ACCOUNT_ACTIVATION: {
        title: "تفعيل الحساب",
        subtitle: "تم تفعيل حسابك بنجاح.",
      },
      ACCOUNT_RESEND_ACTIVATION: {
        title: "إعادة إرسال تفعيل الحساب",
        subtitle: "تم إرسال بريد إلكتروني جديد للتفعيل.",
      },
      REQUEST_RESET_PASSWORD: {
        title: "طلب إعادة تعيين كلمة المرور",
        subtitle: "تم تقديم طلب لإعادة تعيين كلمة المرور الخاصة بك.",
      },
      ACCOUNT_VERIFICATION_ACCEPTED: {
        title: "التحقق من الحساب مقبول",
        subtitle: "تم التحقق من حسابك بنجاح.",
      },
      ACCOUNT_VERIFICATION_REFUSED: {
        title: "التحقق من الحساب مرفوض",
        subtitle: "تم رفض التحقق من حسابك.",
      },
      CONFIRM_START_MISSION: {
        title: "تأكيد بدء المهمة",
        subtitle: "لقد أكدت بدء المهمة.",
      },
      CONFIRM_COMPLETE_MISSION: {
        title: "تأكيد إنهاء المهمة",
        subtitle: "لقد أكدت إنهاء المهمة.",
      },
      NEW_FEEDBACK: {
        title: "تعليق جديد",
        subtitle: "لقد تلقيت تعليقًا جديدًا.",
      },
    },
    client: {
      OFFER_SENT: {
        title: "عرض جديد مستلم",
        subtitle: "أرسل لك فريلانسر عرضًا. الرجاء مراجعته.",
      },
      MISSION_ACCEPTED: {
        title: "العرض مقبول",
        subtitle: "لقد قبلت عرض الفريلانسر. سيبدأ العمل على المهمة قريبًا.",
      },
      MISSION_REFUSED: {
        title: "العرض مرفوض",
        subtitle:
          "لقد رفضت عرض الفريلانسر. لا تتردد في مراجعة المقترحات الأخرى.",
      },
      MISSION_STARTED: {
        title: "المهمة بدأت من قبل الفريلانسر",
        subtitle: "بدأ الفريلانسر العمل على مهمتك. ابقَ على اطلاع للتحديثات.",
      },
      MISSION_COMPLETED: {
        title: "المهمة مكتملة من قبل الفريلانسر",
        subtitle: "قدم الفريلانسر عمله المكتمل. يرجى مراجعته والتأكيد.",
      },
      ACCOUNT_ACTIVATION: {
        title: "تفعيل الحساب",
        subtitle: "تم تفعيل حسابك بنجاح.",
      },
      ACCOUNT_RESEND_ACTIVATION: {
        title: "إعادة إرسال تفعيل الحساب",
        subtitle: "تم إرسال بريد إلكتروني جديد للتفعيل.",
      },
      REQUEST_RESET_PASSWORD: {
        title: "طلب إعادة تعيين كلمة المرور",
        subtitle: "تم تقديم طلب لإعادة تعيين كلمة المرور الخاصة بك.",
      },
      ACCOUNT_VERIFICATION_ACCEPTED: {
        title: "التحقق من الحساب مقبول",
        subtitle: "تم التحقق من حسابك بنجاح.",
      },
      ACCOUNT_VERIFICATION_REFUSED: {
        title: "التحقق من الحساب مرفوض",
        subtitle: "تم رفض التحقق من حسابك.",
      },
      NEW_FEEDBACK: {
        title: "تعليق جديد",
        subtitle: "لقد تلقيت تعليقًا جديدًا.",
      },
    },
  };

  if (
    userRole !== "freelancer" &&
    [
      "ACCEPT_IDENTIFICATION",
      "REFUSE_IDENTIFICATION",
      "ACCEPT_INTERVIEW",
      "REFUSE_INTERVIEW",
    ].includes(enumValue)
  ) {
    return {
      title: "Action Non Applicable",
      subtitle: "Cette action n'est pas applicable pour le rôle de client.",
    };
  }
  const finalTitles =
    lang === "fr"
      ? titles[userRole][enumValue]
      : lang === "en"
      ? titles2[userRole][enumValue]
      : titles3[userRole][enumValue];
  return finalTitles;
};

const NotificationCard: React.FC<{ item: any }> = ({ item }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const { role } = useAuthStore((state: any) => ({
    role: state.role,
  }));

  return (
    <View
      style={{
        flexDirection: isArabic ? "row-reverse" : "row",
        gap: RFValue(10),
        marginBottom: RFValue(10),
        paddingHorizontal: RFValue(25),
        marginTop: RFValue(20),
      }}
    >
      <Image
        style={{
          width: RFValue(30),
          height: RFValue(30),
          backgroundColor: "#F4F4F4",
          borderRadius: 9999,
        }}
        source={require("@/assets/images/fidarri.png")}
      />

      <View
        style={{
          flexDirection: "column",
          gap: RFValue(6),
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
          <Text
            style={{
              fontSize: RFValue(14),
              fontWeight: "500",
              color: "#242E42",
              textAlign: isArabic ? "right" : "left",
              paddingRight: RFValue(10),
              maxWidth: RFValue(180),
            }}
          >
            {getTitleSubtitle(role, item.action, i18n.language)?.title}
          </Text>
          <View
            style={{
              flexDirection: isArabic ? "row-reverse" : "row",
              gap: RFValue(10),
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: RFValue(10),
                fontWeight: "500",
                color: "#555",
                textAlign: isArabic ? "right" : "left",
              }}
            >
              {formatDate(item?.createdAt, i18n.language)}
            </Text>
          </View>
        </View>
        <Text
          numberOfLines={3}
          style={{
            fontSize: RFValue(12),
            color: "#A1A1A1",
            textAlign: isArabic ? "right" : "left",
          }}
        >
          {getTitleSubtitle(role, item.action, i18n.language)?.subtitle}
        </Text>
      </View>
    </View>
  );
};

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

const Notifications = () => {
  const { t, i18n } = useTranslation();

  const { access, id } = useAuthStore((state: any) => ({
    access: state.access,
    id: state.id,
  }));

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [hasNext, setHasNext] = useState(false);
  const [offset, setOffset] = useState(0);
  const LIMIT = 10;

  const fetchNotifications = async () => {
    const { data, error } = await getNotifications(access, 0, LIMIT + offset);
    console.log(id);

    if (error) {
      setLoading(false);
      Alert.alert("Erreur", data);
    } else {
      setData(data?.nodes);
      setHasNext(data?.hasNextPage);
      setOffset((prevState) => prevState + LIMIT);
      setLoading(false);
    }
  };

  const makeSeen = async () => {
    const { data, error } = await markAsSeen(null, access);

    console.log("SEEEN MAKING");
    console.log(data, error);
  };

  useEffect(() => {
    makeSeen();
    fetchNotifications();
  }, []);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <Text
        style={{
          paddingHorizontal: RFValue(25),
          paddingBottom: RFValue(10),
          fontSize: RFValue(26),
          color: black,
          textAlign: i18n.language === "ar" ? "right" : "left",
          fontWeight: "600",
        }}
      >
        {t("Notifications")}
      </Text>
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        {loading && <Loading size="small" title="" />}

        {data?.length > 0 && !loading && (
          <FlatList
            data={data}
            showsVerticalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => <NotificationCard item={item} />}
            onEndReachedThreshold={0}
            onEndReached={() => {
              hasNext && fetchNotifications();
            }}
            ListFooterComponent={
              data?.length > 0 ? (hasNext ? renderFooter : null) : null
            }
            ListEmptyComponent={() => (
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
            )}
          />
        )}

        {!loading && data?.length === 0 && (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: RFValue(25),
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
        )}
      </SafeAreaView>
    </View>
  );
};

export default Notifications;
