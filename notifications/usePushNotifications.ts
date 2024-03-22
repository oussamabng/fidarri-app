import { useState, useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import Constants from "expo-constants";

import { Alert, Platform } from "react-native";
import { router, usePathname } from "expo-router";
import { useAuthStore } from "@/store/useAuthStore";
import {
  acceptOffer,
  completeHiring,
  createHiring,
  rejectOffer,
  startMission,
} from "@/graphql/services/freelancer.service";

export interface PushNotificationState {
  expoPushToken?: Notifications.ExpoPushToken;
  notification?: Notifications.Notification;
}

export const Actions = {
  ACCOUNT_ACTIVATION: 1,
  ACCOUNT_RESEND_ACTIVATION: 2,
  REQUEST_RESET_PASSWORD: 3,
  ACCEPT_IDENTIFICATION: 4,
  REFUSE_IDENTIFICATION: 5,
  ACCEPT_INTERVIEW: 6,
  REFUSE_INTERVIEW: 7,
  ACCOUNT_VERIFICATION_ACCEPTED: 8,
  ACCOUNT_VERIFICATION_REFUSED: 9,
  OFFER_SENT: 10,
  MISSION_ACCEPTED: 11,
  MISSION_REFUSED: 12,
  MISSION_STARTED: 13,
  MISSION_COMPLETED: 14,
  NEW_INVOICE: 15,
  NEW_FEEDBACK: 16,
  CONFIRM_START_MISSION: 17,
  CONFIRM_COMPLETE_MISSION: 18,
};

export const usePushNotifications = (): PushNotificationState => {
  const { access } = useAuthStore((state: any) => ({
    access: state.access,
  }));

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldShowAlert: true,
      shouldSetBadge: false,
    }),
  });

  const [expoPushToken, setExpoPushToken] = useState<any>();

  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >();

  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification");
        return;
      }

      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas.projectId,
      });
    } else {
      console.log("Must be using a physical device for Push notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }

  useEffect(() => {
    async function prepare() {
      const token = await registerForPushNotificationsAsync();
      setExpoPushToken(token);
      await Notifications.setNotificationCategoryAsync("OFFER_SENT", [
        {
          identifier: "OFFER_SENT_ACCEPT",
          buttonTitle: "Accepter ✅",
          options: {
            opensAppToForeground: false,
          },
        },
        {
          identifier: "OFFER_SENT_REJECT",
          buttonTitle: "Rejeter ⛔️",
          options: {
            opensAppToForeground: false,
          },
        },
      ]);

      await Notifications.setNotificationCategoryAsync("MISSION_STARTED", [
        {
          identifier: "MISSION_STARTED_VALIDATION",
          buttonTitle: "Valider ✅",
          options: {
            opensAppToForeground: false,
          },
        },
      ]);

      await Notifications.setNotificationCategoryAsync("MISSION_COMPLETED", [
        {
          identifier: "MISSION_COMPLETED_END_VALIDATION",
          buttonTitle: "Confirmation de fin ✅",
          options: {
            opensAppToForeground: false,
          },
        },
      ]);
    }

    prepare();
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(
        async (response) => {
          const actionIdentifier = response.actionIdentifier;

          const data = response.notification.request.content.data;
          const action = data?.action;

          const role = data?.role;
          const id = +data?.id;
          const isFreelancer = role === "freelancer";

          switch (actionIdentifier) {
            case "OFFER_SENT_ACCEPT":
              console.log("OFFER_SENT_ACCEPT");
              const { data, error } = await acceptOffer(id, access);

              if (error) {
                return Alert.alert("Error", data);
              } else {
                await createHiring(id, access);
                router.push({
                  pathname: "/freelancer/missions",
                });
              }

              break;
            case "OFFER_SENT_REJECT":
              console.log("OFFER_SENT_REJECT");
              await rejectOffer(id, access);
              router.push({
                pathname: "/freelancer/missions",
              });
              break;
            case "MISSION_STARTED_VALIDATION":
              console.log("MISSION_STARTED_VALIDATION");
              await startMission(id, access);
              router.push({
                pathname: "/client/offers",
                params: {
                  activeStatus: "PENDING",
                },
              });
              break;
            case "MISSION_COMPLETED_END_VALIDATION":
              console.log("MISSION_COMPLETED_END_VALIDATION");
              await completeHiring(id, access);
              router.push({
                pathname: "/client/offers",
                params: {
                  activeStatus: "COMPLETED",
                },
              });
              break;
            case "expo.modules.notifications.actions.DEFAULT":
              console.log("expo.modules.notifications.actions.DEFAULT");
              if (isFreelancer) {
                if (access && access.length > 0) {
                  switch (action) {
                    case Actions.OFFER_SENT:
                      router.push({
                        pathname: "/freelancer/missions",
                        params: {
                          activeStatus: "PENDING",
                        },
                      });
                      break;
                    case Actions.CONFIRM_START_MISSION:
                      router.push({
                        pathname: "/freelancer/missions",
                        params: {
                          activeStatus: "COMPLETED",
                        },
                      });
                      break;
                    case Actions.CONFIRM_COMPLETE_MISSION:
                      router.push({
                        pathname: "/freelancer/missions",
                        params: {
                          activeStatus: "COMPLETED",
                        },
                      });
                      break;
                    case Actions.NEW_INVOICE:
                      router.push({
                        pathname: "/freelancer/invoices",
                      });
                      break;

                    case Actions.NEW_FEEDBACK:
                      router.push({
                        pathname: "/reviews",
                      });
                      break;
                  }
                } else {
                  switch (action) {
                    case Actions.ACCEPT_IDENTIFICATION:
                      router.push({
                        pathname: "/freelancer/(auth)/interview",
                      });
                      break;

                    case Actions.ACCEPT_INTERVIEW:
                      router.push({
                        pathname: "/freelancer/(auth)/waitingOnBoarding",
                      });
                      break;
                    case Actions.ACCOUNT_VERIFICATION_ACCEPTED:
                      router.push({
                        pathname: "/freelancer/(tabs)",
                      });
                      break;
                  }
                }
                break;
              } else {
                if (access && access.length > 0) {
                  switch (action) {
                    case Actions.MISSION_ACCEPTED:
                      router.push({
                        pathname: "/client/offers",
                        params: {
                          activeStatus: "MULTIPLE",
                        },
                      });
                      break;

                    case Actions.NEW_FEEDBACK:
                      router.push({
                        pathname: "/reviews",
                      });
                      break;
                    case Actions.MISSION_REFUSED:
                      router.push({
                        pathname: "/client/offers",
                        params: {
                          activeStatus: "MULTIPLE",
                        },
                      });
                      break;
                    case Actions.MISSION_STARTED:
                      router.push({
                        pathname: "/client/offers",
                        params: {
                          activeStatus: "PENDING",
                        },
                      });
                      break;
                    case Actions.MISSION_COMPLETED:
                      router.push({
                        pathname: "/client/offers",
                        params: {
                          activeStatus: "PENDING",
                        },
                      });
                      break;
                  }
                }
                break;
              }
          }
        }
      );

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current!
      );

      Notifications.removeNotificationSubscription(responseListener.current!);
    };
  }, []);

  return {
    expoPushToken,
    notification,
  };
};
