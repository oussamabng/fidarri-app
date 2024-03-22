import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      access: null,
      refresh: null,
      role: null,
      id: null,
      status: null,
      update: (
        access: string,
        refresh: string,
        role: string,
        id: number,
        status: string
      ) =>
        set(() => ({
          access,
          refresh,
          role,
          id,
          status,
        })),
      updateToken: (access: string) =>
        set((state: any) => ({
          ...state,
          access,
        })),

      logout: () =>
        set(() => ({
          access: null,
          refresh: null,
          role: null,
          id: null,
          status: null,
        })),
    }),
    {
      name: "auth-store-v1.0.0",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
