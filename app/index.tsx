import { StatusBar } from "react-native";
import React, { useEffect } from "react";
import Loading from "@/components/loading";
import NetInfo from "@react-native-community/netinfo";
import { router } from "expo-router";
import { useAuthStore } from "@/store/useAuthStore";
import { useAuth } from "@/useAuth";
import { usePushNotifications } from "@/notifications/usePushNotifications";

const Index = () => {
  const { role, access, status } = useAuthStore((state: any) => ({
    role: state.role,
    access: state.access,
    status: state.status,
  }));
  useEffect(() => {
    NetInfo.fetch().then((state) => {
      if (!state.isConnected) {
        return router.replace("/no-internet");
      } else {
        if (access) {
          if (role === "client") {
            router.replace("/client/(tabs)");
          } else {
            if (status === "Verified") {
              router.replace("/freelancer/(tabs)");
            } else {
              router.replace("/login");
            }
          }
        } else {
          router.replace("/login");
        }
      }
    });
  }, []);
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Loading size="small" />
    </>
  );
};

export default Index;
