import { View, Text, Pressable, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { RFValue } from "react-native-responsive-fontsize";
import { Image } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { black, primary, text4 } from "@/constants/Colors";
import { router } from "expo-router";
import Loading from "./loading";
import { ActivityIndicator, Button } from "react-native-paper";
import { useFreelancersStore } from "@/store/useFreelancersStore";
import { useTranslation } from "react-i18next";

export const BestNotedCard: React.FC<{
  bookmark: boolean;
  loading: boolean;
  item: any;
  noSave: boolean;
  notClickable: boolean;
}> = ({ item, noSave }) => {
  const { t } = useTranslation();

  console.log("ITEM");
  console.log(item);

  const { addFreelancer, data, removeFreelancer } = useFreelancersStore(
    (state: any) => ({
      addFreelancer: state.addFreelancer,
      data: state.data,
      removeFreelancer: state.removeFreelancer,
    })
  );

  const isSaved = data.some((f: any) => f.id === item?.id);
  const [value, setValue] = useState(isSaved);

  const freelancerType: { [key: string]: string } = {
    maid: t("Femme de menage"),
    elderly_sitter: t("Garde malade"),
  };
  return (
    <Pressable
      onPress={() => {
        router.push({
          pathname: "/client/freelancer-profile",
          params: { id: item?.id },
        });
      }}
      style={{
        width: "100%",
        backgroundColor: "white",
        borderRadius: 4,
        shadowColor: "rgba(197, 195, 195, 0.15)",
        shadowOffset: {
          width: 4,
          height: 4,
        },
        shadowOpacity: 1,
        shadowRadius: 22,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: RFValue(12),
          backgroundColor: "white",
        }}
      >
        <View
          style={{
            position: "relative",
            justifyContent: "center",
          }}
        >
          {!noSave && (
            <View
              style={{
                position: "absolute",
                right: RFValue(6),
                top: RFValue(10),
                zIndex: 50,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  if (isSaved) {
                    setValue(false);
                    removeFreelancer(item?.id);
                  } else {
                    setValue(true);
                    addFreelancer(item);
                  }
                }}
              >
                <Ionicons
                  name={value ? "bookmark" : "bookmark-outline"}
                  color={"white"}
                  size={16}
                />
              </TouchableOpacity>
            </View>
          )}
          <Image
            source={
              item?.profilePictureUrl
                ? {
                    uri: item?.profilePictureUrl,
                  }
                : require("@/assets/images/profile.png")
            }
            alt="img"
            style={{
              width: 120,
              height: 100,
              borderRadius: 8,
              aspectRatio: 1,
              objectFit: "cover",
              backgroundColor: "#E5D9EA",
            }}
          />
        </View>
        <View
          style={{
            flexDirection: "column",
            gap: RFValue(3),
            paddingVertical: RFValue(10),
            flex: 1,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: RFValue(8),
              alignItems: "center",
              justifyContent: "space-between",
              flex: 1,
              paddingRight: RFValue(25),
            }}
          >
            <View
              style={{
                width: RFValue(160),
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: RFValue(16),
                    fontWeight: "600",
                    color: "black",
                  }}
                >
                  {item?.firstName} {item?.lastName}
                </Text>
              </View>
            </View>
          </View>
          <Text
            style={{
              fontSize: RFValue(10),
              color: black,
            }}
          >
            {item?.freelancer_type
              ?.map(
                (type: string) =>
                  freelancerType[type?.toLocaleLowerCase()] || type
              )
              ?.toString()}
          </Text>
          <Text
            numberOfLines={2}
            style={{
              fontSize: RFValue(10),
              color: text4,
              maxWidth: RFValue(170),
            }}
          >
            {item?.about}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: RFValue(6),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons name="star" size={16} color={"#FADB14"} />
              <Text
                style={{
                  color: "#FADB14",
                  fontSize: 10,
                  fontWeight: "600",
                }}
              >
                {parseInt(item?.rating)}
              </Text>
            </View>

            <Text
              style={{
                color: black,
                fontSize: 10,
                letterSpacing: 0.1,
              }}
            >
              {item?.numberOfMissions > 1
                ? `${item?.numberOfMissions || 0} missions`
                : `${item?.numberOfMissions || 0} mission`}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

interface BestNotedProps {
  titleShown?: boolean;
  freelancersHasNext?: boolean;
  bookmark?: boolean;
  data?: any;
  loading?: boolean;
  loadingBtn?: boolean;
  noSave?: boolean;
  refetchFreelancers?: () => void;
}

const BestNoted: React.FC<BestNotedProps> = ({
  titleShown = true,
  bookmark = false,
  freelancersHasNext = false,
  data = null,
  loading = false,
  loadingBtn = false,
  noSave,
  refetchFreelancers = null,
}) => {
  const { t, i18n } = useTranslation();

  return (
    <View
      style={{
        paddingTop: RFValue(titleShown ? 26 : 0),
        paddingBottom: RFValue(80),
        flex: 1,
      }}
    >
      <View
        style={{
          flexDirection: "column",
          gap: RFValue(18),
          flex: 1,
        }}
      >
        {titleShown && (
          <Text
            style={{
              fontSize: RFValue(22),
              fontWeight: "600",
              textAlign: i18n.language === "ar" ? "right" : "left",
            }}
          >
            {t("Les mieux notés")}
          </Text>
        )}

        {data?.length > 0 && !loading
          ? data?.map((item: any, index: number) => (
              <React.Fragment key={index}>
                <BestNotedCard
                  loading={loading}
                  item={item}
                  bookmark={bookmark}
                  noSave={Boolean(noSave)}
                  notClickable
                />
              </React.Fragment>
            ))
          : null}

        {!titleShown && freelancersHasNext && !loading && (
          <View
            style={{
              justifyContent: "center",
              alignContent: "center",
              flex: 1 / 2,
              flexDirection: "row",
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
              loading={loadingBtn}
              onPress={() => refetchFreelancers && refetchFreelancers()}
            >
              <Text
                style={{
                  fontSize: RFValue(12),
                  color: "white",
                  fontWeight: "600",
                }}
              >
                Load more
              </Text>
            </Button>
          </View>
        )}
         {titleShown && !loading && data?.length === 0 && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            paddingTop: RFValue(25),
            alignItems: titleShown ? "flex-start" : "center",
          }}
        >
          <Image
            alt="empty"
            source={require("@/assets/images/empty.png")}
            style={{
              width: 80,
              height: 80,
              resizeMode: "contain",
            }}
          />
        </View>
      )}
      </View>
     
    </View>
  );
};

export default BestNoted;
