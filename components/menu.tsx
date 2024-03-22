import { primary, text4, text5 } from "@/constants/Colors";
import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  Image,
  Animated,
  Pressable,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMenuStore } from "@/store/useMenuStore";
import { RFValue } from "react-native-responsive-fontsize";
import { useFocusEffect, useRouter } from "expo-router";
import { Button, Modal, Portal } from "react-native-paper";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileStore } from "@/store/useProfileStore";
import { useSearchStore } from "@/store/useSearchStore";
import { useRegisterStore } from "@/store/useRegisterStore";
import { useTranslation } from "react-i18next";
import { logoutUser } from "@/graphql/services/auth.service";
import { usePushNotifications } from "@/notifications/usePushNotifications";
import { useQuery, useSubscription } from "@apollo/client";
import {
  NUMBER_OF_NOTIFS,
  NUMBER_OF_NOTIFS_SUB,
} from "@/graphql/queries/freelancers.query";
import { getNotifsNumber } from "@/graphql/services/freelancer.service";

const Menu = (props: any) => {
  const { t, i18n } = useTranslation();

  const { data } = useProfileStore((state: any) => ({
    data: state.data,
  }));

  const { opened, update } = useMenuStore((state: any) => ({
    opened: state.opened,
    update: state.update,
  }));

  const { update: updateSearch } = useSearchStore((state: any) => ({
    update: state.update,
  }));

  const { logout, role, access, id } = useAuthStore((state: any) => ({
    logout: state.logout,
    role: state.role,
    access: state.access,
    id: state.id,
  }));

  const { clear } = useProfileStore((state: any) => ({
    clear: state.clear,
  }));

  const { clearAll } = useRegisterStore((state: any) => ({
    clearAll: state.clearAll,
  }));

  const { expoPushToken } = usePushNotifications();

  const [logoutOpened, setLogoutOpened] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const modalOpacity = useRef(new Animated.Value(0)).current;
  const modalY = useRef(new Animated.Value(0)).current;
  const offsetValue = useRef(new Animated.Value(0)).current;
  const scaleBtn = useRef(new Animated.Value(1)).current;
  const closeBtnOffset = useRef(new Animated.Value(0)).current;
  const opacityMenu = useRef(new Animated.Value(0)).current;
  const translateMenu = useRef(new Animated.Value(0)).current;

  const SCREEN_HEIGHT = Dimensions.get("screen").height;
  const SCREEN_WIDTH = Dimensions.get("screen").width;

  const logoutPressed = () => {
    Animated.timing(modalOpacity, {
      toValue: !logoutOpened ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(modalY, {
      toValue: !logoutOpened ? -20 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setLogoutOpened((prevState) => !prevState);
  };

  const menuPressed = () => {
    Animated.timing(scaleBtn, {
      toValue: opened ? 1 : 0.88,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(opacityMenu, {
      toValue: opened ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(translateMenu, {
      toValue: opened ? (i18n.language === "ar" ? 300 : -300) : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(offsetValue, {
      toValue: opened ? 0 : i18n.language === "ar" ? -320 : 320,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(closeBtnOffset, {
      toValue: opened ? 0 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    update(!opened);
  };
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
  const navigation = useRouter();

  const {
    data: subData,
    loading: subLoading,
    error,
  } = useSubscription(NUMBER_OF_NOTIFS_SUB, {
    variables: { userId: +id },
  });

  const checkSubscription = async () => {
    const { data } = await getNotifsNumber(access);
    if (subData && !subLoading && !error && data > 0) {
      setShowNotification(true);
    }
  };

  const checkNotifications = async () => {
    const { data } = await getNotifsNumber(access);
    if (!subData && subLoading && !error && data > 0) {
      setShowNotification(true);
    }
  };

  useFocusEffect(
    useCallback(() => {
      checkSubscription();
    }, [subData])
  );

  useFocusEffect(
    useCallback(() => {
      checkNotifications();
    }, [])
  );

   const handleLogoutUser = async () => {
    await logoutUser(access, String(expoPushToken?.data));
    logout();
    clear();
    clearAll();
    updateSearch(false);
    navigation.replace("/login");
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: primary,
        alignItems: i18n.language === "ar" ? "flex-end" : "flex-start",
        justifyContent: "flex-start",
      }}
    >
      <Animated.View
        style={{
          position: "absolute",
          flexGrow: 1,
          backgroundColor: "white",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 100,
          transform: [
            {
              scale: scaleBtn,
            },
            {
              translateX: offsetValue,
            },
          ],
          borderRadius: opened ? 15 : 0,
        }}
      >
        <StatusBar barStyle={opened ? "light-content" : "dark-content"} />

        <Portal>
          <Modal
            visible={logoutOpened}
            onDismiss={() => {}}
            contentContainerStyle={{
              flexGrow: 1,
            }}
          >
            <Animated.View
              style={{
                backgroundColor: "white",
                borderRadius: 10,
                position: "absolute",
                zIndex: 99999999,
                top: SCREEN_HEIGHT / 2,
                left: 25,
                right: 25,
                flexGrow: 1,
                opacity: modalOpacity,
                transform: [
                  {
                    translateY: modalY,
                  },
                ],
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  gap: RFValue(16),
                  paddingVertical: RFValue(40),
                  paddingHorizontal: RFValue(25),
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: RFValue(12),
                    color: "#15192080",
                  }}
                >
                  {t(
                    "êtes-vous sûr de vouloir vous déconnecter de votre compte ?"
                  )}
                </Text>

                <Button
                  style={{
                    borderRadius: 4,
                    height: 45,
                    justifyContent: "center",
                    marginTop: RFValue(20),
                  }}
                  mode="contained"
                  buttonColor={primary}
                  onPress={handleLogoutUser}
                >
                  <Text
                    style={{
                      fontSize: RFValue(14),
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    {t("Se déconnecter")}
                  </Text>
                </Button>
                <Button
                  style={{
                    borderRadius: 4,
                    height: 45,
                    justifyContent: "center",
                  }}
                  mode="outlined"
                  buttonColor={"white"}
                  onPress={logoutPressed}
                >
                  <Text
                    style={{
                      fontSize: RFValue(14),
                      color: "#6F6F6F",
                      fontWeight: "600",
                    }}
                  >
                    {t("Annuler")}
                  </Text>
                </Button>
              </View>
            </Animated.View>
          </Modal>
        </Portal>
        <Animated.View
          style={{
            position: "relative",
            flexGrow: 1,
            paddingBottom: RFValue(50),
            transform: [
              {
                translateY: closeBtnOffset,
              },
            ],
          }}
        >
          {opened && (
            <AnimatedPressable
              style={{
                position: "absolute",
                flexGrow: 1,
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 200,
              }}
              onPress={menuPressed}
            ></AnimatedPressable>
          )}
          <View
            style={{
              paddingTop: RFValue(40),
              paddingBottom: RFValue(10),
              flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottomColor: "#E0E1E4",
              borderBottomWidth: 0.4,
            }}
          >
            <View
              style={{
                paddingHorizontal: RFValue(25),
                flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
                alignItems: "center",
                gap: RFValue(15),
              }}
            >
              <Pressable onPress={menuPressed}>
                <Image
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 999,
                    borderColor: primary,
                    borderWidth: 2,
                  }}
                  source={
                    data.profilePictureUrl
                      ? { uri: data.profilePictureUrl }
                      : require("@/assets/images/profile.png")
                  }
                />
              </Pressable>

              <View
                style={{
                  flexDirection: "column",
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: RFValue(10),
                    color: text5,
                    textAlign: i18n.language === "ar" ? "right" : "left",
                  }}
                >
                  {t("Adresse du Domicile")}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: RFValue(12),
                    fontWeight: "500",
                    color: "#393F42",
                    width: 180,
                    textAlign: i18n.language === "ar" ? "right" : "left",
                  }}
                >
                  {data.adr ?? "no address"}
                </Text>
              </View>
            </View>
            <Pressable
              onPress={() => {
                navigation.push("/notifications");
                setTimeout(() => {
                  setShowNotification(false);
                }, 500);
              }}
            >
              <View
                style={{
                  paddingHorizontal: 25,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    top: "-10%",
                    right: "120%",
                    width: 6,
                    height: 6,
                    backgroundColor: showNotification ? "red" : "transparent",
                    borderRadius: 9999,
                  }}
                ></View>
                <MaterialIcons
                  name="notifications-none"
                  size={20}
                  color={text4}
                />
              </View>
            </Pressable>
          </View>
          {props.children}
        </Animated.View>
      </Animated.View>
      <Animated.View
        style={{
          paddingHorizontal: 25,
          paddingTop: SCREEN_HEIGHT / 6,
          paddingBottom: SCREEN_HEIGHT / 6,
          flexDirection: "column",
          gap: 50,
          flex: 1,
          opacity: opacityMenu,
          transform: [
            {
              translateX: translateMenu,
            },
          ],
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 24,
            fontWeight: "600",
            textAlign: i18n.language === "ar" ? "right" : "left",
          }}
        >
          {t("Menu")}
        </Text>
        <View
          style={{
            gap: 30,
            flexGrow: 1,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setTimeout(() => {
                menuPressed();
              }, 500);
              if (role === "client") {
                navigation.push("/client/profile");
              } else {
                navigation.push("/freelancer/profile");
              }
            }}
            style={{
              flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
              gap: 12,
              alignItems: "center",
            }}
          >
            <Feather name="user" size={20} color={"white"} />
            <Text
              style={{
                fontWeight: "500",
                fontSize: RFValue(14),
                color: "white",
                textAlign: i18n.language === "ar" ? "right" : "left",
              }}
            >
              {t("Mon profile")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setTimeout(() => {
                menuPressed();
              }, 500);
              navigation.push("/freelancer/settings");
            }}
            style={{
              flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
              gap: 12,
              alignItems: "center",
            }}
          >
            <Feather name="settings" size={20} color={"white"} />
            <Text
              style={{
                fontWeight: "500",
                fontSize: RFValue(14),
                color: "white",
                textAlign: i18n.language === "ar" ? "right" : "left",
              }}
            >
              {t("Paramètres")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setTimeout(() => {
                menuPressed();
              }, 500);
              navigation.push("/freelancer/(auth)/help");
            }}
            style={{
              flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
              gap: 12,
              alignItems: "center",
            }}
          >
            <Feather name="help-circle" size={20} color={"white"} />
            <Text
              style={{
                fontWeight: "500",
                fontSize: RFValue(14),
                color: "white",
                textAlign: i18n.language === "ar" ? "right" : "left",
              }}
            >
              {t("Centre d'aide")}
            </Text>
          </TouchableOpacity>

          {role !== "client" && (
            <TouchableOpacity
              onPress={() => {
                setTimeout(() => {
                  menuPressed();
                }, 500);
                navigation.push("/freelancer/invoices");
              }}
              style={{
                flexDirection: i18n.language === "ar" ? "row-reverse" : "row",

                gap: 12,
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons
                name="package-variant-closed"
                size={20}
                color={"white"}
              />
              <Text
                style={{
                  fontWeight: "500",
                  fontSize: RFValue(14),
                  color: "white",
                  textAlign: i18n.language === "ar" ? "right" : "left",
                }}
              >
                {t("Mes factures")}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          onPress={() => {
            menuPressed();
            setTimeout(() => {
              logoutPressed();
            }, 150);
          }}
          style={{
            flexDirection: i18n.language === "ar" ? "row-reverse" : "row",

            gap: 12,
            alignItems: "center",
          }}
        >
          <MaterialIcons name="logout" size={20} color={"white"} />
          <Text
            style={{
              fontWeight: "500",
              fontSize: RFValue(14),
              color: "white",
              textAlign: i18n.language === "ar" ? "right" : "left",
            }}
          >
            {t("Se déconnecter")}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

export default Menu;
