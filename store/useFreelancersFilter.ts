import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useFreelancersFilterStore = create(
  persist(
    (set, get) => ({
      freelancer_type: null,
      type: null,
      date: null,
      addFreelancerType: (freelancer_type: string | null) =>
        set(() => ({
          freelancer_type,
        })),

      addType: (type: string | null) =>
        set(() => ({
          type,
        })),

      addDate: (date: any) =>
        set(() => ({
          date,
        })),

      clear: () =>
        set(() => ({
          freelancer_type: null,
          type: null,
          date: null,
        })),
    }),
    {
      name: "freelancer-filter-store-v1-4",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
