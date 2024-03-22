import { black, primary } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Button } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { getClientAddresses } from "@/graphql/services/addresses.service";
import { useAuthStore } from "@/store/useAuthStore";
import Loading from "@/components/loading";
import Input from "@/components/input";

const { width } = Dimensions.get("screen");

const EmptyAdr = () => {
  const navigation = useRouter();

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: RFValue(30),
      }}
    >
      <Image
        alt="marker"
        source={require("@/assets/images/marker.png")}
        style={{
          width: RFValue(130),
          height: RFValue(130),
          resizeMode: "contain",
        }}
      />
      <Text
        style={{
          textAlign: "center",
          fontSize: RFValue(12),
          color: "#6F6F6F",
          maxWidth: width - 50,
        }}
      >
        Nous vous recommandons vivement d'ajouter votre adresse à votre profil.
        Cela nous permettra de mieux adapter nos services
      </Text>
      <Button
        style={{
          borderRadius: 4,
          height: 45,
          justifyContent: "center",
        }}
        mode="contained"
        buttonColor={primary}
        onPress={() => {
          navigation.push("/client/(auth)/add-address");
        }}
      >
        <Text
          style={{
            fontSize: RFValue(14),
            color: "white",
            fontWeight: "600",
          }}
        >
          Ajouter une adresse
        </Text>
      </Button>
    </View>
  );
};

const Addresses = () => {
  const { access, id } = useAuthStore((state: any) => ({
    access: state.access,
    id: state.id,
  }));
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const navigation = useRouter();

  const fetchAddresses = async () => {
    setLoading(true);
    const { data, error } = await getClientAddresses(0, 10, id, access, true);

    if (error) {
      setLoading(false);

      return alert("Error fetching addresses");
    }

    setData(data.nodes);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchAddresses();
    }, [])
  );

  if (loading) return <Loading size="small" />;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <View
        style={{
          paddingHorizontal: RFValue(25),
        }}
      >
        <Text
          style={{
            fontSize: RFValue(24),
            color: black,
            fontWeight: "600",
          }}
        >
          Mes Adresses
        </Text>
      </View>
      {data?.length === 0 && !loading && <EmptyAdr />}

      {data?.length > 0 && !loading && (
        <ScrollView
          bounces={false}
          style={{
            flex: 1,
            paddingHorizontal: RFValue(25),
            paddingVertical: RFValue(50),
          }}
        >
          <View
            style={{
              flexDirection: "column",
              gap: RFValue(20),
            }}
          >
            {data.map((item: any, index: number) => (
              <View
                key={index}
                style={{
                  flexDirection: "column",
                  gap: RFValue(16),
                }}
              >
                <Input
                  label={`Adresse ${index === 0 ? "Primary" : index + 1}`}
                  iconPosition="right"
                  iconName="pencil-outline"
                  onIconClick={() => {
                    navigation.push({
                      pathname: `/freelancer/(auth)/update-address`,
                      params: {
                        address: JSON.stringify(item.address),
                        numberOfPieces: item.numberOfPieces,
                        homeId: item.id,
                      },
                    });
                  }}
                  disabledBg
                  disabled
                  defaultValue={item?.address?.city}
                  numberOfLines={1}
                />
              </View>
            ))}
            <TouchableOpacity
              style={{
                flexDirection: "row",
                gap: RFValue(6),
                paddingTop: RFValue(10),
                justifyContent: "flex-end",
                alignItems: "center",
              }}
              onPress={() => {
                navigation.push("/freelancer/(auth)/add-address");
              }}
            >
              <Feather name="plus" size={24} color={primary} />
              <Text
                style={{
                  color: primary,
                  fontSize: RFValue(14),
                  fontWeight: "500",
                }}
              >
                Add New Address
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Addresses;
