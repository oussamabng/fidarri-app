import Menu from "@/components/menu";
import SearchInput from "@/components/searchInput";
import { View, ScrollView, Image } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

import BestNoted from "@/components/bestNoted";
import React, { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { getFreelancers } from "@/graphql/services/freelancer.service";
import { useAuthStore } from "@/store/useAuthStore";
import { useFreelancersFilterStore } from "@/store/useFreelancersFilter";
import AuthProvider from "@/components/authProvider";
import { useTranslation } from "react-i18next";
import Loading from "@/components/loading";

const Freelancers = () => {
  const [freelancers, setFreelancers] = useState<any>([]);
  const [freelancersHasNext, setFreelancersHasNext] = useState(false);
  const [loadingFreelancers, setLoadingFreelancers] = useState(false);
  const [loadingFreelancersBtn, setLoadingFreelancersBtn] = useState(false);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(0);

  const { freelancer_type, type, date } = useFreelancersFilterStore(
    (state: any) => ({
      freelancer_type: state.freelancer_type,
      type: state.type,
      date: state.date,
    })
  );

  const { access } = useAuthStore((state: any) => ({
    access: state.access,
  }));

  const fetchFreelancers = async () => {
    setLoadingFreelancers(true);
    setLoadingFreelancersBtn(true);
    const { data, error } = await getFreelancers(
      access,
      0,
      limit + 5,
      search,
      freelancer_type,
      type,
      date
    );

    console.log("FETCHIN");
    console.log(data.nodes);

    if (error) {
      setLoadingFreelancers(false);
      setLoadingFreelancersBtn(false);

      return console.log("error in fetching freelancers");
    } else {
      setLimit((prevState) => prevState + 5);
      setFreelancersHasNext(data.hasNextPage);
      setFreelancers(data.nodes);
      setLoadingFreelancers(false);
      setLoadingFreelancersBtn(false);
    }
  };

  const refFetchFreelancers = async () => {
    setLoadingFreelancersBtn(true);
    const { data, error } = await getFreelancers(
      access,
      0,
      limit + 5,
      search,
      freelancer_type,
      type,
      date
    );

    console.log("FETCHING FREELANCERS -----------");
    console.log({ data, error });

    if (error) {
      setLoadingFreelancersBtn(false);

      alert(data);
    } else {
      setLimit((prevState) => prevState + 5);
      setFreelancersHasNext(data.hasNextPage);
      setFreelancers((prevState: any) => [...prevState, ...data.nodes]);
      setLoadingFreelancersBtn(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFreelancers();
    }, [search, freelancer_type, type, date])
  );

  return (
    <AuthProvider>
      <Menu>
        {loadingFreelancers ? (
          <Loading size="small" />
        ) : (
          <>
            {freelancers?.length > 0 && !loadingFreelancers ? (
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                  flex: 1,
                  paddingTop: RFValue(20),
                  paddingHorizontal: 25,
                  backgroundColor: "white",
                }}
              >
                <SearchInput
                  searchQuery={search}
                  setSearchQuery={setSearch}
                  enableSearch={true}
                  setEnableSearch={() => {}}
                />
                <BestNoted
                  data={freelancers}
                  loading={loadingFreelancers}
                  titleShown={false}
                  freelancersHasNext={freelancersHasNext}
                  refetchFreelancers={refFetchFreelancers}
                  loadingBtn={loadingFreelancersBtn}
                  noSave={false}
                />
              </ScrollView>
            ) : (
              <View
                style={{
                  flex: 1,
                  paddingHorizontal: RFValue(25),
                  marginTop: RFValue(25),
                }}
              >
                <SearchInput
                  searchQuery={search}
                  setSearchQuery={setSearch}
                  enableSearch={true}
                  setEnableSearch={() => {}}
                />
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
              </View>
            )}
          </>
        )}
      </Menu>
    </AuthProvider>
  );
};

export default Freelancers;
