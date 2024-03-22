import "react-native-reanimated";
import "react-native-gesture-handler";

import { Stack } from "expo-router";
import { Platform, StatusBar } from "react-native";
import { PaperProvider, DefaultTheme } from "react-native-paper";
import "@/i18n/index";

import BackHeader from "@/components/backHeader";

//apollo
import { ApolloProvider } from "@apollo/client";
import client from "@/graphql/config";

import { GestureHandlerRootView } from "react-native-gesture-handler";

const StackLayout = () => {
  const theme = {
    ...DefaultTheme,
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ApolloProvider client={client}>
        <PaperProvider theme={theme}>
          <StatusBar barStyle="dark-content" />

          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen
              name="forgetPassword"
              options={{
                headerShown: true,
                header: ({ navigation }) => (
                  <BackHeader navigation={navigation} />
                ),
              }}
            />

            <Stack.Screen
              name="conditionsGenerale"
              options={{
                headerShown: true,
                header: ({ navigation }) => (
                  <BackHeader navigation={navigation} />
                ),
              }}
            />
            <Stack.Screen
              name="politique"
              options={{
                headerShown: true,
                header: ({ navigation }) => (
                  <BackHeader navigation={navigation} />
                ),
              }}
            />
            <Stack.Screen
              name="freelancer/invoices"
              options={{
                headerShown: true,
                header: ({ navigation }) => (
                  <BackHeader navigation={navigation} />
                ),
              }}
            />

            <Stack.Screen
              name="reviews"
              options={{
                headerShown: true,
                header: ({ navigation }) => (
                  <BackHeader navigation={navigation} />
                ),
              }}
            />

            <Stack.Screen
              name="filter"
              options={{
                presentation: "containedModal",
                headerShown: true,
                header: ({ navigation }) => (
                  <BackHeader navigation={navigation} />
                ),
              }}
            />
            <Stack.Screen
              name="notifications"
              options={{
                presentation: "containedModal",
                headerShown: true,
                header: ({ navigation }) => (
                  <BackHeader navigation={navigation} />
                ),
              }}
            />
            <Stack.Screen
              name="review"
              options={{
                presentation: "modal",
                headerShown: Platform.OS === "android" ? true : false,
                header: ({ navigation }) => (
                  <BackHeader navigation={navigation} />
                ),
              }}
            />

            <Stack.Screen
              name="freelancer/create-schedule"
              options={{
                presentation: "modal",
                headerShown: Platform.OS === "android" ? true : false,
                header: ({ navigation }) => (
                  <BackHeader navigation={navigation} />
                ),
              }}
            />
            <Stack.Screen
              name="client/add-home"
              options={{
                presentation: "modal",
                headerShown: Platform.OS === "android" ? true : false,
                header: ({ navigation }) => (
                  <BackHeader navigation={navigation} />
                ),
              }}
            />
            <Stack.Screen
              name="client/update-home"
              options={{
                presentation: "modal",
                headerShown: Platform.OS === "android" ? true : false,
                header: ({ navigation }) => (
                  <BackHeader navigation={navigation} />
                ),
              }}
            />
            <Stack.Screen
              name="freelancer/(auth)/checkPhone"
              options={{
                headerShown: true,
                header: ({ navigation }) => (
                  <BackHeader navigation={navigation} />
                ),
              }}
            />
            <Stack.Screen
              name="freelancer/(auth)/help"
              options={{
                headerShown: true,
                header: ({ navigation }) => (
                  <BackHeader navigation={navigation} />
                ),
              }}
            />
            <Stack.Screen
              name="freelancer/schedule"
              options={{
                headerShown: true,
                header: ({ navigation }) => (
                  <BackHeader navigation={navigation} />
                ),
              }}
            />
            <Stack.Screen
              name="client/(auth)/profile-details"
              options={{
                headerShown: true,
                header: ({ navigation }) => (
                  <BackHeader navigation={navigation} />
                ),
              }}
            />
            <Stack.Screen
              name="freelancer/(auth)/profile-details"
              options={{
                headerShown: true,
                header: ({ navigation }) => (
                  <BackHeader navigation={navigation} />
                ),
              }}
            />
            <Stack.Screen
              name="client/(auth)/addresses"
              options={{
                headerShown: true,
                header: ({ navigation }) => (
                  <BackHeader navigation={navigation} />
                ),
              }}
            />
            <Stack.Screen
              name="client/(auth)/update-address"
              options={{
                headerShown: true,
                header: ({ navigation }) => (
                  <BackHeader navigation={navigation} />
                ),
              }}
            />
            <Stack.Screen
              name="client/(auth)/document"
              options={{
                headerShown: true,
                header: ({ navigation }) => (
                  <BackHeader navigation={navigation} />
                ),
              }}
            />
            <Stack.Screen
              name="client/(auth)/add-address"
              options={{
                headerShown: true,
                header: ({ navigation }) => (
                  <BackHeader navigation={navigation} />
                ),
              }}
            />
            <Stack.Screen
              name="freelancer/(auth)/settings"
              options={{
                headerShown: true,
                header: ({ navigation }) => (
                  <BackHeader navigation={navigation} />
                ),
              }}
            />
            <Stack.Screen
              name="freelancer/(auth)/language"
              options={{
                headerShown: true,
                header: ({ navigation }) => (
                  <BackHeader navigation={navigation} />
                ),
              }}
            />
            <Stack.Screen
              name="freelancer/(auth)/updateEmail"
              options={{
                headerShown: true,
                header: ({ navigation }) => (
                  <BackHeader navigation={navigation} />
                ),
              }}
            />
            <Stack.Screen
              name="client/(auth)/updatePassword"
              options={{
                headerShown: true,
                header: ({ navigation }) => (
                  <BackHeader navigation={navigation} />
                ),
              }}
            />
            <Stack.Screen
              name="freelancer/(auth)/updatePassword"
              options={{
                headerShown: true,
                header: ({ navigation }) => (
                  <BackHeader navigation={navigation} />
                ),
              }}
            />
            <Stack.Screen
              name="freelancer/(auth)/changePassword"
              options={{
                headerShown: true,
                header: ({ navigation }) => (
                  <BackHeader navigation={navigation} />
                ),
              }}
            />
            <Stack.Screen
              name="updatePhone"
              options={{
                headerShown: true,
                header: ({ navigation }) => (
                  <BackHeader navigation={navigation} />
                ),
              }}
            />

            <Stack.Screen
              name="freelancer/(auth)/checkEmail"
              options={{
                headerShown: true,
                header: ({ navigation }) => (
                  <BackHeader navigation={navigation} />
                ),
              }}
            />
          </Stack>
        </PaperProvider>
      </ApolloProvider>
    </GestureHandlerRootView>
  );
};

export default StackLayout;
