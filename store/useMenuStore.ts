import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useMenuStore = create(
  persist(
    (set, get) => ({
      opened: null,
      update: (opened: boolean) =>
        set(() => ({
          opened,
        })),
    }),
    {
      name: "menu-store-v1-7",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
