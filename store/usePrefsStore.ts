import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const usePrefsStore = create(
  persist(
    (set, get) => ({
      type: null,
      update: (type: "freelancer" | "client") =>
        set(() => ({
          type,
        })),
    }),
    {
      name: "prefs-store-v1-6",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
