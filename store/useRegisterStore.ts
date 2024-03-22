import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useRegisterStore = create(
  persist(
    (set, get) => ({
      user: {
        firstName: null,
        lastName: null,
        email: null,
        phone: null,
        password: null,
        username: null,
        type: null,
        jobType: null,
        dateOfBirth: null,
        adr: null,
        wilaya: null,
        province: null,
        code: null,
        image: null,
      },
      registerForm: (
        firstName: string,
        lastName: string,
        email: string,
        phone: string,
        password: string,
        type: "client" | "freelancer"
      ) =>
        set((state: { user: any }) => ({
          user: {
            ...state.user,
            firstName,
            lastName,
            email,
            phone,
            password,
            type,
          },
        })),

      addName: (username: string) =>
        set((state: { user: any }) => ({
          user: {
            ...state.user,
            username,
          },
        })),
      clearName: () =>
        set((state: { user: any }) => ({
          user: {
            ...state.user,
            username: "",
          },
        })),
      addImage: (image: string) =>
        set((state: { user: any }) => ({
          user: {
            ...state.user,
            image,
          },
        })),
      addJobType: (jobType: any) =>
        set((state: { user: any }) => ({
          user: {
            ...state.user,
            jobType,
          },
        })),
      addDateOfBirth: (dateOfBirth: string) =>
        set((state: { user: any }) => ({
          user: {
            ...state.user,
            dateOfBirth,
          },
        })),
      addAdr: (adr: string, wilaya: string, province: string, code: string) =>
        set((state: { user: any }) => ({
          user: {
            ...state.user,
            adr,
            wilaya,
            province,
            code,
          },
        })),
      clearAll: () =>
        set(() => ({
          user: {
            firstName: null,
            lastName: null,
            email: null,
            phone: null,
            password: null,
            username: null,
            type: null,
            jobType: null,
            dateOfBirth: null,
            adr: null,
            wilaya: null,
            province: null,
            code: null,
            image: null,
          },
        })),
    }),
    {
      name: "register-store-v1-2",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
