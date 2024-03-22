import { useCallback, useMemo, useState } from "react";
import Input from "@/components/input";
import { primary } from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import { Image, Keyboard, TouchableOpacity, Platform } from "react-native";
import { Text, SafeAreaView, ScrollView, View, StatusBar } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import * as ImagePicker from "expo-image-picker";
import mime from "mime";
import { useTranslation } from "react-i18next";

import {
  getClientInformations,
  updateClientInformations,
  updateClientPicture,
} from "@/graphql/services/profile.service";
import { uploadFile } from "@/graphql/services/file.service";
import { useAuthStore } from "@/store/useAuthStore";
import Loading from "@/components/loading";
import { useProfileStore } from "@/store/useProfileStore";
import { checkUsernameAvailability } from "@/graphql/services/auth.service";
import AuthProvider from "@/components/authProvider";
import { useAuth } from "@/useAuth";

const ProfileDetailsInformations = () => {
  const { t, i18n } = useTranslation();

  const isArabic = i18n.language === "ar";

  const { data, updateNames } = useProfileStore((state: any) => ({
    data: state.data,
    updateNames: state.updateNames,
  }));

  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [photo, setPhoto] = useState(data.profilePictureUrl);

  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    username: "",
    phoneNumber: "",
    email: "",
  });
  const [errors, setErrors] = useState({
    firstName: null,
    lastName: null,
    username: null,
  });

  const validate = useMemo(() => {
    return () => {
      Keyboard.dismiss();
      let valid = true;

      if (!inputs.firstName) {
        handleError(t("Ce champ est obligatoire"), "firstName");
        valid = false;
      }
      if (!inputs.lastName) {
        handleError(t("Ce champ est obligatoire"), "lastName");
        valid = false;
      }
      if (!inputs.username) {
        handleError(t("Ce champ est obligatoire"), "username");
        valid = false;
      }

      return valid;
    };
  }, [inputs]);

  const handleError = (errorMessage: string | null, input: string) => {
    setErrors((prevState) => ({ ...prevState, [input]: errorMessage }));
  };

  const handleOnChange = (text: string, input: string) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };

  const { id, access } = useAuthStore((state: any) => ({
    id: state.id,
    access: state.access,
  }));

  const pickImage = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        return alert("Permission denied!");
      } else {
        let resultImage: any = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });

        if (!resultImage.canceled) {
          delete resultImage.cancelled;

          const fileName = resultImage.assets[0].uri.split("/").pop();
          const type = fileName.split(".").pop();
          const fileType = mime.getType(type);

          setPhoto(resultImage.assets[0].uri);

          const response = await uploadFile(
            resultImage.assets[0].uri,
            fileType,
            fileName
          );

          if (!response) {
            return alert("Error on uploading the image");
          }
          await updateClientPicture(id, access, response.full_url);
        }
      }
    }
  };

  const navigation = useRouter();

  const handleCheckUsername = async () => {
    const { error } = await checkUsernameAvailability(inputs.username);

    return error;
  };

  const handleUpdateProfile = async () => {
    setLoadingBtn(true);

    const { data: dataClient } = await getClientInformations(
      parseInt(id),
      access
    );

    if (dataClient?.username !== inputs.username) {
      const usernameExists = await handleCheckUsername();

      if (usernameExists) {
        handleError("Ce champ exist deja", "username");
        return setLoadingBtn(false);
      }
    }

    const { data, error } = await updateClientInformations(
      id,
      access,
      inputs.firstName,
      inputs.lastName,
      inputs.username
    );

    if (error) {
      setLoadingBtn(false);
      return alert(`Error : ${data}`);
    }

    updateNames(inputs.firstName, inputs.lastName, inputs.username);

    setLoadingBtn(false);
    setDisabled((prevState) => !prevState);
  };

  const fetchProfile = async () => {
    setPhoto(data.profilePictureUrl);
    setInputs({
      email: data.email,
      username: data.username,
      lastName: data.lastName,
      firstName: data.firstName,
      phoneNumber: data.phoneNumber,
    });
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [data])
  );

  if (loading) return <Loading size="small" title="" subtitle="" />;

  return (
    <AuthProvider>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "white",
        }}
      >
        <ScrollView bounces={false}>
          <KeyboardAwareScrollView>
            <View
              style={{
                paddingHorizontal: RFValue(25),
                flexDirection: "column",
                gap: RFValue(16),
              }}
            >
              <StatusBar barStyle={"dark-content"} />

              <View
                style={{
                  alignSelf: "center",
                }}
              >
                <Image
                  alt="avatar"
                  source={
                    photo
                      ? { uri: photo }
                      : require("@/assets/images/profile.png")
                  }
                  style={{
                    width: RFValue(125),
                    height: RFValue(125),
                    borderRadius: 999,
                    borderColor: primary,
                    borderWidth: 2,
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    pickImage();
                  }}
                  style={{
                    position: "absolute",
                    right: 0,
                    bottom: "5%",
                    width: RFValue(33),
                    height: RFValue(33),
                    borderRadius: 9999,
                    backgroundColor: primary,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MaterialIcons name="edit" color="white" size={20} />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: "column",
                  gap: RFValue(16),
                  paddingVertical: RFValue(20),
                }}
              >
                <Input
                  label={t("Nom")}
                  arabic={isArabic}
                  disabled={disabled}
                  disabledBg
                  value={inputs.firstName}
                  onChangeText={(text: string) =>
                    handleOnChange(text, "firstName")
                  }
                  error={errors.firstName}
                  onFocus={() => {
                    handleError(null, "firstName");
                  }}
                />
                <Input
                  label={t("Prénom")}
                  arabic={isArabic}
                  disabled={disabled}
                  disabledBg
                  value={inputs.lastName}
                  onChangeText={(text: string) =>
                    handleOnChange(text, "lastName")
                  }
                  error={errors.lastName}
                  onFocus={() => {
                    handleError(null, "lastName");
                  }}
                />
                <Input
                  label={t("Surnom")}
                  arabic={isArabic}
                  disabled={disabled}
                  disabledBg
                  value={inputs.username}
                  onChangeText={(text: string) =>
                    handleOnChange(text, "username")
                  }
                  error={errors.username}
                  onFocus={() => {
                    handleError(null, "username");
                  }}
                  autoCapitalize="none"
                />
                <Input
                  label={t("Adresse e-mail")}
                  arabic={isArabic}
                  disabled={true}
                  disabledBg
                  iconName="pencil-outline"
                  iconPosition={!disabled ? null : null}
                  value={inputs.email}
                  autoCapitalize="none"
                />
                <Input
                  label={t("Numéro téléphone")}
                  arabic={isArabic}
                  disabled={true}
                  disabledBg
                  iconName="pencil-outline"
                  iconPosition={
                    !disabled ? (isArabic ? "left" : "right") : null
                  }
                  value={inputs.phoneNumber}
                  onIconClick={() => {
                    navigation.push("/updatePhone");
                  }}
                />
                <Input
                  onIconClick={() => {
                    navigation.push("/client/(auth)/updatePassword");
                  }}
                  label={t("Mot de passe")}
                  disabled={true}
                  value="********"
                  disabledBg
                  arabic={isArabic}
                  iconName="pencil-outline"
                  iconPosition={
                    !disabled ? (isArabic ? "left" : "right") : null
                  }
                />
              </View>
              <View
                style={{
                  flexDirection: "column",
                  gap: RFValue(16),
                  paddingBottom: RFValue(40),
                }}
              >
                <Button
                  loading={loadingBtn}
                  style={{
                    borderRadius: 4,
                    height: 45,
                    justifyContent: "center",
                  }}
                  mode="contained"
                  buttonColor={primary}
                  onPress={() => {
                    if (disabled) {
                      setDisabled((prevState) => !prevState);
                    } else {
                      const validation = validate();

                      if (validation) {
                        handleUpdateProfile();
                      }
                    }
                  }}
                >
                  <Text
                    style={{
                      fontSize: RFValue(12),
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    {disabled ? t("Modifier le profile") : t("Sauvegarder")}
                  </Text>
                </Button>
                {disabled ? null : (
                  <Button
                    style={{
                      borderRadius: 4,
                      height: 45,
                      justifyContent: "center",
                    }}
                    mode="outlined"
                    buttonColor={"white"}
                    onPress={() => {
                      setDisabled((prevState) => !prevState);
                    }}
                  >
                    <Text
                      style={{
                        fontSize: RFValue(12),
                        color: "#6F6F6F",
                        fontWeight: "600",
                      }}
                    >
                      {t("Annuler")}
                    </Text>
                  </Button>
                )}
              </View>
            </View>
          </KeyboardAwareScrollView>
        </ScrollView>
      </SafeAreaView>
    </AuthProvider>
  );
};

export default ProfileDetailsInformations;
