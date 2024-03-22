import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useSearchStore = create(
  persist(
    (set, get) => ({
      searchEnabled: false,
      update: (value: boolean) =>
        set(() => ({
          searchEnabled: value,
        })),
    }),
    {
      name: "prefs-search-v1-4",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
