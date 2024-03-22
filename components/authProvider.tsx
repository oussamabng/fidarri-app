import React from "react";
import { useAuth } from "@/useAuth";
import { router } from "expo-router";
import Loading from "./loading";
import { useAuthStore } from "@/store/useAuthStore";
import { View } from "react-native";

interface AuthProviderProps {
  checkLogout?: boolean;
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({
  checkLogout = false,
  children,
}) => {
  const token = useAuth();

  const { role, status } = useAuthStore((state: any) => ({
    role: state.role,
    status: state.status,
  }));

  const [approval, setApproval] = React.useState(false);

  React.useEffect(() => {
    if (checkLogout) {
      if (token !== null) {
        if (token === "expired") {
          setApproval(true);
        } else {
          if (status === "Verified") {
            if (role === "client") {
              router.replace("/client/(tabs)");
            } else {
              router.replace("/freelancer/(tabs)");
            }
          } else {
            setApproval(true);
          }
        }
      } else {
        setApproval(true);
      }
    } else {
      if (token !== null) {
        if (token === "expired") {
          router.replace("/login");
        } else {
          setApproval(true);
        }
      } else {
        router.replace("/login");
      }
    }
  }, []);

  if (!approval)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <Loading size="small" />
      </View>
    );

  if (approval) return <>{children}</>;
};

export default AuthProvider;
