import { useState, useEffect, useCallback } from "react";

//jwt
import jwt from "jwt-decode";
import { refreshToken } from "./graphql/services/auth.service";
import { useAuthStore } from "./store/useAuthStore";
import { useFocusEffect } from "expo-router";

export const useAuth = () => {
  const {
    access,
    refresh,
    updateToken,
    logout: logoutUser,
  } = useAuthStore((state: any) => ({
    access: state.access,
    refresh: state.refresh,
    updateToken: state.updateToken,
    logout: state.logout,
  }));
  const [token, setToken] = useState<any>(access || null);

  const handleAuthorization = async () => {
    if (!token || token.length === 0 || !refresh || refresh.length === 0) {
      console.log("NO ACCESS OR REFRESH TOKENS");
      logoutUser();
      return setToken("expired");
    }

    const decodedAccess: any = jwt(access);
    const decodedRefresh: any = jwt(refresh);

    const expAccess = new Date(decodedAccess.exp * 1000);
    const expRefresh = new Date(decodedRefresh.exp * 1000);
    const now = new Date();
    const isAccessTokenExpired = now > expAccess;
    const isRefreshTokenExpired = now > expRefresh;

    if (isAccessTokenExpired && isRefreshTokenExpired) {
      console.log("isAccessTokenExpired && isRefreshTokenExpired");
      logoutUser();
      return setToken("expired");
    }

    if (isAccessTokenExpired && !isRefreshTokenExpired) {
      console.log("isAccessTokenExpired && !isRefreshTokenExpired");
      const { data, error } = await refreshToken({
        refreshToken: refresh,
      });
      if (error) {
        logoutUser();
        return setToken("expired");
      } else {
        console.log("TOKEN REFRESHED ---");
        console.log(data);
        updateToken(data?.access);
        return setToken(data?.access);
      }
    }

    setToken(access);
  };

  useFocusEffect(
    useCallback(() => {
      handleAuthorization();
    }, [token])
  );

  return token;
};
