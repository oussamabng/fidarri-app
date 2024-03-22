import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useFreelancersStore = create(
  persist(
    (set, get) => ({
      data: [],

      addFreelancer: (freelancer: any) =>
        set((state: any) => ({
          data: [...state.data, freelancer],
        })),

      removeFreelancer: (freelancerId: number) =>
        set((state: any) => ({
          data: state.data.filter((f: any) => f.id !== freelancerId),
        })),
      isFreelancerSaved: (freelancerId: number) =>
        set((state: any) => {
          const isSaved = state.data.some((f: any) => f.id === freelancerId);
          return isSaved;
        }),
    }),
    {
      name: "freelancers-store-v3",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
