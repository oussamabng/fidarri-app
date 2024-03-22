import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useBackHeaderStore = create(
  persist(
    (set, get) => ({
      display: "flex",
      update: (display: "flex" | "none") =>
        set(() => ({
          display,
        })),
    }),
    {
      name: "back-header-store-v1-4",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
