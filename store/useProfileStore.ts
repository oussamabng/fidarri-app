import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useProfileStore = create(
  persist(
    (set, get) => ({
      data: {
        email: null,
        firstName: null,
        lastName: null,
        username: null,
        rating: null,
        phoneNumber: null,
        missionsCompleted: null,
        accountStatus: null,
        profilePictureUrl: null,
        adr: null,
      },
      update: (newData: any) =>
        set((state: any) => ({
          data: {
            ...state.data,
            ...newData,
          },
        })),
      updateNames: (firstName: string, lastName: string, username: string) =>
        set((state: any) => ({
          data: {
            ...state.data,
            firstName,
            lastName,
            username,
          },
        })),
      updatePhone: (phoneNumber: string) =>
        set((state: any) => ({
          data: {
            ...state.data,
            phoneNumber,
          },
        })),
      clear: () =>
        set(() => ({
          data: {
            email: null,
            firstName: null,
            lastName: null,
            username: null,
            rating: null,
            phoneNumber: null,
            missionsCompleted: null,
            accountStatus: null,
            profilePictureUrl: null,
            adr: null,
          },
        })),
    }),
    {
      name: "profile-store-v1-3",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
