import Input from "@/components/input";
import { primary } from "@/constants/Colors";
import {
  createClientReview,
  createFreelancerReview,
} from "@/graphql/services/freelancer.service";
import { useAuthStore } from "@/store/useAuthStore";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  View,
  Text,
  Keyboard,
  StatusBar,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import { Button } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import Stars from "react-native-stars";
import { useTranslation } from "react-i18next";
import AuthProvider from "@/components/authProvider";
import { useAuth } from "@/useAuth";
import KeyboardAvoidingViewWrapper from "@/components/keyboardAvoidingViewWrapper";

const Review = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const { role } = useAuthStore((state: any) => ({
    role: state.role,
  }));

  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const { access } = useAuthStore((state: any) => ({
    access: state.access,
  }));

  const [inputs, setInputs] = useState({
    review: "",
  });

  const [errors, setErrors] = useState({
    review: null,
  });

  const handleError = (errorMessage: string | null, input: string) => {
    setErrors((prevState) => ({ ...prevState, [input]: errorMessage }));
  };

  const handleOnChange = (text: string, input: string) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };

  const validate = useMemo(() => {
    return () => {
      Keyboard.dismiss();
      let valid = true;
      if (!inputs.review) {
        handleError(t("Ce champ est obligatoire"), "review");
        valid = false;
      }
      return valid;
    };
  }, [inputs]);

  const item: any = useLocalSearchParams();

  const handleAddReview = async (
    clientId: number,
    freelancerId: number,
    hiringId: number,
    review: string,
    rating: number
  ) => {
    setLoading(true);

    const { data, error } =
      role === "freelancer"
        ? await createClientReview(
            clientId,
            freelancerId,
            hiringId,
            rating,
            review,
            access
          )
        : await createFreelancerReview(
            clientId,
            freelancerId,
            hiringId,
            rating,
            review,
            access
          );
    if (error) {
      setLoading(false);
      alert(data);
    } else {
      setLoading(false);
      router.back();
    }
  };

  return (
    <AuthProvider>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "white" }}>
        <TouchableWithoutFeedback
          style={{ flex: 1 }}
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "white",
              paddingVertical: RFValue(60),
              gap: RFValue(60),
            }}
          >
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                gap: RFValue(60),
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "600",
                  fontSize: RFValue(22),
                  color: "#222222",
                }}
              >
                {t("Veuillez écrire Niveau de satisfaction global")}
              </Text>
              <Stars
                default={0}
                update={(val: any) => {
                  setRating(parseInt(val));
                }}
                spacing={4}
                starSize={40}
                count={5}
                fullStar={require("@/assets/images/filled-star.png")}
                emptyStar={require("@/assets/images/empty-star.png")}
              />
            </View>

            <View
              style={{
                flexDirection: "column",
                gap: RFValue(16),
                flex: 1,
                paddingHorizontal: RFValue(25),
              }}
            >
              <Input
                arabic={isArabic}
                multiline
                onChangeText={(text: string) => handleOnChange(text, "review")}
                placeholder={t("Write your review here")}
                label={t("Donnez votre avis")}
                error={errors.review}
                onFocus={() => {
                  handleError(null, "review");
                }}
              />
            </View>
            <View
              style={{
                paddingHorizontal: RFValue(40),
              }}
            >
              <Button
                style={{
                  borderRadius: 4,
                  height: 45,
                  justifyContent: "center",
                }}
                mode="contained"
                buttonColor={primary}
                loading={loading}
                onPress={() => {
                  const valid = validate();
                  if (!valid) return;
                  handleAddReview(
                    parseInt(item?.clientId),
                    parseInt(item?.freelancerId),
                    parseInt(item?.hiringId),
                    inputs?.review,
                    rating
                  );
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "white",
                    fontWeight: "600",
                  }}
                >
                  {t("Soumettre")}
                </Text>
              </Button>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </AuthProvider>
  );
};

export default Review;
